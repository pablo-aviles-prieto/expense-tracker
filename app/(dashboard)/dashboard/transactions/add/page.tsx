import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { getEllipsed } from "@/utils/const";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { AddTransactionsBulkBlock } from "@/components/add-transactions/bulk/add-transactions-bulk-block";
import { type NextAuthOptions, getServerSession } from "next-auth";
import type { CustomSessionI } from "@/types";
import { authOptions } from "@/lib/auth-options";
import { getUserCategories } from "@/services/user";
import { AddTransactionsTableProvider } from "@/contexts/add-transactions-table-provider";
import { AddTransactionsSingleBlock } from "@/components/add-transactions/single/add-transactions-single-block";

const breadcrumbItems = [
  { title: "Transactions", link: "/dashboard/transactions" },
  { title: "Add", link: "/dashboard/transactions/add" },
];

const tabsClasses = `w-full ${getEllipsed} tracking-tighter sm:tracking-normal`;

export default async function AddTransactions() {
  const session = (await getServerSession(
    authOptions as NextAuthOptions,
  )) as CustomSessionI;

  const userCategories = await getUserCategories(session?.user?.id ?? "");

  return (
    <div className="flex-1 p-4 pt-6 space-y-2 sm:space-y-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          maxWidthClass="max-w-[calc(100%-167px)]"
          title="Add transactions"
          description="Add transactions autommatically via CSV or manually"
        />
        <Link
          href={"/dashboard/transactions/add"}
          className={cn(
            buttonVariants(),
            getEllipsed,
            "h-8 px-3 sm:px-4 sm:h-9 text-xs sm:text-sm",
          )}
        >
          <Undo2 className="w-4 h-4 mr-2" /> Go back to the list
        </Link>
      </div>
      <Separator />

      <Tabs defaultValue="multiple">
        <TabsList className="flex mx-auto justify-center w-[345px] sm:w-[500px] mb-8">
          <TabsTrigger className={tabsClasses} value="multiple">
            Add transactions via CSV
          </TabsTrigger>
          <TabsTrigger className={tabsClasses} value="manual">
            Add transactions manually
          </TabsTrigger>
        </TabsList>
        <TabsContent value="multiple">
          <AddTransactionsTableProvider>
            <AddTransactionsBulkBlock userCategories={userCategories} />
          </AddTransactionsTableProvider>
        </TabsContent>
        <TabsContent value="manual">
          <AddTransactionsSingleBlock />
        </TabsContent>
      </Tabs>
    </div>
  );
}
