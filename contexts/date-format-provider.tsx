"use client";

import { dateFormat } from "@/utils/const";
import React, { createContext, useState } from "react";

const availableDateFormatTypes = {
  EU: dateFormat.EU,
  US: dateFormat.US,
  ISO: dateFormat.ISO,
} as const;

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
  // TODO: Retrieve it from user details or localStorage
  const [dateFormat, setDateFormat] = useState<DateFormatType>(
    availableDateFormatTypes.EU,
  );

  const value = { dateFormat, setDateFormat, availableDateFormatTypes };

  return (
    <DateFormatContext.Provider value={value}>
      {children}
    </DateFormatContext.Provider>
  );
};
