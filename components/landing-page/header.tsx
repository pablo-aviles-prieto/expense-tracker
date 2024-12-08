import Image from 'next/image';
import Link from 'next/link';

import ShinyButton from '../ui/shiny-button';
import { Typography } from '../ui/typography';

export const Header = () => {
  return (
    <header className='h-16'>
      <div className='container mx-auto flex h-full items-center justify-between'>
        <Image src='/images/logo.webp' alt='Expense tracker logo' width={45} height={45} />
        <div className='flex items-center gap-x-4'>
          <Link href='/auth?page=login'>
            <Typography variant='h5' className='flex items-center gap-x-2'>
              Log in
            </Typography>
          </Link>
          <Link href='/auth?page=signup'>
            <ShinyButton className='font-inter'>Sign up</ShinyButton>
          </Link>
        </div>
      </div>
    </header>
  );
};
