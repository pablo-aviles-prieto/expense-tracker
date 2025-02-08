/* eslint-disable no-case-declarations */
import sgMail from '@sendgrid/mail';
import cronParser from 'cron-parser';
import { addDays, format, isSameDay } from 'date-fns';
import cron, { ScheduledTask } from 'node-cron';
import { z } from 'zod';

import connectDb from '@/lib/mongoose-config';
import UserModel, { IUser } from '@/models/user/user-model';
import { BillingPeriod, Subscription } from '@/types';
import { getNextBillingDate } from '@/utils/get-next-billing-date';

type ParsedUser = Pick<IUser, '_id' | 'email' | 'subscriptions' | 'dateFormat' | 'currency'>;

interface SubscriptionDetails {
  data: Subscription;
  formattedNextBillingDate: string;
}

const notificationDataSchema = z.object({
  subscriptionName: z.string().min(1),
  nextBillingDate: z.string().min(1),
  subscriptionUrlPage: z.string().min(1),
  subscriptionAmount: z.string().min(1),
});

type NotificationData = z.infer<typeof notificationDataSchema>;

// TODO: Check the algorithm is working
// TODO: Check if it compiles correctly because the process.env used
class SubscriptionNotificationJob {
  private schedules = {
    midnight: '00 00 * * *',
  };
  private sendgridApiKey: string;
  private senderMailAcc: string;
  private sendgridNotificationMailTemplateId: string;

  constructor(
    sendgridApiKey: string,
    senderMailAcc: string,
    sendgridNotificationMailTemplateId: string
  ) {
    this.sendgridApiKey = sendgridApiKey;
    this.senderMailAcc = senderMailAcc;
    this.sendgridNotificationMailTemplateId = sendgridNotificationMailTemplateId;
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

      for (const sub of subscriptionsToNotify) {
        const formattedNextBillingDate = format(
          new Date(sub.nextBillingDate),
          userSubscriptions.dateFormat
        );

        emailPromises.push(
          this.sendNotificationMail(userSubscriptions.email, userSubscriptions.currency, {
            data: sub.subscription,
            formattedNextBillingDate,
          })
        );
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
            currency: 1,
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
    currency: string,
    subscriptionsDetails: SubscriptionDetails
  ): Promise<void> {
    sgMail.setApiKey(this.sendgridApiKey);

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.APP_BASE_URL_PROD
        : process.env.APP_BASE_URL_DEV;

    const dynamicData: NotificationData = {
      nextBillingDate: subscriptionsDetails.formattedNextBillingDate,
      subscriptionAmount: `${subscriptionsDetails.data.price}${currency}`,
      subscriptionName: subscriptionsDetails.data.name,
      subscriptionUrlPage: `${baseUrl}/dashboard/subscriptions`,
    };

    const emailData: sgMail.MailDataRequired = {
      to: email,
      from: this.senderMailAcc,
      subject: `Upcoming Subscription Billing Notification`,
      templateId: this.sendgridNotificationMailTemplateId,
      dynamicTemplateData: dynamicData,
    };

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
  process.env.SENDER_MAIL_ACC ?? '',
  process.env.SENDGRID_SUBSCRIPTION_MAIL_TEMPLATE_ID ?? ''
);
export default subscriptionNotificationSingleton;
