import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { getEllipsed } from "@/utils/const";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { type NextAuthOptions, getServerSession } from "next-auth";
import type { CustomSessionI } from "@/types";
import { authOptions } from "@/lib/auth-options";
import { getUserCategories } from "@/services/user";
import { AddTransactionsTab } from "@/components/add-transactions/add-transactions-tab";

const breadcrumbItems = [
  { title: "Transactions", link: "/dashboard/transactions" },
  { title: "Add", link: "/dashboard/transactions/add" },
];

export default async function AddTransactionsEntryPoint() {
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
          href={"/dashboard/transactions/list"}
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
      <AddTransactionsTab userCategories={userCategories} />
    </div>
  );
}
