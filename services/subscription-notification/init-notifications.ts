import subscriptionNotificationSingleton from './notification.job';

(async () => {
  console.log('Starting cron jobs...');
  await subscriptionNotificationSingleton.startAllJobs();
  console.log('Cron jobs started!');
})();
