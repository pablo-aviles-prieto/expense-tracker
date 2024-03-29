"use client";

import { RegisterEmailForm } from "./register-email-form";
import { Button } from "@/components/ui/button";

type Props = {
  switchForm: () => void;
};

export const UserRegisterBlock = ({ switchForm }: Props) => {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="!my-2 text-sm text-left text-muted-foreground">
          Please provide your email to begin the registration process.
          <span className="inline-block">
            You&apos;ll receive an email with a verification link to complete
            your registration.
          </span>
        </p>
      </div>
      <RegisterEmailForm />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center my-6 text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Already have an account?
          </span>
        </div>
      </div>
      <Button className="w-full" onClick={switchForm} variant="outline">
        Access to your account
      </Button>
    </>
  );
};
