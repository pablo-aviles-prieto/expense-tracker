import BreadCrumb from "@/components/breadcrumb";
import { ErrorBlock } from "@/components/tables/transactions-tables/error-block";
import { TransactionsTable } from "@/components/tables/transactions-tables/transaction-table";
import { getActiveFilters } from "@/components/tables/transactions-tables/utils/get-active-filters";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { FilteredTransactionsSchema } from "@/schemas/filtered-transactions-schema";
import { getFilteredTransactions } from "@/services/transactions";
import { getUserCategories } from "@/services/user";
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

type ParamsProps = {
  searchParams: {
    [key: string]: string | undefined;
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
  filteredCategories: string[] | undefined;
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

export default async function ListTransactions({ searchParams }: ParamsProps) {
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
    viewport,
  } = searchParams;
  const page = Number(pageParam) || DEFAULT_PAGE;
  const pageLimit = Number(pageLimitParam) || DEFAULT_PAGE_LIMIT;
  const offset = (page - 1) * pageLimit;
  const parsedCategories = categories?.split(",");

  const session = (await getServerSession(
    authOptions as unknown as NextAuthOptions,
  )) as CustomSessionI;

  const userCategories = await getUserCategories(session?.user?.id ?? "");

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
    transType: transType ?? null,
    filterType: filterType ?? null,
    filterOperator: filterOperator ?? null,
    filterValue: filterValue ?? null,
    filteredCategories: parsedCategories,
    offset,
    limit: pageLimit,
  });

  const filteredTrans = getActiveFilters({
    startDate,
    endDate,
    transType,
    filterOperator,
    filterType,
    filterValue,
    categories: parsedCategories,
  });

  const totalTrans = transResult?.data?.totalCount ?? 0;
  const pageCount = Math.ceil(totalTrans / pageLimit);
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-2 sm:space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            maxWidthClass="max-w-[calc(100%-175px)]"
            title={
              transResult.error
                ? "Error retrieving the transactions"
                : `Transactions (${totalTrans})`
            }
            description={transResult.error ? "" : filteredTrans}
          />

          {!transResult.error && (
            <Link
              href={"/dashboard/transactions/add/multiple"}
              className={cn(buttonVariants())}
            >
              <Plus className="w-4 h-4 mr-2" /> Add transactions
            </Link>
          )}
        </div>
        <Separator />

        {transResult.data ? (
          <TransactionsTable
            data={transResult.data.list}
            pageCount={pageCount}
            userStoredDates={session.user?.transactionsDate}
            userCategories={userCategories}
            viewport={viewport}
          />
        ) : (
          <ErrorBlock transError={transResult.error} />
        )}
      </div>
    </>
  );
}
