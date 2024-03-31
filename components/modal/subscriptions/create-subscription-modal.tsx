"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserSubscriptionResponse } from "@/types";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { SubscriptionForm } from "@/components/forms/subscriptions/subscription-form";
import { SubscriptionFormValue } from "@/schemas/create-subscription-schema";
import { URL_ADD_SUBSCRIPTION } from "@/utils/const";
import { type RefetchOptions } from "@tanstack/react-query";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: (options?: RefetchOptions | undefined) => any;
}

export const CreateSubscriptionModal: React.FC<
  CreateSubscriptionModalProps
> = ({ isOpen, onClose, refetch }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: SubscriptionFormValue) => {
    const { update, id: toastId } = toast({
      title: "Creating subscription...",
      description: "Please wait while the subscription is created",
      variant: "default",
    });
    setUpdateLoading(true);

    const parsedRes = await fetchPetition<UserSubscriptionResponse>({
      url: URL_ADD_SUBSCRIPTION,
      method: "POST",
      body: { subscriptionData: data },
    });

    if (parsedRes.error) {
      update({
        id: toastId,
        title: "Error creating...",
        description: parsedRes.error,
        variant: "destructive",
      });
    }
    if (parsedRes.updatedUser) {
      update({
        id: toastId,
        title: "Successfully created",
        description: "The subscription has been successfully created",
        variant: "success",
      });
      onClose();
    }
    refetch();
    setUpdateLoading(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Create a subscription"
      description="Fill all the inputs to create a subscription"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ScrollArea maxHeight={450}>
        <SubscriptionForm
          loading={updateLoading}
          onCancel={onClose}
          submitHandler={onSubmit}
          submitButtonContent="Create"
        />
      </ScrollArea>
    </Modal>
  );
};
