"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ScrollArea } from "../ui/scroll-area";
import type {
  Categories,
  TransactionObjBack,
  TransactionUpdateReponse,
} from "@/types";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SubscriptionForm } from "@/components/forms/subscriptions/subscription-form";
import { SubscriptionFormValue } from "@/schemas/create-subscription-schema";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSubscriptionModal: React.FC<
  CreateSubscriptionModalProps
> = ({ isOpen, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: SubscriptionFormValue) => {
    const { update, id: toastId } = toast({
      title: "Creating subscription...",
      description: "Please wait while the subscription is crated",
      variant: "default",
    });
    setUpdateLoading(true);
    console.log("data", data);
    // const parsedRes = await fetchPetition<TransactionUpdateReponse>({
    //   url: URL_UPDATE_CATEGORY,
    //   method: "POST",
    //   body: { transaction: data },
    // });

    // if (parsedRes.error) {
    //   update({
    //     id: toastId,
    //     title: "Error updating...",
    //     description: parsedRes.error,
    //     variant: "destructive",
    //   });
    // }
    // if (parsedRes.data) {
    //   update({
    //     id: toastId,
    //     title: "Succesfully updated",
    //     description: "The transaction has been succesfully updated",
    //     variant: "success",
    //   });
    //   onClose();
    // }
    // router.refresh();
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
