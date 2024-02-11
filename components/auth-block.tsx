"use client";

import { useState } from "react";
import { UserRegisterBlock } from "./forms/user-register-form/user-register-block";
import { UserLoginBlock } from "./forms/user-login-form/user-login-block";

export const AuthBlock = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return isLoginPage ? <UserLoginBlock /> : <UserRegisterBlock />;
};
