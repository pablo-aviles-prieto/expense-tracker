"use client";

import { useState } from "react";
import { UserRegisterBlock } from "./forms/user-register-form/user-register-block";
import { UserLoginBlock } from "./forms/user-login-form/user-login-block";
import Image from "next/image";

export const AuthBlock = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <div className="w-full mx-auto">
      <div className="lg:hidden mt-20 mb-5 flex items-center text-lg font-medium gap-x-2 p-0.5 justify-center">
        <Image
          src="/images/logo.webp"
          alt="Expense tracker logo"
          width={45}
          height={45}
        />
        <span className="">Expense tracker</span>
      </div>
      <div
        className="relative mx-auto flex w-full flex-col justify-center 
      space-y-6 sm:w-[375px] overflow-hidden min-h-[600px]"
      >
        <div
          className={`absolute px-1 sm:px-4 inset-0 transition-transform duration-500 ${
            isLoginPage ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <UserLoginBlock switchForm={() => setIsLoginPage(false)} />
        </div>
        <div
          className={`absolute px-1 sm:px-4 inset-0 !mt-0 transition-transform duration-500 ${
            isLoginPage ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <UserRegisterBlock switchForm={() => setIsLoginPage(true)} />
        </div>
      </div>
    </div>
  );
};
