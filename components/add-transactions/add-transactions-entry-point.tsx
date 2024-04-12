import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { type NextAuthOptions, getServerSession } from "next-auth";
import type { CustomSessionI } from "@/types";
import { authOptions } from "@/lib/auth-options";
import { getUserCategories } from "@/services/user";
import { AddTransactionsTab } from "@/components/add-transactions/add-transactions-tab";
import { BreadCrumbTransactions } from "./bread-crumb-transactions";

export default async function AddTransactionsEntryPoint() {
  const session = (await getServerSession(
    authOptions as unknown as NextAuthOptions,
  )) as CustomSessionI;

  const userCategories = await getUserCategories(session?.user?.id ?? "");

  return (
    <div className="flex-1 p-4 pt-6 space-y-2 sm:space-y-4 md:p-8">
      <BreadCrumbTransactions />

      <div className="flex items-start justify-between">
        <Heading
          maxWidthClass="max-w-[calc(100%-180px)]"
          title="Add transactions"
          description="Add transactions autommatically via CSV or manually"
        />
        <Link
          href={"/dashboard/transactions/list"}
          className={cn(buttonVariants())}
        >
          <Undo2 className="w-4 h-4 mr-2" /> Go back to the list
        </Link>
      </div>
      <Separator />
      <AddTransactionsTab userCategories={userCategories} />
    </div>
  );
}
