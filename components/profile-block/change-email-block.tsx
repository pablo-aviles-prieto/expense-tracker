"use client";

import { useState } from "react";
import { RegisterEmailForm } from "../forms/user-register-form/register-email-form";
import { useToast } from "../ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { RegisterMailFormValue } from "@/schemas/register-mail-schema";
import { URL_CHANGE_EMAIL } from "@/utils/const";
import { signOut } from "next-auth/react";

interface ChangeEmailBlockProps {
  userId: string;
}

interface ChangeEmailResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

export const ChangeEmailBlock = ({ userId }: ChangeEmailBlockProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

  const onSubmit = async (data: RegisterMailFormValue) => {
    const { update, id: toastId } = toast({
      title: "Changing email...",
      description: "Please wait while the email is being changed",
      variant: "default",
    });
    setLoading(true);
    const response = await fetchPetition<ChangeEmailResponse>({
      url: URL_CHANGE_EMAIL,
      method: "POST",
      body: { userId, email: data.email },
    });
    if (response.error) {
      update({
        id: toastId,
        title: "Error changing the email",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      update({
        id: toastId,
        title: "Email changed successfully",
        description: response.message,
        variant: "success",
      });
      signOut();
    }
    setLoading(false);
  };

  return (
    <div>
      <p className="pb-4 text-muted-foreground">
        Please note, after updating your email address, you will be required to
        sign-in again using the new email address to ensure the security and
        integrity of your account
      </p>
      <RegisterEmailForm
        isLoading={loading}
        onSubmit={onSubmit}
        buttonContent="Change email"
      />
    </div>
  );
};
