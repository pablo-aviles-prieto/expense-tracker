"use client";

import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Icons } from "@/components/icons";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Session } from "next-auth";
import { UserMessage } from "./user-message";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";

type Props = {
  session: Session | null;
};

export const Dashboard = ({ session }: Props) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const getDate = (e: DateRange | undefined) => {
    setDate(e);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <UserMessage session={session} />
          <div className="items-center hidden space-x-2 md:flex">
            <CalendarDateRangePicker setParentDate={getDate} />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Incomes in this period
                  </CardTitle>
                  <Icons.incomes className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    €45,231.89
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Expenses in this period
                  </CardTitle>
                  <Icons.expenses className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-700">
                    €23,350.24
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Net saving in this period
                  </CardTitle>
                  <Icons.netSavings className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Transactions in this period
                  </CardTitle>
                  <Icons.transactions className="w-6 h-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Selected period overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview from={date?.from} to={date?.to} />
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};
