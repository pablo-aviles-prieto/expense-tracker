"use client";

import { AddTransactionsTableContext } from "@/contexts/add-transactions-table-provider";
import { useContext } from "react";

export const useAddTransactionTable = () => {
  const context = useContext(AddTransactionsTableContext);
  if (context === undefined) {
    throw new Error(
      "useAddTransactionTable must be used within a AddTransactionsTable Provider",
    );
  }
  return context;
};
