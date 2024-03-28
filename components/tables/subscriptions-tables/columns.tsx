"use client";

import { ColumnDef, Row, Table } from "@tanstack/react-table";
import {
  BillingPeriod,
  type EnhancedSubscription,
  type Subscription,
} from "@/types";
import { AmountCell } from "../amount-cell";
import { DateCell } from "../date-cell";
import { NextBillingDateCell } from "./next-billing-date-cell";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { formatEnumKey, getEnumKeyByEnumValue } from "@/utils/enum-operations";
import { getStatusInfo } from "./utils/get-status-info";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParsedRow {
  original: EnhancedSubscription;
}

export const columns: ColumnDef<Subscription>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    cell: ({ getValue }) => {
      const enumKey = getEnumKeyByEnumValue(
        BillingPeriod,
        getValue() as string,
      );
      return (
        <div className="min-w-[110px]">{formatEnumKey(enumKey ?? "")}</div>
      );
    },
  },
  {
    accessorKey: "autoRenew",
    header: "AUTO RENEW",
    cell: ({ getValue }) => {
      return <div className="min-w-[110px]">{String(getValue())}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ getValue }) => {
      const statusInfo = getStatusInfo(String(getValue()));
      const Icon = Icons[statusInfo?.icon ?? "active"];
      return (
        <Tooltip>
          <TooltipTrigger>
            <div className="ml-3">
              <Icon className={statusInfo?.color} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-bold">{statusInfo?.text}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "notes",
    header: "NOTES",
  },
  {
    id: "actions",
    cell: ({ table, row }) => {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const selectedSubscriptions = (
        selectedRows as unknown as ParsedRow[]
      ).map((row) => row.original);
      return (
        <CellAction
          row={row as unknown as Row<EnhancedSubscription>}
          table={table as unknown as Table<EnhancedSubscription>}
          selectedSubscriptions={selectedSubscriptions}
        />
      );
    },
  },
];
