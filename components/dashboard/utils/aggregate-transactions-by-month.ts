import { TransactionObjBack } from "@/types";
import { dateFormat } from "@/utils/const";
import { parseISO, format } from "date-fns";

type AccTypeKey = "incomes" | "expenses";
type AccType = Record<string, Record<AccTypeKey, number>>;

export const aggregateTransactionsByMonth = (
  transactions: TransactionObjBack[],
) => {
  const monthlyTotals = transactions.reduce((acc: AccType, transaction) => {
    const month = format(parseISO(transaction.date), dateFormat.shortMonth);
    const amount = transaction.amount;
    if (!acc[month]) {
      acc[month] = { incomes: 0, expenses: 0 };
    }
    if (amount >= 0) {
      acc[month].incomes += amount;
    } else {
      acc[month].expenses += amount;
    }
    return acc;
  }, {});

  return Object.entries(monthlyTotals).map(([month, totals]) => ({
    name: month,
    incomes: totals.incomes,
    expenses: Math.abs(totals.expenses),
  }));
};
