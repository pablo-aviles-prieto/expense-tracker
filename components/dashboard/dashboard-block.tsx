"use client";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { TransactionsBlockChart } from "@/components/dashboard/charts/transactions-block-chart";
import { TransactionsPieChart } from "@/components/dashboard/charts/transactions-pie-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Session } from "next-auth";
import { UserMessage } from "./user-message";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format, subYears } from "date-fns";
import { dateFormat } from "@/utils/const";
import { useFetch } from "@/hooks/use-fetch";
import type { TransactionObjBack } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { KpiBlock } from "./kpi/kpi-block";

type Props = {
  session: Session | null;
};

type ResponseFilteredData = {
  ok: boolean;
  transactions?: TransactionObjBack[];
  error?: string;
};

const URL_POST_TRANSACTION = `/api/transactions/filtered`;

export const Dashboard = ({ session }: Props) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const { fetchPetition } = useFetch();

  useEffect(() => {
    // Reading the localStorage inside useEffect to ensure is read on the client side
    const localStorageDates = localStorage.getItem("expenses-dashboard-dates");
    if (localStorageDates) {
      const parsedStoredDates = JSON.parse(localStorageDates);
      setDate({
        from: new Date(parsedStoredDates.from),
        to: new Date(parsedStoredDates.to),
      });
    } else {
      setDate({
        from: subYears(new Date(), 1),
        to: new Date(),
      });
    }
  }, []);

  const onSetDate = (dateRange: DateRange | undefined) => {
    setDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      const from = format(new Date(dateRange.from), dateFormat.ISO);
      const to = format(new Date(dateRange.to), dateFormat.ISO);
      localStorage.setItem(
        "expenses-dashboard-dates",
        JSON.stringify({ from, to }),
      );
    }
  };

  const fetchFilteredTransactions = async ({ queryKey }: { queryKey: any }) => {
    const [keyPath, { startDate, endDate }] = queryKey;
    const URL = `${keyPath}?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetchPetition<ResponseFilteredData>({
      url: URL,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(response.error ?? "Network response was not ok");
    }
    return response.transactions;
  };

  const {
    data: filteredData,
    error,
    isLoading,
  } = useQuery({
    queryKey: [
      URL_POST_TRANSACTION,
      {
        startDate: format(date?.from ?? new Date(), dateFormat.ISO),
        endDate: format(date?.to ?? new Date(), dateFormat.ISO),
      },
    ],
    queryFn: fetchFilteredTransactions,
    enabled: !!date?.from && !!date?.to,
  });

  // TODO: Disply a toast when error is true via useEffect?

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <UserMessage session={session} />
          <div className="items-center hidden space-x-2 md:flex">
            <CalendarDateRangePicker date={date} setDate={onSetDate} />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiBlock filteredData={filteredData} isLoading={isLoading} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Selected period overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[400px]">
              <TransactionsBlockChart
                filteredData={filteredData}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsPieChart
                filteredData={filteredData}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
