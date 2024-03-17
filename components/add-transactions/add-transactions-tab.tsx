"use client";

import { getEllipsed } from "@/utils/const";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { AddTransactionsTableProvider } from "@/contexts/add-transactions-table-provider";
import { AddTransactionsBulkBlock } from "./bulk/add-transactions-bulk-block";
import { AddTransactionsSingleBlock } from "./single/add-transactions-single-block";
import type { Categories } from "@/types";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface AddTransactionsTabProps {
  userCategories: Categories[];
}

const TABS_CLASSES = `w-full ${getEllipsed} tracking-tighter sm:tracking-normal`;

export const AddTransactionsTab = ({
  userCategories,
}: AddTransactionsTabProps) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>(
    pathname.includes("multiple") ? "multiple" : "single",
  );
  const router = useRouter();

  const switchTab = (tabValue: string) => {
    router.push(tabValue);
    setActiveTab(tabValue);
  };

  return (
    <Tabs value={activeTab} onValueChange={switchTab}>
      <TabsList className="flex mx-auto justify-center w-[345px] sm:w-[500px] mb-8">
        <TabsTrigger className={TABS_CLASSES} value="multiple">
          Add multiple transactions
        </TabsTrigger>
        <TabsTrigger className={TABS_CLASSES} value="single">
          Add a single transaction
        </TabsTrigger>
      </TabsList>
      <TabsContent value="multiple">
        <AddTransactionsTableProvider>
          <AddTransactionsBulkBlock userCategories={userCategories} />
        </AddTransactionsTableProvider>
      </TabsContent>
      <TabsContent value="single">
        <AddTransactionsSingleBlock
          userCategories={userCategories}
          switchTab={switchTab}
        />
      </TabsContent>
    </Tabs>
  );
};
