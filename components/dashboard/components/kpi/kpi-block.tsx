"use client";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransactionObjBack } from "@/types";
import { calculateTotalTypeTrans } from "../../utils/calculate-total-type-trans";
import { formatterUS, getEllipsed } from "@/utils/const";
import { differenceInCalendarDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { useCurrency } from "@/hooks/use-currency";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  isLoading: boolean;
  dateBlock: DateRange | undefined;
};

// TODO: Create a helper function that wraps the formatterUS, so it can return
// a minimum of 2 fraction digits if its not a whole number
export const KpiBlock = ({ filteredData, isLoading, dateBlock }: Props) => {
  const { currency } = useCurrency();

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
  const daysBetweenDates =
    dateBlock?.from && dateBlock?.to
      ? differenceInCalendarDays(dateBlock.to, dateBlock.from)
      : 0;
  const moneyPerDay = netSavings / daysBetweenDates;

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
                {currency}
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
                {currency}
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
                {currency}
              </div>
              <p className={`text-xs text-muted-foreground ${getEllipsed}`}>
                <span className="font-bold">
                  {netSavingSymbol}
                  {formatterUS.format(moneyPerDay)}{" "}
                </span>
                per day (in {daysBetweenDates} days)
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
