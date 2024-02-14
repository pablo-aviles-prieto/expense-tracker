"use client";

import type { TransactionObjBack } from "@/types";
import { countUniqueMonths } from "../utils/count-unique-months";
import { aggregateTransactionsByMonth } from "../utils/aggregate-transactions-by-month";
import { BarChartBlock } from "./bar-chart";
import { LoadingSpinner } from "@/components/ui/spinner";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
};

export function TransactionsBlockChart({ filteredData, isLoading }: Props) {
  const uniqueMonthCount = countUniqueMonths(filteredData);
  const barChartData = aggregateTransactionsByMonth(filteredData ?? []);

  console.log("uniqueMonthCount", uniqueMonthCount);
  console.log("barChartData", barChartData);

  return isLoading ? (
    <div className="flex items-center justify-center pt-24">
      <LoadingSpinner size={140} />
    </div>
  ) : (
    <BarChartBlock data={barChartData} />
  );
}
