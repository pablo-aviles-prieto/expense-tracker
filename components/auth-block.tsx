"use client";

import { useState } from "react";
import { UserRegisterBlock } from "./forms/user-register-form/user-register-block";
import { UserLoginBlock } from "./forms/user-login-form/user-login-block";

export const AuthBlock = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
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
  );
};
