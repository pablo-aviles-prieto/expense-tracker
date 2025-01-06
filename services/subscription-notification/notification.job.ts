/* eslint-disable no-case-declarations */
import sgMail from '@sendgrid/mail';
import cronParser from 'cron-parser';
import { addDays, format, isSameDay } from 'date-fns';
import cron, { ScheduledTask } from 'node-cron';

import connectDb from '@/lib/mongoose-config';
import UserModel, { IUser } from '@/models/user/user-model';
import { BillingPeriod, Subscription } from '@/types';
import { getNextBillingDate } from '@/utils/get-next-billing-date';

type ParsedUser = Pick<IUser, '_id' | 'email' | 'subscriptions' | 'dateFormat'>;

interface SubscriptionDetails {
  data: Subscription;
  formattedNextBillingDate: string;
}

// TODO: Check the algorithm is working
// TODO: Check if it compiles correctly because the process.env used
class SubscriptionNotificationJob {
  private schedules = {
    midnight: '00 00 * * *',
  };
  private sendgridApiKey: string;
  private senderMailAcc: string;

  constructor(sendgridApiKey: string, senderMailAcc: string) {
    this.sendgridApiKey = sendgridApiKey;
    this.senderMailAcc = senderMailAcc;
  }

  private jobs: Map<string, { task: ScheduledTask; schedule: string }> = new Map();

  private initializeJobs(): void {
    const notifySubscribersJob = cron.schedule(
      this.schedules.midnight,
      async () => {
        console.log(`JOB :: Subscription notification process started at ${new Date()}`);
        await this.notifySubscribers();
        console.log(`JOB :: Subscription notification process finished at ${new Date()}`);
      },
      { scheduled: false }
    );

    this.jobs.set('notify-user-subscriptions', {
      task: notifySubscribersJob,
      schedule: this.schedules.midnight,
    });
  }

  private async notifySubscribers(): Promise<void> {
    const userSubscriptionsToNotify = await this.fetchUserActiveSubscriptions();
    console.dir(userSubscriptionsToNotify, { depth: null });
    const emailPromises: Promise<void>[] = [];

    for (const userSubscriptions of userSubscriptionsToNotify) {
      const subscriptionsToNotify = this.notifySubscriptionAlgorithm(
        userSubscriptions.subscriptions ?? []
      );

      if (subscriptionsToNotify.length > 0) {
        const subscriptionDetails = subscriptionsToNotify.map(sub => {
          const formattedNextBillingDate = format(
            new Date(sub.nextBillingDate),
            userSubscriptions.dateFormat
          );
          return {
            data: sub.subscription,
            formattedNextBillingDate,
          };
        });
        emailPromises.push(this.sendNotificationMail(userSubscriptions.email, subscriptionDetails));
      }
    }

    try {
      await Promise.all(emailPromises);
      console.log('All subscriptions notifications sent successfully.');
    } catch (error) {
      console.error('Error sending subscriptions notifications:', error);
    }
  }

  private async fetchUserActiveSubscriptions(): Promise<ParsedUser[]> {
    try {
      const users = await UserModel.aggregate([
        // Step 1: Match users who have at least one subscription
        { $match: { subscriptions: { $exists: true, $ne: [] } } },

        // Step 2: Filter subscriptions with notify: true
        {
          $project: {
            email: 1,
            dateFormat: 1,
            subscriptions: {
              $filter: {
                input: '$subscriptions',
                as: 'subscription',
                cond: { $eq: ['$$subscription.notify', true] },
              },
            },
          },
        },

        // Step 3: Exclude users where the filtered subscriptions array is empty
        { $match: { subscriptions: { $ne: [] } } },
      ]);

      return users;
    } catch (error) {
      console.error('Error fetching active subscriptions:', error);
      return [];
    }
  }

  /*
   ** Returns an array of subscriptions that need to be notified.
   ** The criteria for notification are:
   ** - 1 day before the next billing date for Monthly, BiMonthly, and Quarterly subscriptions.
   ** - 5 days and 1 day before the next billing date for SemiAnnually, Annually, and Biennially subscriptions.
   */
  private notifySubscriptionAlgorithm(
    subscriptionData: Subscription[]
  ): { subscription: Subscription; nextBillingDate: Date }[] {
    const today = new Date();
    const subscriptionsToNotify: {
      subscription: Subscription;
      nextBillingDate: Date;
    }[] = [];

    subscriptionData.forEach(subscription => {
      const nextBillingDate = getNextBillingDate({
        startDateStr: subscription.startDate,
        billingPeriod: subscription.billingPeriod,
      });

      switch (subscription.billingPeriod) {
        // Notify 1 day before the next billing date
        case BillingPeriod.Monthly:
        case BillingPeriod.BiMonthly:
        case BillingPeriod.Quarterly:
          const notifyDate = addDays(nextBillingDate, -1);
          if (isSameDay(today, notifyDate)) {
            subscriptionsToNotify.push({ subscription, nextBillingDate });
          }
          break;
        // Notify 5 days and 1 day before the next billing date
        case BillingPeriod.SemiAnnually:
        case BillingPeriod.Annually:
        case BillingPeriod.Biennially:
          const notifyFiveDaysBefore = addDays(nextBillingDate, -5);
          const notifyOneDayBefore = addDays(nextBillingDate, -1);

          if (isSameDay(today, notifyFiveDaysBefore) || isSameDay(today, notifyOneDayBefore)) {
            subscriptionsToNotify.push({ subscription, nextBillingDate });
          }
          break;
      }
    });
    return subscriptionsToNotify;
  }

  private async sendNotificationMail(
    email: string,
    subscriptionsDetails: SubscriptionDetails[]
  ): Promise<void> {
    sgMail.setApiKey(this.sendgridApiKey);

    const subscriptionDetails = subscriptionsDetails
      .map(subscription => {
        return `<li>Subscription: ${subscription.data.name}, Next Billing: ${subscription.formattedNextBillingDate}</li>`;
      })
      .join('');

    const emailData = {
      to: email,
      from: this.senderMailAcc,
      subject: `Upcoming Subscription Billing Notification`,
      html: `
        <p>Dear user,</p>
        <p>You have the following upcoming subscription payments:</p>
        <ul>${subscriptionDetails}</ul>
        <p>Thank you for using our service!</p>
      `,
      text: `Dear user,\n\nYou have the following upcoming subscription payments:\n${subscriptionsDetails
        .map(
          subscription =>
            `Subscription: ${subscription.data.name}, Next Billing: ${subscription.formattedNextBillingDate}`
        )
        .join('\n')}\n\nThank you for using our service!`,
    };

    // Send the email using SendGrid
    await sgMail.send(emailData);
  }

  public async startAllJobs(): Promise<void> {
    try {
      await connectDb();
      this.initializeJobs(); // Initialize jobs before starting
      this.jobs.forEach(({ task, schedule }, name) => {
        const interval = cronParser.parseExpression(schedule);
        const nextExecution = interval.next().toString();
        console.log(
          `Starting job: ${name} with schedule: ${schedule}, next execution: ${nextExecution}`
        );
        task.start();
      });
    } catch (error) {
      console.error('Failed to start cron jobs. ERROR:', error);
    }
  }

  public stopAllJobs(): void {
    this.jobs.forEach(({ task, schedule }, name) => {
      console.log(`Stopping job: ${name}`);
      task.stop();
    });
  }
}

const subscriptionNotificationSingleton = new SubscriptionNotificationJob(
  process.env.SENDGRID_API_KEY ?? '',
  process.env.SENDER_MAIL_ACC ?? ''
);
export default subscriptionNotificationSingleton;
