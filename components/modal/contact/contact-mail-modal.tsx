"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { URL_CONTACT_MAIL } from "@/utils/const";
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
    const { update, id: toastId } = toast({
      title: "Sending the email...",
      description: "Please wait while the email is being sent",
      variant: "default",
    });
    setIsSendingMail(true);

    const response = await fetchPetition<ContactMailResponse>({
      method: "POST",
      url: URL_CONTACT_MAIL,
      body: { contact: data },
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
        title: "Email sent succesfully",
        description: response.message,
        variant: "success",
      });
      onClose();
    }
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
