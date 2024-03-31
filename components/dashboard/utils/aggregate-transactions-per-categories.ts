import type { TransactionObjBack } from "@/types";
import { PieChartData } from "../types/pie-chart";

type Props = {
  transactions: TransactionObjBack[];
};

// Recieves the filtered incomes or expenses transactions
export const aggregateTransactionsPerCategories = ({
  transactions,
}: Props): PieChartData => {
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((transaction) => {
    transaction.categories.forEach((category) => {
      // If a transaction belongs to multiple categories, each category gets the full amount
      const amount = Math.abs(transaction.amount);
      if (categoryTotals[category.name]) {
        categoryTotals[category.name] += amount;
      } else {
        categoryTotals[category.name] = amount;
      }
    });
  });

  return Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: Number(value.toFixed(2)),
  }));
};
