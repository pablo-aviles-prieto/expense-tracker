import Image from 'next/image';

import { Icons } from '../icons';
import { Typography } from '../ui/typography';

// TODO: Clean unused landing images
export const Header = () => {
  return (
    <header className='h-16'>
      <div className='container mx-auto flex h-full items-center justify-between'>
        <Image src='/images/logo.webp' alt='Expense tracker logo' width={45} height={45} />
        <div className='flex items-center gap-x-4'>
          <Typography variant='h5' className='flex items-center gap-x-2'>
            <Icons.login className='size-4' /> Log in
          </Typography>
          {/* TODO: Convert this into a button and remove icons like fanfix */}
          <Typography variant='h5' className='flex items-center gap-x-1'>
            <Icons.signup className='size-4' /> Sign up
          </Typography>
        </div>
      </div>
    </header>
  );
};
