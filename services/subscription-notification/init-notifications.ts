import subscriptionNotificationSingleton from './notification.job';

(async () => {
  // #region agent log
  fetch('http://127.0.0.1:7638/ingest/adc2a1c0-19d9-4b6f-ae7a-888f5620a0ee', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '0f60bd' },
    body: JSON.stringify({
      sessionId: '0f60bd',
      runId: 'initial',
      hypothesisId: 'H5',
      location: 'services/subscription-notification/init-notifications.ts:4',
      message: 'cron init process context',
      data: {
        nodeEnv: process.env.NODE_ENV ?? null,
        pid: process.pid,
        cwd: process.cwd(),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  console.log(`Starting cron jobs at ${new Date().toLocaleString()}...`);
  await subscriptionNotificationSingleton.startAllJobs();
  console.log('Cron jobs started!');
})();
