import BreadCrumb from "@/components/breadcrumb";
import { columns } from "@/components/tables/employee-tables/columns";
import { EmployeeTable } from "@/components/tables/employee-tables/employee-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Employee } from "@/constants/data";
import { authOptions } from "@/lib/auth-options";
import { cn } from "@/lib/utils";
import { getFilteredTransactions } from "@/services/transactions";
import type { CustomSessionI } from "@/types";
import { URL_POST_TRANSACTION } from "@/utils/const";
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
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const URL = `${URL_POST_TRANSACTION}?startDate=2023-04-01&endDate=2023-09-30`;
  const session = (await getServerSession(
    authOptions as NextAuthOptions,
  )) as CustomSessionI;
  const transactions = await getFilteredTransactions({
    userId: session?.user?.id ?? "",
    startDate: "2023-04-01",
    endDate: "2023-09-30",
    transType: null,
    filterType: null,
    filterOperator: null,
    filterValue: null,
    filteredCategories: undefined,
  });
  console.log("resTransactions", transactions);

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
            title={`Transactions (${transactions.transactions.length})`}
            description="Manage your transactions!"
          />

          <Link
            href={"/dashboard/employee/new"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="w-4 h-4 mr-2" /> Add New
          </Link>
        </div>
        <Separator />

        <EmployeeTable
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
