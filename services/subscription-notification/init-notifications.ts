import subscriptionNotificationSingleton from './notification.job';

(async () => {
  console.log(`Starting cron jobs at ${new Date().toLocaleString()}...`);
  await subscriptionNotificationSingleton.startAllJobs();
  console.log('Cron jobs started!');
})();
