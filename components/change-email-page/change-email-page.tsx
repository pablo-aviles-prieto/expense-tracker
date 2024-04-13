"use client";

import { type DecodedChangeEmailJWT } from "@/services/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "../ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { URL_CHANGE_EMAIL } from "@/utils/const";
import type { ChangeEmailResponse } from "@/types";
import { LoadingSpinner } from "../ui/spinner";
import { signOut, useSession } from "next-auth/react";

interface ChangeEmailProps {
  decodedToken: { data?: DecodedChangeEmailJWT; errorMessage: string | null };
}

export const ChangeEmail = ({ decodedToken }: ChangeEmailProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { fetchPetition } = useFetch();
  const { status } = useSession();

  useEffect(() => {
    if (decodedToken.errorMessage) {
      toast({
        title: "Invalid token",
        variant: "destructive",
        description: decodedToken.errorMessage,
      });
      router.push("/auth");
    } else if (decodedToken.data) {
      sendEmail(decodedToken.data);
    }
  }, [decodedToken]);

  const sendEmail = async (data: DecodedChangeEmailJWT) => {
    const response = await fetchPetition<ChangeEmailResponse>({
      method: "POST",
      url: URL_CHANGE_EMAIL,
      body: {
        userId: data.userId,
        email: data.email,
      },
    });

    if (response.error) {
      toast({
        title: "Error changing the email",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      toast({
        title: "Email successfully changed",
        description: response.message,
        variant: "success",
      });
      if (status === "authenticated") {
        await signOut({ redirect: false });
      }
      router.push("/auth");
    }
  };

  if (decodedToken.errorMessage || !decodedToken.data) return null;

  return (
    <div
      className="relative mx-auto flex w-full flex-col justify-center 
      space-y-2 sm:w-[375px] overflow-hidden min-h-[600px] sm:px-2"
    >
      <div className="flex items-center justify-center">
        <LoadingSpinner size={140} />
      </div>
      <p className="text-center">
        Wait while the new email is associated to your account
      </p>
    </div>
  );
};
