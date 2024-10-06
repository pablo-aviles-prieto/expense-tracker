import Image from 'next/image';

import { Icons } from '../icons';
import { Typography } from '../ui/typography';

export const Header = () => {
  return (
    <header className='h-16 border-b'>
      <div className='mx-auto flex h-full max-w-7xl items-center justify-between px-2 xl:px-0'>
        <Image src='/images/logo.webp' alt='Expense tracker logo' width={45} height={45} />
        <div className='flex items-center gap-x-4'>
          <Typography variant='h4' className='flex items-center gap-x-2'>
            <Icons.login className='h-4 w-4' /> Login
          </Typography>
          <Typography variant='h4' className='flex items-center gap-x-2'>
            <Icons.signup className='h-4 w-4' /> Register
          </Typography>
        </div>
      </div>
    </header>
  );
};
