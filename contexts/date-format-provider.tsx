import { dateFormat } from "@/utils/const";
import React, { createContext, useState } from "react";

const availableDateFormatTypes = {
  ISO: dateFormat.ISO,
  US: dateFormat.US,
  EU: dateFormat.EU,
} as const;

type DateFormatType =
  (typeof availableDateFormatTypes)[keyof typeof availableDateFormatTypes];

interface DateFormatContextType {
  dateFormat: DateFormatType;
  availableDateFormatTypes: typeof availableDateFormatTypes;
  setDateFormat: (format: DateFormatType) => void;
}

export const DateFormatContext = createContext<
  DateFormatContextType | undefined
>(undefined);

export const DateFormatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
