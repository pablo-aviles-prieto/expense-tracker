import cron, { ScheduledTask } from 'node-cron';

import connectDb from '@/lib/mongoose-config';
import UserModel from '@/models/user/user-model';
import { User } from '@/types';

// TODO: Create custom server.ts
// https://nextjs.org/docs/14/pages/building-your-application/configuring/custom-server
// https://medium.com/@farmaan30327/running-a-scheduled-job-in-nextjs-with-node-cron-77f0433a713b

class SubscriptionNotificationJob {
  private schedules = {
    midnight: '00 16 * * *',
  };

  private jobs: Map<string, ScheduledTask> = new Map();

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

    this.jobs.set('notify-user-subscriptions', notifySubscribersJob);
  }

  private async notifySubscribers(): Promise<void> {
    const userSubscriptionsToNotify = await this.fetchUserActiveSubscriptions();
    console.log('userSubscriptionsToNotify', userSubscriptionsToNotify);

    for (const userSubscriptions of userSubscriptionsToNotify) {
      console.log(
        `Notifying subscriber: ${userSubscriptions.email}, about subscriptions: ${userSubscriptions.subscriptions}`
      );
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
      console.log('Establishing database connection...');
      await connectDb();
      console.log('Database connection established.');

      this.initializeJobs(); // Initialize jobs before starting
      this.jobs.forEach((job, name) => {
        console.log(`Starting job: ${name}`);
        job.start();
      });
    } catch (error) {
      console.error('Failed to start cron jobs due to database connection error:', error);
    }
  }
  // public startAllJobs(): void {
  //   this.initializeJobs(); // Initialize jobs before starting
  //   this.jobs.forEach((job, name) => {
  //     console.log(`Starting job: ${name}`);
  //     job.start();
  //   });
  // }

  public stopAllJobs(): void {
    this.jobs.forEach((job, name) => {
      console.log(`Stopping job: ${name}`);
      job.stop();
    });
  }
}

const subscriptionNotificationSingleton = new SubscriptionNotificationJob();
export default subscriptionNotificationSingleton;
