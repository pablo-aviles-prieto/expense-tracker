"use client";

import { CustomSessionI } from "@/types";
import { availableCurrency } from "@/utils/const";
import { useSession } from "next-auth/react";
import React, { createContext, useState } from "react";

type CurrencyType = (typeof availableCurrency)[keyof typeof availableCurrency];

interface CurrencyContextType {
  currency: CurrencyType;
  availableCurrency: typeof availableCurrency;
  setCurrency: (currency: CurrencyType) => void;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // retrieving from next-auth session the currency stored on db
  const { data } = useSession();
  const session = data as CustomSessionI;
  const [currency, setCurrency] = useState<CurrencyType>(
    (session?.user?.currency as CurrencyType) ?? availableCurrency.EUR,
  );

  const value = { currency, setCurrency, availableCurrency };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
