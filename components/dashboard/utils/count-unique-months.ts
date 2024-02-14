import type { TransactionObjBack } from "@/types";
import { dateFormat } from "@/utils/const";
import { format } from "date-fns";

export const countUniqueMonths = (
  transactions: TransactionObjBack[] | undefined,
): number => {
  if (!transactions) return 0;

  const monthYearSet = new Set();

  transactions.forEach((transaction) => {
    const monthYear = format(new Date(transaction.date), dateFormat.monthYear);
    monthYearSet.add(monthYear);
  });

  return monthYearSet.size;
};
