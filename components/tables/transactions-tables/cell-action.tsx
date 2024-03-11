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
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  selectedTransactions: TransactionObjBack[];
}

export const CellAction: React.FC<CellActionProps> = ({
  selectedTransactions,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
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
            onClick={() => console.log("update trans", selectedTransactions)}
          >
            <Edit className="w-4 h-4 mr-2" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
