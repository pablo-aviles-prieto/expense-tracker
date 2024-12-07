'use client';

import { useState } from 'react';

import Image from 'next/image';

import { UserLoginBlock } from './forms/user-login-form/user-login-block';
import { UserRegisterBlock } from './forms/user-register-form/user-register-block';

export const AuthBlock = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <div className='mx-auto w-full'>
      <div className='mb-5 mt-20 flex items-center justify-center gap-x-2 p-0.5 text-lg font-medium lg:hidden'>
        <Image src='/images/logo.webp' alt='Expense tracker logo' width={45} height={45} />
        <span className=''>Expense tracker</span>
      </div>
      <div className='relative mx-auto flex min-h-[600px] w-full flex-col justify-center space-y-6 overflow-hidden sm:w-[375px]'>
        <div
          className={`absolute inset-0 px-1 transition-transform duration-500 sm:px-4 ${
            isLoginPage ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <UserLoginBlock switchForm={() => setIsLoginPage(false)} />
        </div>
        <div
          className={`absolute inset-0 !mt-0 px-1 transition-transform duration-500 sm:px-4 ${
            isLoginPage ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <UserRegisterBlock switchForm={() => setIsLoginPage(true)} />
        </div>
      </div>
    </div>
  );
};
