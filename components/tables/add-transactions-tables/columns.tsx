"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { TransactionBulk } from "@/types";
import { AmountCell } from "../amount-cell";

export const columns: ColumnDef<TransactionBulk>[] = [
  {
    accessorKey: "Concept",
    header: "NAME",
  },
  {
    accessorKey: "Amount",
    header: "AMOUNT",
    cell: ({ getValue }) => <AmountCell amount={getValue() as string} />,
  },
  {
    accessorKey: "Date",
    header: "DATE",
  },
  {
    accessorKey: "Categories",
    header: "CATEGORIES",
    cell: () => <div>Combobox</div>,
  },
  {
    accessorKey: "Notes",
    header: "NOTES",
  },
];
