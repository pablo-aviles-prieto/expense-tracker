"use client";

import { TransactionForm } from "@/components/forms/transactions/transaction-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import { TransactionFormValue } from "@/schemas/update-transactions-schema";
import type { Categories, TransactionCreateReponse } from "@/types";
import { URL_CREATE_TRANSACTION } from "@/utils/const";
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
  const [isLoading, setIsLoading] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: TransactionFormValue) => {
    const { update, id: toastId } = toast({
      title: "Creating transaction...",
      description: "Please wait while the transactions is created",
      variant: "default",
    });
    setIsLoading(true);
    const parsedData = { ...data };
    // @ts-ignore
    delete parsedData.id;

    const parsedRes = await fetchPetition<TransactionCreateReponse>({
      url: URL_CREATE_TRANSACTION,
      method: "POST",
      body: { transaction: parsedData },
    });

    if (parsedRes.error) {
      update({
        id: toastId,
        title: "Error creating...",
        description: parsedRes.error,
        variant: "destructive",
      });
    }
    if (parsedRes.data) {
      update({
        id: toastId,
        title: "Successfully created",
        description: "The transaction has been successfully created",
        variant: "success",
      });
      router.push("/dashboard/transactions/list");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <p className="mb-4">Add manually your transaction</p>
      <ScrollArea className="h-[calc(100vh-340px)]">
        <TransactionForm
          loading={isLoading}
          onCancel={() => switchTab("multiple")}
          submitHandler={onSubmit}
          userCategories={userCategories}
          cancelButtonContent="Create multiple"
          submitButtonContent="Create single"
        />
      </ScrollArea>
    </div>
  );
};
