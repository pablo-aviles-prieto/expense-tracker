"use client";

import { CustomSessionI } from "@/types";
import { availableDateFormatTypes } from "@/utils/const";
import { useSession } from "next-auth/react";
import React, { createContext, useState } from "react";

type DateFormatType =
  (typeof availableDateFormatTypes)[keyof typeof availableDateFormatTypes];

interface DateFormatContextType {
  dateFormat: DateFormatType;
  availableDateFormatTypes: typeof availableDateFormatTypes;
  setDateFormat: (dateFormat: DateFormatType) => void;
}

export const DateFormatContext = createContext<
  DateFormatContextType | undefined
>(undefined);

export const DateFormatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // retrieving from next-auth session the dateFormat stored on db
  const { data } = useSession();
  const session = data as CustomSessionI;
  const [dateFormat, setDateFormat] = useState<DateFormatType>(
    (session.user?.dateFormat as DateFormatType) ?? availableDateFormatTypes.EU,
  );

  const value = { dateFormat, setDateFormat, availableDateFormatTypes };

  return (
    <DateFormatContext.Provider value={value}>
      {children}
    </DateFormatContext.Provider>
  );
};
