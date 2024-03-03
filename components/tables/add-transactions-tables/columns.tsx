"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { TransactionBulk } from "@/types";
import { AmountCell } from "../amount-cell";
import { ComboboxField } from "@/components/add-transactions/combobox-field";

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
    cell: ({ row }) => (
      <ComboboxField
        selectedRow={row.index}
        selectedCategories={row.original.selectedCategories}
      />
    ),
  },
  {
    accessorKey: "Notes",
    header: "NOTES",
  },
];
