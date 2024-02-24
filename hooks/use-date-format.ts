"use client";

import { DateFormatContext } from "@/contexts/date-format-provider";
import { useContext } from "react";

export const useDateFormat = () => {
  const context = useContext(DateFormatContext);
  if (context === undefined) {
    throw new Error("useDateFormat must be used within a DateFormatProvider");
  }
  return context;
};
