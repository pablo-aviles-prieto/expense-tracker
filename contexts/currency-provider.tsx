"use client";

import React, { createContext, useState } from "react";

const availableCurrency = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
} as const;

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
  // TODO: Retrieve it from user details or localStorage
  const [currency, setCurrency] = useState<CurrencyType>(availableCurrency.EUR);

  const value = { currency, setCurrency, availableCurrency };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
