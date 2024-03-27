"use client";

import { DeleteSubscriptionsModal } from "@/components/modal/subscriptions/delete-subscription-modal";
import { UpdateSubscriptionModal } from "@/components/modal/subscriptions/update-subscription-modal";
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
  EnhancedSubscription,
  UserSubscriptionDeleteResponse,
} from "@/types";
import { URL_DELETE_SUBSCRIPTION, URL_GET_SUBSCRIPTION } from "@/utils/const";
import { useQueryClient } from "@tanstack/react-query";
import { Row, Table } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";

interface CellActionProps {
  row: Row<EnhancedSubscription>;
  table: Table<EnhancedSubscription>;
  selectedSubscriptions: EnhancedSubscription[];
}

export const CellAction: React.FC<CellActionProps> = ({
  row,
  table,
  selectedSubscriptions,
}) => {
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isSelectedRow = row.getIsSelected();
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  const onDeleteTransactions = async () => {
    setDeleteLoading(true);
    const subscriptionIds = selectedSubscriptions.map((sub) => sub._id);

    const parsedRes = await fetchPetition<UserSubscriptionDeleteResponse>({
      url: URL_DELETE_SUBSCRIPTION,
      method: "DELETE",
      body: { subscriptionIds },
      extraHeaders: { "Content-Type": "application/json" },
    });
    if (parsedRes.error) {
      toast({
        title: "There was an error deleting the subscriptions",
        description: parsedRes.error,
        variant: "destructive",
      });
    }
    if (parsedRes.result) {
      toast({
        title: "Subscriptions succesfully deleted",
        description: `Deleted ${subscriptionIds.length} ${
          subscriptionIds.length === 1 ? "subscription" : "subscriptions"
        }`,
        variant: "success",
      });
      table.setRowSelection({}); // remove selected rows
      await queryClient.invalidateQueries({
        queryKey: [URL_GET_SUBSCRIPTION],
      });
    }
    setDeleteLoading(false);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <DeleteSubscriptionsModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={onDeleteTransactions}
        loading={deleteLoading}
        selectedSubscriptionsLength={selectedSubscriptions.length}
      />
      <UpdateSubscriptionModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        rowData={row.original}
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
