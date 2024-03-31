"use client";

import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import type { CustomSessionI, UpdateUserPreferencesResponse } from "@/types";
import { URL_CHANGE_PREFERENCES, availableCurrency } from "@/utils/const";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";

export type CurrencyType =
  (typeof availableCurrency)[keyof typeof availableCurrency];

interface CurrencyContextType {
  currency: CurrencyType;
  availableCurrency: typeof availableCurrency;
  changeCurrency: (currency: CurrencyType) => Promise<void>;
  setCurrency: React.Dispatch<React.SetStateAction<CurrencyType>>;
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // retrieving from next-auth session the currency stored on db
  const { data, update } = useSession();
  const session = data as CustomSessionI;
  const [currency, setCurrency] = useState<CurrencyType>(
    (session?.user?.currency as CurrencyType) ?? availableCurrency.EUR,
  );
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.currency) {
      setCurrency(session.user.currency as CurrencyType);
    }
  }, [session]);

  const changeCurrency = async (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    await update({ currency: newCurrency });
    const response = await fetchPetition<UpdateUserPreferencesResponse>({
      method: "POST",
      url: URL_CHANGE_PREFERENCES,
      body: { currency: newCurrency },
    });
    if (response.error) {
      toast({
        title: "Error updating preferences",
        description: response.error,
        variant: "destructive",
      });
    }
  };

  const value = { currency, changeCurrency, setCurrency, availableCurrency };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
