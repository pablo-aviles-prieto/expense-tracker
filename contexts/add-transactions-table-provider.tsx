"use client";

import type { EnhancedCategory, TransactionBulk } from "@/types";
import React, { createContext, useState, ReactNode, useCallback } from "react";

interface TableContextType {
  userCategories: EnhancedCategory[];
  setUserCategories: React.Dispatch<React.SetStateAction<EnhancedCategory[]>>;
  updateTransactionCategories: (
    transactionId: number,
    selectedCategories: EnhancedCategory[],
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
  const [userCategories, setUserCategories] = useState<EnhancedCategory[]>([]);
  const [addTransactions, setAddTransactions] = useState<TransactionBulk[]>([]);

  const updateTransactionCategories = useCallback(
    (transactionId: number, selectedCategories: EnhancedCategory[]) => {
      setAddTransactions(
        addTransactions.map((transaction) => {
          if (transaction.id === transactionId) {
            return { ...transaction, selectedCategories };
          }
          return transaction;
        }),
      );
    },
    [addTransactions, setAddTransactions],
  );

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
