"use client";

import { type DecodedResetJWT } from "@/services/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { ResetPasswordForm } from "../forms/recover-password-form/reset-password-form";
import { ResetPasswordFormValue } from "@/schemas/reset-password-schema";
import { useFetch } from "@/hooks/use-fetch";
import { URL_RESET_PASSWORD } from "@/utils/const";
import type { ResetPasswordResponse } from "@/types";

interface ResetPasswordBlockProps {
  decodedToken: { data?: DecodedResetJWT; errorMessage: string | null };
}

export const ResetPasswordBlock = ({
  decodedToken,
}: ResetPasswordBlockProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

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

  const onSubmit = async (data: ResetPasswordFormValue) => {
    setIsLoading(true);
    const response = await fetchPetition<ResetPasswordResponse>({
      method: "POST",
      url: URL_RESET_PASSWORD,
      body: { userId: data.userId, password: data.password },
    });
    if (response.error) {
      toast({
        title: "Error resetting the password",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      toast({
        title: "Password reset successfully",
        description: response.message,
        variant: "success",
      });
    }
    router.push("/auth");
    setIsLoading(false);
  };

  if (decodedToken.errorMessage || !decodedToken.data) return null;

  return (
    <div
      className="relative mx-auto flex w-full flex-col justify-center 
      space-y-2 sm:w-[375px] overflow-hidden min-h-[600px] sm:px-2"
    >
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password credentials
        </p>
      </div>
      <ResetPasswordForm
        isLoading={isLoading}
        onSubmit={onSubmit}
        userId={decodedToken.data.userId}
      />
    </div>
  );
};
