"use client";

import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import type { CustomSessionI, UpdateUserPreferencesResponse } from "@/types";
import {
  URL_CHANGE_PREFERENCES,
  availableDateFormatTypes,
} from "@/utils/const";
import { useSession } from "next-auth/react";
import React, { createContext, useEffect, useState } from "react";

export type DateFormatType =
  (typeof availableDateFormatTypes)[keyof typeof availableDateFormatTypes];

interface DateFormatContextType {
  dateFormat: DateFormatType;
  availableDateFormatTypes: typeof availableDateFormatTypes;
  changeDateFormat: (dateFormat: DateFormatType) => Promise<void>;
  setDateFormat: React.Dispatch<React.SetStateAction<DateFormatType>>;
}

export const DateFormatContext = createContext<
  DateFormatContextType | undefined
>(undefined);

export const DateFormatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // retrieving from next-auth session the dateFormat stored on db
  const { data, update } = useSession();
  const session = data as CustomSessionI;
  const [dateFormat, setDateFormat] = useState<DateFormatType>(
    (session?.user?.dateFormat as DateFormatType) ??
      availableDateFormatTypes.EU,
  );
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user?.dateFormat) {
      setDateFormat(session.user.dateFormat as DateFormatType);
    }
  }, [session]);

  const changeDateFormat = async (newDateFormat: DateFormatType) => {
    setDateFormat(newDateFormat);
    await update({ dateFormat: newDateFormat });
    const response = await fetchPetition<UpdateUserPreferencesResponse>({
      method: "POST",
      url: URL_CHANGE_PREFERENCES,
      body: { dateFormat: newDateFormat },
    });
    if (response.error) {
      toast({
        title: "Error updating preferences",
        description: response.error,
        variant: "destructive",
      });
    }
  };

  const value = {
    dateFormat,
    changeDateFormat,
    setDateFormat,
    availableDateFormatTypes,
  };

  return (
    <DateFormatContext.Provider value={value}>
      {children}
    </DateFormatContext.Provider>
  );
};
