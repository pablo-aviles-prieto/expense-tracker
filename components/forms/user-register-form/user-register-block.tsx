"use client";

import { useSearchParams } from "next/navigation";
import GoogleSignInButton from "../google-auth-button";
import { DEFAULT_CALLBACK_URL } from "@/utils/const";
import { RegisterForm } from "./register-form";

export const UserRegisterForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to create your account
        </p>
      </div>
      <RegisterForm callbackUrl={callbackUrl ?? DEFAULT_CALLBACK_URL} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton callbackUrl={callbackUrl ?? DEFAULT_CALLBACK_URL} />
    </>
  );
};
