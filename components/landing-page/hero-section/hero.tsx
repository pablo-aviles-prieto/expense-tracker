import { Typography } from '../../ui/typography';
import { DisintegrationDemo } from '../disintegration-test';
import { ActionButton } from './action-button';

export const HeroSection = () => {
  return (
    <div className='mx-auto max-w-5xl text-balance text-center'>
      <Typography className='font-rifton text-xl sm:text-3xl md:text-4xl xl:text-5xl'>
        Manage your transactions and subscriptions with ease
      </Typography>
      <Typography variant='h5' className='mx-auto my-6 max-w-sm font-normal text-gray-400'>
        Track your incomes, expenses and subscriptions all in one place
      </Typography>
      <DisintegrationDemo />
      <ActionButton />
    </div>
  );
};
