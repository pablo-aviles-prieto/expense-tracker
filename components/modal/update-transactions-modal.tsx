"use client";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { UpdateTransactionForm } from "../forms/transactions/update-transaction-form";
import { TransactionFormValue } from "@/schemas/update-transactions-schema";
import { ScrollArea } from "../ui/scroll-area";
import type { Categories, TransactionObjBack } from "@/types";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = (data: TransactionFormValue) => {
    setUpdateLoading(true);
    console.log("data", data);
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
        <UpdateTransactionForm
          loading={updateLoading}
          onClose={onClose}
          submitHandler={onSubmit}
          transData={rowData}
          userCategories={userCategories}
        />
      </ScrollArea>
    </Modal>
  );
};
