import cronParser from 'cron-parser';
import cron, { ScheduledTask } from 'node-cron';

import connectDb from '@/lib/mongoose-config';
import UserModel from '@/models/user/user-model';
import { User } from '@/types';

class SubscriptionNotificationJob {
  private schedules = {
    midnight: '00 00 * * *',
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
    console.dir(userSubscriptionsToNotify, { depth: null });

    for (const userSubscriptions of userSubscriptionsToNotify) {
      console.log(`Notifying subscriber: ${userSubscriptions.email}`);
      // TODO: Calculate if is necessary to send the notification
      // If is necessary, send notification via this.sendNotificationMail method
    }

    console.log(`Finished processing notifications.`);
  }

  private async fetchUserActiveSubscriptions(): Promise<Pick<User, 'email' | 'subscriptions'>[]> {
    try {
      const users = await UserModel.aggregate([
        // Step 1: Match users who have at least one subscription
        { $match: { subscriptions: { $exists: true, $ne: [] } } },

        // Step 2: Filter subscriptions with notify: true
        {
          $project: {
            email: 1,
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

  private async sendNotificationMail() {}

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

const subscriptionNotificationSingleton = new SubscriptionNotificationJob();
export default subscriptionNotificationSingleton;
