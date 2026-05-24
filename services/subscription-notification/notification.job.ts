/* eslint-disable no-case-declarations */
import cronParser from 'cron-parser';
import { addDays, format, isSameDay } from 'date-fns';
import cron, { ScheduledTask } from 'node-cron';
import { z } from 'zod';

import connectDb from '@/lib/mongoose-config';
import { ContantMailPayload, resend } from '@/lib/resend';
import UserModel, { IUser } from '@/models/user/user-model';
import { renderSubscriptionMailHtml } from '@/services/mail-templates/subscription-mail-html';
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

export type NotificationData = z.infer<typeof notificationDataSchema>;

class SubscriptionNotificationJob {
  private schedules = {
    midnight: '20 01 * * *',
  };

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
    const emailPromises: Promise<void>[] = [];
    const subscriptionNotificationsSent: { email: string; subscriptionName: string }[] = [];

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
        subscriptionNotificationsSent.push({
          email: userSubscriptions.email,
          subscriptionName: sub.subscription.name,
        });
      }
    }

    try {
      await Promise.all(emailPromises);
      console.log(
        `${subscriptionNotificationsSent.length} subscriptions notifications sent successfully.`
      );
      if (subscriptionNotificationsSent.length > 0) {
        console.log('Notifications sent to:');
        subscriptionNotificationsSent.forEach(sub =>
          console.log(`${sub.email}, for the subscription ${sub.subscriptionName}`)
        );
      }
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
          const theDayBefore = addDays(nextBillingDate, -1);
          if (isSameDay(today, theDayBefore)) {
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
    // The cron process is started by `tsx` alongside `next start` and does not
    // inherit NODE_ENV=production, so we must not rely on it.  Prefer the prod
    // URL when it is set, fall back to dev for local development.
    const baseUrl = process.env.APP_BASE_URL_PROD ?? process.env.APP_BASE_URL_DEV;

    const dynamicData: NotificationData = {
      nextBillingDate: subscriptionsDetails.formattedNextBillingDate,
      subscriptionAmount: `${subscriptionsDetails.data.price}${currency}`,
      subscriptionName: subscriptionsDetails.data.name,
      subscriptionUrlPage: `${baseUrl}/dashboard/subscriptions`,
    };

    const emailData: ContantMailPayload = {
      to: email,
      subject: `Reminder: Your Subscription Payment is Coming Up`,
      html: renderSubscriptionMailHtml(dynamicData),
    };

    // #region agent log
    fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
      body: JSON.stringify({
        sessionId: '0f60bd',
        runId: 'initial',
        hypothesisId: 'H1',
        location: 'services/subscription-notification/notification.job.ts:215',
        message: 'sendNotificationMail payload baseline',
        data: {
          toDomain: email.includes('@') ? email.split('@')[1] : null,
          hasBaseUrl: Boolean(baseUrl),
          nodeEnv: process.env.NODE_ENV ?? null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    try {
      await resend.sendMail(emailData);
      // #region agent log
      fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
        body: JSON.stringify({
          sessionId: '0f60bd',
          runId: 'initial',
          hypothesisId: 'H3',
          location: 'services/subscription-notification/notification.job.ts:232',
          message: 'sendNotificationMail success',
          data: { toDomain: email.includes('@') ? email.split('@')[1] : null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
        body: JSON.stringify({
          sessionId: '0f60bd',
          runId: 'initial',
          hypothesisId: 'H3',
          location: 'services/subscription-notification/notification.job.ts:248',
          message: 'sendNotificationMail failure',
          data: {
            errorName: error instanceof Error ? error.name : 'UnknownError',
            errorMessage: error instanceof Error ? error.message : String(error),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      throw error;
    }
  }

  public async startAllJobs(): Promise<void> {
    try {
      // #region agent log
      fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
        body: JSON.stringify({
          sessionId: '0f60bd',
          runId: 'initial',
          hypothesisId: 'H1',
          location: 'services/subscription-notification/notification.job.ts:258',
          message: 'startAllJobs env sanity',
          data: {
            nodeEnv: process.env.NODE_ENV ?? null,
            hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
            hasSenderMail: Boolean(process.env.SENDER_MAIL),
            hasProdBaseUrl: Boolean(process.env.APP_BASE_URL_PROD),
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion

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

const subscriptionNotificationSingleton = new SubscriptionNotificationJob();
export default subscriptionNotificationSingleton;
