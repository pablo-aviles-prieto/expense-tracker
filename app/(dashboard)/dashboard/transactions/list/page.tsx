import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/employee-tables/columns";
import { TransactionsTable } from "@/components/tables/transactions-tables/transaction-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Employee } from "@/constants/data";
import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { getFilteredTransactions } from "@/services/transactions";
import type { CustomSessionI } from "@/types";
import { dateFormat } from "@/utils/const";
import { format, subYears } from "date-fns";
import { Plus } from "lucide-react";
import { type NextAuthOptions, getServerSession } from "next-auth";
import Link from "next/link";

const breadcrumbItems = [
  { title: "Transactions", link: "/dashboard/transactions" },
  { title: "List", link: "/dashboard/transactions/list" },
];

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function ListTransactions({ searchParams }: paramsProps) {
  const page = Number(searchParams.page) || 2;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  // TODO: Sanitize the queryParams to avoid crashing
  const {
    startDate: startDateParam,
    endDate: endDateParam,
    transType, // incomes / expenses
    filterType, // Amount / Name (also looking in notes)
    filterOperator, // gt / lt (used along Amount as filterType)
    filterValue, // used along with the filterType, number (Amount) or string (Name)
    categories, // string[] of category names
  } = searchParams;

  const startDate =
    typeof startDateParam === "string"
      ? startDateParam
      : format(subYears(new Date(), 1), dateFormat.ISO);
  const endDate =
    typeof endDateParam === "string"
      ? endDateParam
      : format(new Date(), dateFormat.ISO);

  const session = (await getServerSession(
    authOptions as NextAuthOptions,
  )) as CustomSessionI;
  const { ok, transactions } = await getFilteredTransactions({
    userId: session?.user?.id ?? "",
    startDate: startDate,
    endDate: endDate,
    transType: transType ? String(transType) : null,
    filterType: filterType ? String(filterType) : null,
    filterOperator: filterOperator ? String(filterOperator) : null,
    filterValue: filterValue ? String(filterValue) : null,
    filteredCategories:
      typeof categories === "string" ? [categories] : categories,
  });
  // console.log("transactions", transactions);

  const res = await fetch(
    `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
      (country ? `&search=${country}` : ""),
  );
  const employeeRes = await res.json();
  const totalUsers = employeeRes.total_users; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const employee: Employee[] = employeeRes.users;
  return (
    <>
      <div className="flex-1 p-4 pt-6 space-y-4 md:p-8">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Transactions (${transactions.length})`}
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

        <TransactionsTable
          searchKey="country"
          pageNo={page}
          columns={columns}
          totalUsers={totalUsers}
          data={employee}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
