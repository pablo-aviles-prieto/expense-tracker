import { Typography } from '@/components/ui/typography';
import { FeatureCard, FeatureCardProps } from './feature-card';

const FEATURES_DATA: FeatureCardProps[] = [
  {
    iconType: 'chart',
    title: 'Dashboard',
    description:
      'Get a quick overview of your finances with key performance indicators and visually engaging charts. See how your income and expenses stack up for a clear picture of your financial health.',
  },
  {
    iconType: 'transactions',
    title: 'Transactions',
    description:
      'Easily manage your finances by adding transactions one-by-one or uploading in bulk via CSV. View all transactions in a detailed list with powerful filters for dates, categories, and personalized notes.',
  },
  {
    iconType: 'subscription',
    title: 'Subscriptions',
    description:
      'Stay on top of subscriptions with a comprehensive view of active and inactive services, billing periods, and upcoming renewal dates. Set email reminders to alert you days before any subscription renews.',
  },
];

export const Features = () => {
  return (
    <section className='container grid grid-cols-1 gap-8 md:grid-cols-3'>
      <Typography
        variant='h1'
        className='col-span-full text-center text-xl sm:text-2xl md:text-4xl'
      >
        Empower Your Finances
      </Typography>
      {FEATURES_DATA.map(feature => (
        <FeatureCard key={feature.title} {...feature} />
      ))}
    </section>
  );
};
