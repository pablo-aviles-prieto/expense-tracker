import type { TransactionObjBack } from "@/types";

type AccTypeKey = "incomes" | "expenses" | "date";
type AccType = Record<string, Record<AccTypeKey, any>>;

export const aggregateTransactionsByDay = (
  transactions: TransactionObjBack[],
) => {
  const dailyTotals = transactions.reduce((acc: AccType, transaction) => {
    const day = transaction.date;
    if (!acc[day]) {
      acc[day] = { incomes: 0, expenses: 0, date: day };
    }
    if (transaction.amount >= 0) {
      acc[day].incomes += transaction.amount;
    } else {
      acc[day].expenses += Math.abs(transaction.amount);
    }
    return acc;
  }, {});

  const sortedDailyData = Object.values(dailyTotals).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return sortedDailyData.map((entry) => ({
    name: entry.date,
    incomes: Number(entry.incomes.toFixed(2)),
    expenses: Number(entry.expenses.toFixed(2)),
  }));
};
