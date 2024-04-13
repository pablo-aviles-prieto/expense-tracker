"use client";

import { useState } from "react";
import { RegisterEmailForm } from "../forms/user-register-form/register-email-form";
import { useToast } from "../ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { RegisterMailFormValue } from "@/schemas/register-mail-schema";
import { URL_NEW_EMAIL } from "@/utils/const";
import { signOut } from "next-auth/react";
import type { ChangeEmailResponse } from "@/types";

interface ChangeEmailBlockProps {
  userId: string;
}

export const ChangeEmailBlock = ({ userId }: ChangeEmailBlockProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

  const onSubmit = async (data: RegisterMailFormValue) => {
    const { update, id: toastId } = toast({
      title: "Sending email...",
      description: "Wait while the email is being sent",
      variant: "default",
    });
    setLoading(true);
    const response = await fetchPetition<ChangeEmailResponse>({
      url: URL_NEW_EMAIL,
      method: "POST",
      body: { userId, email: data.email },
    });
    if (response.error) {
      update({
        id: toastId,
        title: "Error sending the email",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      update({
        id: toastId,
        title: "Email sent successfully",
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
        To update your email, you&apos;ll receive a verification link at the new
        address. Clicking this link will confirm the change and associate the
        new email with your account. You will then need to log in again using
        the new email.
      </p>
      <RegisterEmailForm
        isLoading={loading}
        onSubmit={onSubmit}
        buttonContent="Change email"
      />
    </div>
  );
};
