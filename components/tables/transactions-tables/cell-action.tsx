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
import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/use-fetch";
import type { TransactionDeleteReponse, TransactionObjBack } from "@/types";
import { URL_DELETE_TRANSACTIONS } from "@/utils/const";
import { Row, Table } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  selectedTransactions: TransactionObjBack[];
  row: Row<TransactionObjBack>;
  table: Table<TransactionObjBack>;
}

// TODO: The update should open a modal with a form for the concrete row clicked
export const CellAction: React.FC<CellActionProps> = ({
  selectedTransactions,
  row,
  table,
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const isSelectedRow = row.getIsSelected();
  const router = useRouter();

  const onDeleteTransactions = async () => {
    setLoading(true);
    const transactionIds = selectedTransactions.map((trans) => trans.id);
    const parsedRes = await fetchPetition<TransactionDeleteReponse>({
      url: URL_DELETE_TRANSACTIONS,
      method: "DELETE",
      body: { transactionIds },
      extraHeaders: { "Content-Type": "application/json" },
    });
    if (parsedRes.error) {
      toast({
        title: "There was an error deleting the transactions",
        description: parsedRes.error,
        variant: "destructive",
      });
    }
    if (parsedRes.result && parsedRes.deletedCount) {
      toast({
        title: "Transactions succesfully deleted",
        description: `Deleted ${parsedRes.deletedCount} ${
          parsedRes.deletedCount === 1 ? "transaction" : "transactions"
        }`,
        variant: "success",
      });
      table.setRowSelection({}); // remove selected rows
      router.refresh();
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <DeleteTransactionsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDeleteTransactions}
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
            onClick={() => {
              console.log("update row", row.original);
              table.setRowSelection({});
            }}
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
