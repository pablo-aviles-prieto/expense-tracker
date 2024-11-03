import { Typography } from '@/components/ui/typography';
import { FeatureCard } from './feature-card';

const Icon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    stroke-width='2'
    stroke-linecap='round'
    stroke-linejoin='round'
    className='lucide lucide-brain size-6 text-primary'
  >
    <path d='M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z'></path>
    <path d='M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z'></path>
    <path d='M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4'></path>
    <path d='M17.599 6.5a3 3 0 0 0 .399-1.375'></path>
    <path d='M6.003 5.125A3 3 0 0 0 6.401 6.5'></path>
    <path d='M3.477 10.896a4 4 0 0 1 .585-.396'></path>
    <path d='M19.938 10.5a4 4 0 0 1 .585.396'></path>
    <path d='M6 18a4 4 0 0 1-1.967-.516'></path>
    <path d='M19.967 17.484A4 4 0 0 1 18 18'></path>
  </svg>
);

const FEATURES_DATA = [
  {
    icon: Icon,
    title: 'Dashboard',
    description:
      'Get a quick overview of your finances with key performance indicators and visually engaging charts. See how your income and expenses stack up for a clear picture of your financial health.',
  },
  {
    icon: Icon,
    title: 'Transactions',
    description:
      'Easily manage your finances by adding transactions one-by-one or uploading in bulk via CSV. View all transactions in a detailed list with powerful filters for dates, categories, and personalized notes.',
  },
  {
    icon: Icon,
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
