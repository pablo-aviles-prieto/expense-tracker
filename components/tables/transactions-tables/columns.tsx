"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import type { Category, TransactionObjBack } from "@/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEllipsed } from "@/utils/const";
import { DateCell } from "./date-cell";
import { AmountCell } from "../amount-cell";

interface ParsedRow {
  original: TransactionObjBack;
}

export const columns: ColumnDef<TransactionObjBack>[] = [
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
    accessorKey: "amount",
    header: "AMOUNT",
    cell: ({ getValue }) => <AmountCell amount={getValue() as string} />,
  },
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ getValue }) => <DateCell date={getValue() as string} />,
  },
  {
    accessorKey: "categories",
    header: "CATEGORIES",
    cell: ({ getValue }) => {
      const categories = getValue() as Category[];
      return (
        <Tooltip>
          <TooltipTrigger>
            <div
              className={`${getEllipsed} max-w-[100px] bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 px-[10px] py-[5px]
              rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
              `}
            >
              {categories.map((category) => category.name).join(", ")}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-bold">
              {categories.map((category) => category.name).join(", ")}
            </p>
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
      const selectedTransactions = (selectedRows as unknown as ParsedRow[]).map(
        (row) => row.original,
      );
      return (
        <CellAction
          selectedTransactions={selectedTransactions}
          row={row}
          table={table}
        />
      );
    },
  },
];
