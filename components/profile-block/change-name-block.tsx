"use client";

import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { URL_CHANGE_NAME } from "@/utils/const";
import { ChangeNameFormValue } from "@/schemas/change-name-schema";
import { ChangeNameForm } from "../forms/user-register-form/change-name-form";
import { signOut } from "next-auth/react";

interface ChangeNameBlockProps {
  userId: string;
}

interface ChangeNameResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

export const ChangeNameBlock = ({ userId }: ChangeNameBlockProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchPetition } = useFetch();

  const onSubmit = async (data: ChangeNameFormValue) => {
    const { update, id: toastId } = toast({
      title: "Changing name...",
      description: "Please wait while the name is being changed",
      variant: "default",
    });
    setLoading(true);
    const response = await fetchPetition<ChangeNameResponse>({
      url: URL_CHANGE_NAME,
      method: "POST",
      body: { userId, name: data.name },
    });
    if (response.error) {
      update({
        id: toastId,
        title: "Error changing the name",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      update({
        id: toastId,
        title: "Name changed successfully",
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
        Please note, after updating your name, you will be required to sign-in
        again to ensure the change propagates
      </p>
      <ChangeNameForm isLoading={loading} onSubmit={onSubmit} />
    </div>
  );
};
