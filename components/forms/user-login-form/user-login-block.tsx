"use client";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "./login-form";
import { DEFAULT_CALLBACK_URL } from "@/utils/const";

export const UserLoginBlock = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Access to your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials below to login
        </p>
      </div>
      <LoginForm callbackUrl={callbackUrl ?? DEFAULT_CALLBACK_URL} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-background text-muted-foreground">
            Don&apos;t have an account?
          </span>
        </div>
      </div>
      <Button
        onClick={() => console.log("set login state to false")}
        variant="outline"
      >
        Create an account
      </Button>
    </>
  );
};
