"use client";

import { useState } from "react";
import { ResetPasswordForm } from "../forms/recover-password-form/reset-password-form";
import { ResetPasswordFormValue } from "@/schemas/reset-password-schema";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "../ui/use-toast";
import type { ResetPasswordResponse } from "@/types";
import { URL_RESET_PASSWORD } from "@/utils/const";

interface ChangePasswordBlockProps {
  userId: string;
  resetAccordion: () => void;
}

export const ChangePasswordBlock = ({
  userId,
  resetAccordion,
}: ChangePasswordBlockProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

  const onSubmit = async (data: ResetPasswordFormValue) => {
    setIsLoading(true);
    const response = await fetchPetition<ResetPasswordResponse>({
      method: "POST",
      url: URL_RESET_PASSWORD,
      body: { userId: data.userId, password: data.password },
    });
    if (response.error) {
      toast({
        title: "Error changing the password",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      toast({
        title: "Password changed successfully",
        description: response.message,
        variant: "success",
      });
    }
    setIsLoading(false);
    resetAccordion();
  };

  return (
    <div>
      <p className="pb-4 text-muted-foreground">
        After changing your password, you will need to use the new password for
        all future sign-in attempts
      </p>
      <ResetPasswordForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        userId={userId}
      />
    </div>
  );
};
