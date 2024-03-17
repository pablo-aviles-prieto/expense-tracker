"use client";

import { UpdateTransactionForm } from "@/components/forms/transactions/update-transaction-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { TransactionFormValue } from "@/schemas/update-transactions-schema";
import { Categories } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AddTransactionsSingleBlockProps {
  userCategories: Categories[];
  switchTab: (tabValue: string) => void;
}

export const AddTransactionsSingleBlock = ({
  userCategories,
  switchTab,
}: AddTransactionsSingleBlockProps) => {
  const [updateLoading, setUpdateLoading] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: TransactionFormValue) => {
    console.log("data", data);
  };

  return (
    <div>
      <p className="mb-4">Add manually your transaction</p>
      <ScrollArea className="h-[calc(100vh-340px)]">
        <UpdateTransactionForm
          loading={updateLoading}
          onCancel={() => switchTab("multiple")}
          submitHandler={onSubmit}
          userCategories={userCategories}
          cancelButtonContent="Create multiple transactions"
          submitButtonContent="Create transaction"
        />
      </ScrollArea>
    </div>
  );
};
