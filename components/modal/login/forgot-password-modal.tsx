"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { ForgotPasswordForm } from "@/components/forms/user-login-form/forgot-password-form";
import { ForgotPasswordFormValue } from "@/schemas/forgot-password-schema";
import { URL_RECOVER_PASSWORD } from "@/utils/const";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    const response = await fetchPetition({
      method: "POST",
      url: URL_RECOVER_PASSWORD,
      body: { email: data.email },
    });
    console.log("response", response);
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
