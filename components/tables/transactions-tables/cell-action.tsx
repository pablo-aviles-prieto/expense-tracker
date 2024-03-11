"use client";
import { DeleteTransactionsModal } from "@/components/modal/delete-transactions-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TransactionObjBack } from "@/types";
import { Row } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  selectedTransactions: TransactionObjBack[];
  row: Row<TransactionObjBack>;
}

// TODO: The update should open a modal with a form for the concrete row clicked
// and the delete, should delete in bulk all the transactions selected
export const CellAction: React.FC<CellActionProps> = ({
  selectedTransactions,
  row,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const isSelectedRow = row.getIsSelected();

  // TODO: Delete the selected transactions
  const onConfirm = async () => {
    setLoading(true);
    console.log("selectedTransactions", selectedTransactions);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <DeleteTransactionsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
        selectedTransactionsLength={selectedTransactions.length}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => console.log("update row", row.original)}
          >
            <Edit className="w-4 h-4 mr-2" /> Update
          </DropdownMenuItem>
          {isSelectedRow && (
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
