"use client";

import { type DecodedRegisterJWT } from "@/services/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { RegisterUserForm } from "../forms/user-register-form/register-user-form";

interface RegisterUserBlockProps {
  decodedToken: { data?: DecodedRegisterJWT; errorMessage: string | null };
}

export const RegisterUserBlock = ({ decodedToken }: RegisterUserBlockProps) => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (decodedToken.errorMessage) {
      toast({
        title: "Invalid token",
        variant: "destructive",
        description: decodedToken.errorMessage,
      });
      router.push("/auth");
    }
  }, [decodedToken]);

  if (decodedToken.errorMessage || !decodedToken.data) return null;

  return (
    <div
      className="relative mx-auto flex w-full flex-col justify-center 
      space-y-2 sm:w-[375px] overflow-hidden min-h-[600px] sm:px-2"
    >
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Finish your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Provide the credentials for {decodedToken.data.email}
        </p>
      </div>
      <RegisterUserForm email={decodedToken.data.email} />
    </div>
  );
};
