"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { ForgotPasswordForm } from "@/components/forms/recover-password-form/forgot-password-form";
import { ForgotPasswordFormValue } from "@/schemas/forgot-password-schema";
import { URL_RECOVER_PASSWORD } from "@/utils/const";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ForgotPasswordMailResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: ForgotPasswordFormValue) => {
    setIsSendingMail(true);
    const response = await fetchPetition<ForgotPasswordMailResponse>({
      method: "POST",
      url: URL_RECOVER_PASSWORD,
      body: { email: data.email },
    });

    if (response.error) {
      toast({
        title: "Error sending the reset password email",
        description: response.error,
        variant: "destructive",
      });
    } else if (response.message) {
      toast({
        title: "Email sent",
        description: response.message,
        variant: "success",
      });
    }
    onClose();
    setIsSendingMail(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Reset your password"
      description="Provide your email to receive an email with a link to change your password"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ScrollArea maxHeight={450}>
        <ForgotPasswordForm isSendingMail={isSendingMail} onSubmit={onSubmit} />
      </ScrollArea>
    </Modal>
  );
};
