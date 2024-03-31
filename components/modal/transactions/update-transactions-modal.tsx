"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { TransactionForm } from "../../forms/transactions/transaction-form";
import { TransactionFormValue } from "@/schemas/update-transactions-schema";
import { ScrollArea } from "../../ui/scroll-area";
import type {
  Categories,
  TransactionObjBack,
  TransactionUpdateReponse,
} from "@/types";
import { useFetch } from "@/hooks/use-fetch";
import { URL_UPDATE_CATEGORY } from "@/utils/const";
import { useToast } from "../../ui/use-toast";
import { useRouter } from "next/navigation";

interface UpdateTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  rowData: TransactionObjBack;
  userCategories: Categories[];
}

export const UpdateTransactionsModal: React.FC<
  UpdateTransactionsModalProps
> = ({ isOpen, onClose, rowData, userCategories }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = async (data: TransactionFormValue) => {
    const { update, id: toastId } = toast({
      title: "Updating transaction...",
      description: "Please wait while the update is being processed",
      variant: "default",
    });
    setUpdateLoading(true);
    const parsedRes = await fetchPetition<TransactionUpdateReponse>({
      url: URL_UPDATE_CATEGORY,
      method: "POST",
      body: { transaction: data },
    });

    if (parsedRes.error) {
      update({
        id: toastId,
        title: "Error updating...",
        description: parsedRes.error,
        variant: "destructive",
      });
    }
    if (parsedRes.data) {
      update({
        id: toastId,
        title: "Successfully updated",
        description: "The transaction has been successfully updated",
        variant: "success",
      });
      onClose();
    }
    router.refresh();
    setUpdateLoading(false);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Update the transaction"
      description="Fill all the inputs before submitting the changes"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ScrollArea maxHeight={450}>
        <TransactionForm
          loading={updateLoading}
          onCancel={onClose}
          submitHandler={onSubmit}
          initData={rowData}
          userCategories={userCategories}
        />
      </ScrollArea>
    </Modal>
  );
};
