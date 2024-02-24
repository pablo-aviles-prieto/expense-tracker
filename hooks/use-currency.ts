"use client";

import { CurrencyContext } from "@/contexts/currency-provider";
import { useContext } from "react";

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
