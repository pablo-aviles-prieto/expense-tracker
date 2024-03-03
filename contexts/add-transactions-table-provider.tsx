"use client";

import type { Categories, TransactionBulk } from "@/types";
import React, { createContext, useState, ReactNode } from "react";

interface TableContextType {
  userCategories: Categories[];
  setUserCategories: React.Dispatch<React.SetStateAction<Categories[]>>;
  updateTransactionCategories: (
    transactionId: number,
    selectedCategories: string[],
  ) => void;
  addTransactions: TransactionBulk[];
  setAddTransactions: React.Dispatch<React.SetStateAction<TransactionBulk[]>>;
}

export const AddTransactionsTableContext = createContext<
  TableContextType | undefined
>(undefined);

interface TableProviderProps {
  children: ReactNode;
}

export const AddTransactionsTableProvider: React.FC<TableProviderProps> = ({
  children,
}) => {
  const [userCategories, setUserCategories] = useState<Categories[]>([]);
  const [addTransactions, setAddTransactions] = useState<TransactionBulk[]>([]);

  const updateTransactionCategories = (
    transactionId: number,
    selectedCategories: string[],
  ) => {
    setAddTransactions(
      addTransactions.map((transaction) => {
        if (transaction.id === transactionId) {
          return { ...transaction, selectedCategories };
        }
        return transaction;
      }),
    );
  };

  const value = {
    userCategories,
    setUserCategories,
    updateTransactionCategories,
    addTransactions,
    setAddTransactions,
  };

  return (
    <AddTransactionsTableContext.Provider value={value}>
      {children}
    </AddTransactionsTableContext.Provider>
  );
};
