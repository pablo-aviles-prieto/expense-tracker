"use client";

import type { TransactionObjBack } from "@/types";
import { countUniqueMonths } from "../utils/count-unique-months";
import { aggregateTransactionsByMonth } from "../utils/aggregate-transactions-by-month";
import { BarChartBlock } from "./bar-chart";
import { LoadingSpinner } from "@/components/ui/spinner";
import { aggregateTransactionsByDay } from "../utils/aggregate-transactions-by-day";
import { LineChartBlock } from "./line-chart";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
};

export function TransactionsBlockChart({ filteredData, isLoading }: Props) {
  const uniqueMonthCount = countUniqueMonths(filteredData);
  const barChartData = aggregateTransactionsByMonth(filteredData ?? []);
  const lineChartData = aggregateTransactionsByDay(filteredData ?? []);

  console.log("uniqueMonthCount", uniqueMonthCount);
  console.log("barChartData", barChartData);
  console.log("lineChartData", lineChartData);

  return isLoading ? (
    <div className="flex items-center justify-center pt-24">
      <LoadingSpinner size={140} />
    </div>
  ) : uniqueMonthCount >= 3 ? (
    <BarChartBlock data={barChartData} />
  ) : (
    <LineChartBlock data={lineChartData} />
  );
}
