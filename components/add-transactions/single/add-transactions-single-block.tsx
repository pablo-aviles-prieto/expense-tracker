"use client";

import { UpdateTransactionForm } from "@/components/forms/transactions/update-transaction-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransactionFormValue } from "@/schemas/update-transactions-schema";
import { Categories } from "@/types";
import { useState } from "react";

interface AddTransactionsSingleBlockProps {
  userCategories: Categories[];
}

export const AddTransactionsSingleBlock = ({
  userCategories,
}: AddTransactionsSingleBlockProps) => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const onSubmit = async (data: TransactionFormValue) => {
    console.log("data", data);
  };

  return (
    <div>
      <p className="mb-4">Add manually your transaction</p>
      <ScrollArea className="h-[calc(100vh-340px)]">
        <UpdateTransactionForm
          loading={updateLoading}
          onCancel={() => console.log("close")}
          submitHandler={onSubmit}
          userCategories={userCategories}
          cancelButtonContent="Create multiple transactions"
          submitButtonContent="Create transaction"
        />
      </ScrollArea>
    </div>
  );
};
