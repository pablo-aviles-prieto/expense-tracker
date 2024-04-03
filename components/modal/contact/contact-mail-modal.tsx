"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { ForgotPasswordForm } from "@/components/forms/recover-password-form/forgot-password-form";
import { ForgotPasswordFormValue } from "@/schemas/forgot-password-schema";
import { URL_RECOVER_PASSWORD } from "@/utils/const";
import { ContactMailFormValue } from "@/schemas/contact-mail-schema";
import { ContactMailForm } from "@/components/forms/contact-mail-form/contact-mail-form";

interface ContactMailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactMailResponse {
  ok: boolean;
  error?: string;
  message?: string;
}

export const ContactMailModal: React.FC<ContactMailModalProps> = ({
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

  const onSubmit = async (data: ContactMailFormValue) => {
    setIsSendingMail(true);
    console.log("data", data);
    // const response = await fetchPetition<ContactMailResponse>({
    //   method: "POST",
    //   url: URL_RECOVER_PASSWORD,
    //   body: { email: data.email },
    // });

    // if (response.error) {
    //   toast({
    //     title: "Error sending the reset password email",
    //     description: response.error,
    //     variant: "destructive",
    //   });
    // } else if (response.message) {
    //   toast({
    //     title: "Email sent",
    //     description: response.message,
    //     variant: "success",
    //   });
    // }
    onClose();
    setIsSendingMail(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Contact us via mail"
      description="Do you want to report a bug, make a request or just get in touch? We will get back at you as soon as possible!"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ScrollArea maxHeight={450}>
        <ContactMailForm onSubmit={onSubmit} isSendingMail={isSendingMail} />
      </ScrollArea>
    </Modal>
  );
};
