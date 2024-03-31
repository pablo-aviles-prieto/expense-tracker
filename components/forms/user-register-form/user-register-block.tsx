"use client";

import { RegisterMailFormValue } from "@/schemas/register-mail-schema";
import { RegisterEmailForm } from "./register-email-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { URL_REGISTER_EMAIL } from "@/utils/const";
import { ResponseRegisterMail } from "@/types";

type Props = {
  switchForm: () => void;
};

export const UserRegisterBlock = ({ switchForm }: Props) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

  const onSubmit = async (data: RegisterMailFormValue) => {
    const { update, id: toastId } = toast({
      title: "Creating...",
      description: "Please wait while we create the account",
      variant: "default",
    });
    setLoading(true);
    const response = await fetchPetition<ResponseRegisterMail>({
      url: URL_REGISTER_EMAIL,
      method: "POST",
      body: { email: data.email },
    });
    if (response.error) {
      update({
        id: toastId,
        title: "Error registering the email",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      update({
        id: toastId,
        title: "Email registered successfully",
        description: response.message,
        variant: "success",
      });
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="!my-2 text-sm text-left text-muted-foreground">
          Provide your email to start the registration process.
          <span className="inline-block">
            You&apos;ll receive an email with a verification link to complete
            your registration.
          </span>
        </p>
      </div>
      <RegisterEmailForm isLoading={loading} onSubmit={onSubmit} />
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
