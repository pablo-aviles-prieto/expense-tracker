"use client";

import { UpdateSubscriptionModal } from "@/components/modal/subscriptions/update-subscription-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EnhancedSubscription } from "@/types";
import { URL_GET_SUBSCRIPTION } from "@/utils/const";
import { useQueryClient } from "@tanstack/react-query";
import { CoreRow } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  row: CoreRow<EnhancedSubscription>["original"];
}

export const CellAction: React.FC<CellActionProps> = ({ row }) => {
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  return (
    <>
      {/* <DeleteTransactionsModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={onDeleteTransactions}
        loading={deleteLoading}
        selectedTransactionsLength={selectedTransactions.length}
        />*/}
      <UpdateSubscriptionModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        rowData={row}
        refetch={async () =>
          await queryClient.invalidateQueries({
            queryKey: [URL_GET_SUBSCRIPTION],
          })
        }
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
          <DropdownMenuItem onClick={() => console.log("delete row", row)}>
            <Trash className="w-4 h-4 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
