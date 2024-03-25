"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { EnhancedSubscription, Subscription } from "@/types";
import { AmountCell } from "../amount-cell";
import { DateCell } from "../date-cell";
import { NextBillingDateCell } from "./next-billing-date-cell";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Subscription>[] = [
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "price",
    header: "PRICE",
    cell: ({ getValue }) => (
      <AmountCell textLeft amount={getValue() as string} />
    ),
  },
  {
    accessorKey: "startDate",
    header: "START DATE",
    cell: ({ getValue }) => <DateCell date={getValue() as string} />,
  },
  {
    accessorKey: "nextBillingDate",
    header: "NEXT BILLING DATE",
    cell: ({ row }) => (
      <NextBillingDateCell
        billingPeriod={row.original.billingPeriod}
        startDateStr={row.original.startDate}
      />
    ),
  },
  {
    accessorKey: "billingPeriod",
    header: "BILLING PERIOD",
  },
  {
    accessorKey: "autoRenew",
    header: "AUTO RENEW",
  },
  {
    accessorKey: "status",
    header: "STATUS",
  },
  {
    accessorKey: "notes",
    header: "NOTES",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellAction row={row.original as EnhancedSubscription} />
    ),
  },
];
