import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { TransactionObjBack } from "@/types";

type Props = {
  filteredData: TransactionObjBack[] | undefined;
  error: Error | null;
  isLoading: boolean;
};

export const KpiBlock = ({ filteredData, isLoading, error }: Props) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Incomes in this period
          </CardTitle>
          <Icons.incomes className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {isLoading ? (
              <Skeleton className="w-full h-6 my-1" />
            ) : (
              "€45,231.89"
            )}
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
            {isLoading ? (
              <Skeleton className="w-full h-6 my-1" />
            ) : (
              "€23,350.24"
            )}
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
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="w-full h-6 my-1" /> : "+12,234"}
          </div>
          <p className="text-xs text-muted-foreground">+19% from last month</p>
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
          <div className="text-2xl font-bold">
            {isLoading ? <Skeleton className="w-full h-6 my-1" /> : "+573"}
          </div>
          <p className="text-xs text-muted-foreground">+201 since last hour</p>
        </CardContent>
      </Card>
    </>
  );
};
