"use client";
import { DeleteTransactionsModal } from "@/components/modal/transactions/delete-transactions-modal";
import { UpdateTransactionsModal } from "@/components/modal/transactions/update-transactions-modal";
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
import type {
  Categories,
  TransactionDeleteReponse,
  TransactionObjBack,
} from "@/types";
import { URL_DELETE_TRANSACTIONS } from "@/utils/const";
import { Row, Table } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  selectedTransactions: TransactionObjBack[];
  row: Row<TransactionObjBack>;
  table: Table<TransactionObjBack>;
  userCategories: Categories[];
}

export const CellAction: React.FC<CellActionProps> = ({
  selectedTransactions,
  row,
  table,
  userCategories,
}) => {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();
  const isSelectedRow = row.getIsSelected();
  const router = useRouter();

  const onDeleteTransactions = async () => {
    setDeleteLoading(true);
    const transactions = selectedTransactions.map((trans) => ({
      transactionIds: trans.id,
      categoriesId: trans.categories,
    }));

    const parsedRes = await fetchPetition<TransactionDeleteReponse>({
      url: URL_DELETE_TRANSACTIONS,
      method: "DELETE",
      body: { transactions },
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
        title: "Transactions successfully deleted",
        description: `Deleted ${parsedRes.deletedCount} ${
          parsedRes.deletedCount === 1 ? "transaction" : "transactions"
        }`,
        variant: "success",
      });
      table.setRowSelection({}); // remove selected rows
      router.refresh();
    }
    setDeleteLoading(false);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <DeleteTransactionsModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={onDeleteTransactions}
        loading={deleteLoading}
        selectedTransactionsLength={selectedTransactions.length}
      />
      <UpdateTransactionsModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        rowData={row.original}
        userCategories={userCategories}
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
          <DropdownMenuItem onClick={() => setOpenUpdateModal(true)}>
            <Edit className="w-4 h-4 mr-2" /> Update
          </DropdownMenuItem>
          {isSelectedRow && (
            <DropdownMenuItem onClick={() => setOpenDeleteModal(true)}>
              <Trash className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
