'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { format, subYears } from 'date-fns';
import { Session } from 'next-auth';
import { DateRange } from 'react-day-picker';

import { TransactionsBlockChart } from '@/components/dashboard/components/charts/transactions-block-chart';
import { TransactionsPieChart } from '@/components/dashboard/components/charts/transactions-pie-chart';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFetch } from '@/hooks/use-fetch';
import type { TransactionObjBack } from '@/types';
import { dateFormat, URL_POST_TRANSACTION } from '@/utils/const';
import { useToast } from '../../ui/use-toast';
import { KpiBlock } from './kpi/kpi-block';
import { UserMessage } from './user-message';

type Props = {
  session: Session | null;
  viewport: string | undefined;
};

type ResponseFilteredData = {
  ok: boolean;
  data?: { list: TransactionObjBack[]; totalCount: number };
  error?: string;
};

export const Dashboard = ({ session, viewport }: Props) => {
  // Have to add this initial loader cuz the useEffect cause a flicker
  const [initialLoading, setInitialLoading] = useState(true);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchFilteredTransactions = async ({ queryKey }: { queryKey: any }) => {
    const [keyPath, { startDate, endDate }] = queryKey;
    const URL = `${keyPath}?startDate=${startDate}&endDate=${endDate}`;
    const response = await fetchPetition<ResponseFilteredData>({
      url: URL,
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(response.error ?? 'Network response was not ok');
    }
    return response.data?.list;
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

  useEffect(() => {
    // Reading the localStorage inside useEffect to ensure is read on the client side
    const localStorageDates = localStorage.getItem('expenses-dashboard-dates');
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
    setInitialLoading(false);
  }, []);

  useEffect(() => {
    if (error && !isLoading) {
      toast({
        title: 'There has been an error',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, isLoading]);

  const onSetDate = (dateRange: DateRange | undefined) => {
    setDate(dateRange);
    if (dateRange?.from && dateRange?.to) {
      const from = format(new Date(dateRange.from), dateFormat.ISO);
      const to = format(new Date(dateRange.to), dateFormat.ISO);
      localStorage.setItem('expenses-dashboard-dates', JSON.stringify({ from, to }));
    }
  };

  return (
    <ScrollArea className='h-full'>
      <div className='flex-1 space-y-4 p-4 pt-6 md:p-8'>
        <div className='flex flex-col items-center justify-between space-y-2 md:flex-row'>
          <UserMessage session={session} />
          <div className='items-center space-x-2 md:flex'>
            <CalendarDateRangePicker viewport={viewport} date={date} setDate={onSetDate} />
          </div>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <KpiBlock
            filteredData={filteredData}
            isLoading={isLoading || initialLoading}
            dateBlock={date}
          />
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-7'>
          <Card className='relative col-span-4'>
            <CardHeader>
              <CardTitle>Selected period overview</CardTitle>
            </CardHeader>
            <CardContent className='h-[400px] pl-0'>
              <TransactionsBlockChart
                filteredData={filteredData}
                isLoading={isLoading || initialLoading}
              />
            </CardContent>
          </Card>
          <Card className='relative col-span-4 xl:col-span-3'>
            <CardHeader>
              <CardTitle>Organized by categories</CardTitle>
              {filteredData && filteredData.length > 0 && (
                <CardDescription className='!mt-3 text-[13px] italic'>
                  If a transaction has multiple categories, the amount will be added to all of them
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <TransactionsPieChart
                filteredData={filteredData}
                isLoading={isLoading || initialLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
};
