import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/transactions-tables/columns";
import { TransactionsTable } from "@/components/tables/transactions-tables/transaction-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { FilteredTransactionsSchema } from "@/schemas/filtered-transactions-schema";
import { getFilteredTransactions } from "@/services/transactions";
import type { CustomSessionI } from "@/types";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  dateFormat,
  errorMessages,
} from "@/utils/const";
import { parseZodErrors } from "@/utils/parse-zod-errors";
import { format, subYears } from "date-fns";
import { Plus } from "lucide-react";
import { type NextAuthOptions, getServerSession } from "next-auth";
import Link from "next/link";
import { z } from "zod";

const breadcrumbItems = [
  { title: "Transactions", link: "/dashboard/transactions" },
  { title: "List", link: "/dashboard/transactions/list" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

type TransactionsProps = {
  userId: string;
  startDate: string;
  endDate: string;
  transType: string | null;
  filterType: string | null;
  filterOperator: string | null;
  filterValue: string | null;
  filteredCategories: string | string[] | undefined;
  offset?: number;
  limit?: number;
};

const getTransactions = async ({
  userId,
  startDate,
  endDate,
  transType,
  filterType,
  filterOperator,
  filterValue,
  filteredCategories,
  offset,
  limit,
}: TransactionsProps) => {
  try {
    const parsedParams = FilteredTransactionsSchema.parse({
      userId,
      startDate,
      endDate,
      transType,
      filterType,
      filterOperator,
      filterValue,
      filteredCategories,
      offset,
      limit,
    });

    return getFilteredTransactions(parsedParams);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { ok: false, error: parseZodErrors({ error: err }), data: null };
    }
    return { ok: false, error: errorMessages.generic, data: null };
  }
};

export default async function ListTransactions({ searchParams }: paramsProps) {
  const {
    startDate: startDateParam,
    endDate: endDateParam,
    page: pageParam,
    limit: pageLimitParam,
    transType,
    filterType,
    filterOperator,
    filterValue,
    categories,
  } = searchParams;
  const page = Number(pageParam) || DEFAULT_PAGE;
  const pageLimit = Number(pageLimitParam) || DEFAULT_PAGE_LIMIT;
  const offset = (page - 1) * pageLimit;
  const searchValue = searchParams.search || null;

  const session = (await getServerSession(
    authOptions as NextAuthOptions,
  )) as CustomSessionI;

  const startDate =
    typeof startDateParam === "string"
      ? startDateParam
      : session?.user?.transactionsDate?.from ??
        format(subYears(new Date(), 1), dateFormat.ISO);
  const endDate =
    typeof endDateParam === "string"
      ? endDateParam
      : session?.user?.transactionsDate?.to ??
        format(new Date(), dateFormat.ISO);

  const transResult = await getTransactions({
    userId: session?.user?.id ?? "",
    startDate,
    endDate,
    transType: transType ? String(transType) : null,
    filterType: filterType ? String(filterType) : null,
    filterOperator: filterOperator ? String(filterOperator) : null,
    filterValue: filterValue ? String(filterValue) : null,
    filteredCategories:
      typeof categories === "string" ? [categories] : categories,
    offset,
    limit: pageLimit,
  });

  const totalTrans = transResult?.data?.totalCount ?? 0;
  const pageCount = Math.ceil(totalTrans / pageLimit);
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Transactions (${totalTrans})`}
            description="Manage your transactions! (show the filters active)"
          />

          <Link
            href={"/dashboard/transactions/add"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="w-4 h-4 mr-2" /> Add transaction
          </Link>
        </div>
        <Separator />

        {transResult.data ? (
          <TransactionsTable
            searchKey="name"
            columns={columns}
            data={transResult.data.list}
            pageCount={pageCount}
            userStoredDates={session.user?.transactionsDate}
          />
        ) : (
          <div>
            <p>There was an error retrieving the transactions</p>
            <p>Message: {transResult.error}</p>
          </div>
        )}
      </div>
    </>
  );
}
