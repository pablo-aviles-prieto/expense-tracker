import { TransactionObjBack } from "@/types";
import { dateFormat, monthOrder } from "@/utils/const";
import { format } from "date-fns";

type AccTypeKey = "incomes" | "expenses";
type AccType = Record<string, Record<AccTypeKey, number>>;

export const aggregateTransactionsByMonth = (
  transactions: TransactionObjBack[],
) => {
  const monthlyTotals = transactions.reduce((acc: AccType, transaction) => {
    const monthYear = format(
      new Date(transaction.date),
      dateFormat.shortMonthWithYear,
    );
    const amount = transaction.amount;
    if (!acc[monthYear]) {
      acc[monthYear] = { incomes: 0, expenses: 0 };
    }
    if (amount >= 0) {
      acc[monthYear].incomes += amount;
    } else {
      acc[monthYear].expenses += amount;
    }
    return acc;
  }, {});

  return Object.entries(monthlyTotals)
    .map(([month, totals]) => ({
      name: month,
      incomes: Number(totals.incomes.toFixed(2)),
      expenses: Math.abs(Number(totals.expenses.toFixed(2))),
    }))
    .sort((a, b) => {
      const yearA = a.name.split(" ")[1],
        monthA = monthOrder[a.name.split(" ")[0] as keyof typeof monthOrder];
      const yearB = b.name.split(" ")[1],
        monthB = monthOrder[b.name.split(" ")[0] as keyof typeof monthOrder];
      return yearA === yearB ? monthA - monthB : yearA.localeCompare(yearB);
    });
};
