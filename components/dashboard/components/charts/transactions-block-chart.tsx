"use client";

import type { TransactionObjBack } from "@/types";
import { aggregateTransactionsByMonth } from "../../utils/aggregate-transactions-by-month";
import { BarChartBlock } from "./bar-chart";
import { LoadingSpinner } from "@/components/ui/spinner";
import { aggregateTransactionsByDay } from "../../utils/aggregate-transactions-by-day";
import { LineChartBlock } from "./line-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
};

export function TransactionsBlockChart({ filteredData, isLoading }: Props) {
  const barChartData = aggregateTransactionsByMonth(filteredData ?? []);
  const lineChartData = aggregateTransactionsByDay(filteredData ?? []);

  return isLoading ? (
    <div className="flex items-center justify-center pt-28">
      <LoadingSpinner size={140} />
    </div>
  ) : !filteredData || filteredData.length === 0 ? (
    <div className="flex items-center justify-center pt-36">
      <p className="text-lg font-semibold">
        There is no data for the selected dates
      </p>
    </div>
  ) : (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="absolute top-[14px] right-[24px]">
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
        <TabsTrigger value="daily">Daily</TabsTrigger>
      </TabsList>
      <TabsContent value="monthly">
        <BarChartBlock data={barChartData} />
      </TabsContent>
      <TabsContent value="daily">
        <LineChartBlock data={lineChartData} />
      </TabsContent>
    </Tabs>
  );
}
