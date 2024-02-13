import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransactionObjBack } from "@/types";
import { calculateTotalTypeTrans } from "../utils/calculate-total-type-trans";
import { getDateRangeInfo } from "../utils/get-date-ragen-info";
import { getEllipsed } from "@/utils/const";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
};

const formatterUS = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

export const KpiBlock = ({ filteredData, isLoading }: Props) => {
  const incomes = filteredData
    ? calculateTotalTypeTrans({ transactions: filteredData })
    : 0;
  const expenses = filteredData
    ? calculateTotalTypeTrans({
        transactions: filteredData,
        transType: "expenses",
      })
    : 0;
  const incomeTransactions = (filteredData ?? []).filter(
    (transaction) => transaction.amount >= 0,
  );
  const expenseTransactions = (filteredData ?? []).filter(
    (transaction) => transaction.amount < 0,
  );

  const netSavings = incomes + expenses;
  const netSavingSymbol = netSavings > 0 ? "+" : "";
  const dateRangeInfo = getDateRangeInfo(filteredData ?? []);
  const moneyPerDay = dateRangeInfo.daysBetween
    ? (netSavings >= 0 ? incomes : expenses) / dateRangeInfo.daysBetween
    : 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className={`text-sm font-medium ${getEllipsed}`}>
            Incomes in this period
          </CardTitle>
          <Icons.incomes className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-6 my-1" />
              <Skeleton className="w-full h-4 my-1" />
            </>
          ) : filteredData && filteredData.length > 0 ? (
            <>
              <div className="text-2xl font-bold text-green-600">
                +{formatterUS.format(incomes)}
              </div>
              <p className={`text-xs text-muted-foreground ${getEllipsed}`}>
                <span className="font-bold">
                  {formatterUS.format(incomeTransactions.length)}{" "}
                </span>
                income transactions
              </p>
            </>
          ) : (
            <div className={`text-lg font-semibold ${getEllipsed}`}>
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className={`text-sm font-medium ${getEllipsed}`}>
            Expenses in this period
          </CardTitle>
          <Icons.expenses className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-6 my-1" />
              <Skeleton className="w-full h-4 my-1" />
            </>
          ) : filteredData && filteredData.length > 0 ? (
            <>
              <div className="text-2xl font-bold text-red-700">
                {formatterUS.format(expenses)}
              </div>
              <p className={`text-xs text-muted-foreground ${getEllipsed}`}>
                <span className="font-bold">
                  {formatterUS.format(expenseTransactions.length)}{" "}
                </span>
                expense transactions
              </p>
            </>
          ) : (
            <div className={`text-lg font-semibold ${getEllipsed}`}>
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className={`text-sm font-medium ${getEllipsed}`}>
            Net saving in this period
          </CardTitle>
          <Icons.netSavings className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-6 my-1" />
              <Skeleton className="w-full h-4 my-1" />
            </>
          ) : filteredData && filteredData.length > 0 ? (
            <>
              <div
                className={`text-2xl font-bold ${
                  netSavings >= 0 ? "text-green-600" : "text-red-700"
                }`}
              >
                {netSavingSymbol}
                {formatterUS.format(netSavings)}
              </div>
              <p className={`text-xs text-muted-foreground ${getEllipsed}`}>
                <span className="font-bold">
                  {netSavingSymbol}
                  {formatterUS.format(moneyPerDay)}{" "}
                </span>
                per day (in {dateRangeInfo.daysBetween} days)
              </p>
            </>
          ) : (
            <div className={`text-lg font-semibold ${getEllipsed}`}>
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className={`text-sm font-medium ${getEllipsed}`}>
            Transactions in this period
          </CardTitle>
          <Icons.transactions className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-6 my-1" />
              <Skeleton className="w-full h-4 my-1" />
            </>
          ) : filteredData && filteredData.length > 0 ? (
            <>
              <div className="text-2xl font-bold">
                {formatterUS.format(filteredData.length)}
              </div>
              <p className={`text-xs text-muted-foreground ${getEllipsed}`}>
                <span className="font-bold">
                  {incomes >= Math.abs(expenses)
                    ? formatterUS.format(
                        (incomeTransactions.length * 100) / filteredData.length,
                      )
                    : formatterUS.format(
                        (expenseTransactions.length * 100) /
                          filteredData.length,
                      )}
                  %
                </span>{" "}
                are {incomes >= Math.abs(expenses) ? "income" : "expense"}{" "}
                transactions
                {incomes > expenses}
              </p>
            </>
          ) : (
            <div className={`text-lg font-semibold ${getEllipsed}`}>
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
