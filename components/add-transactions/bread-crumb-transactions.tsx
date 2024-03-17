"use client";

import BreadCrumb from "@/components/breadcrumb";
import { usePathname } from "next/navigation";

export const BreadCrumbTransactions = () => {
  const pathname = usePathname();

  const breadcrumbItems = [
    { title: "Transactions", link: "/dashboard/transactions" },
    { title: "Add", link: "/dashboard/transactions/add" },
    {
      title: pathname.includes("multiple") ? "Multiple" : "Single",
      link: pathname.includes("multiple")
        ? "/dashboard/transactions/add/multiple"
        : "/dashboard/transactions/add/single",
    },
  ];

  return <BreadCrumb items={breadcrumbItems} />;
};
