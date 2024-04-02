import { LoadingSpinner } from "@/components/ui/spinner";
import type { TransactionObjBack } from "@/types";
import { aggregateTransactionsPerCategories } from "../../utils/aggregate-transactions-per-categories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChartBlock } from "./pie-chart";
import { EXPENSES_CHART_COLOR, INCOMES_CHART_COLOR } from "../../utils/const";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
};

export const TransactionsPieChart = ({ filteredData, isLoading }: Props) => {
  const incomes = (filteredData ?? []).filter((trans) => trans.amount >= 0);
  const expenses = (filteredData ?? []).filter((trans) => trans.amount < 0);
  const expensesPerCategories = aggregateTransactionsPerCategories({
    transactions: expenses,
  });
  const incomesPerCategories = aggregateTransactionsPerCategories({
    transactions: incomes,
  });

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
    <Tabs defaultValue="expenses" className="w-full">
      <TabsList className="absolute top-[14px] right-[24px]">
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="incomes">Incomes</TabsTrigger>
      </TabsList>
      <TabsContent value="expenses">
        <PieChartBlock
          data={expensesPerCategories}
          pieColor={EXPENSES_CHART_COLOR}
        />
      </TabsContent>
      <TabsContent value="incomes">
        <PieChartBlock
          data={incomesPerCategories}
          pieColor={INCOMES_CHART_COLOR}
        />
      </TabsContent>
    </Tabs>
  );
};
