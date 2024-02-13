import { differenceInCalendarDays, min, max } from "date-fns";
import type { TransactionObjBack } from "@/types";

export const getDateRangeInfo = (transactions: TransactionObjBack[]) => {
  if (transactions.length === 0) {
    return {
      minDate: null,
      maxDate: null,
      daysBetween: 0,
    };
  }

  const dates = transactions.map((transaction) => new Date(transaction.date));
  const minDate = min(dates);
  const maxDate = max(dates);
  const daysBetween = differenceInCalendarDays(maxDate, minDate);

  return {
    minDate,
    maxDate,
    daysBetween,
  };
};
