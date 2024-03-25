"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components//ui/separator";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateSubscriptionModal } from "@/components/modal/create-subscription-modal";
import { URL_GET_SUBSCRIPTION } from "@/utils/const";
import { useQuery } from "@tanstack/react-query";
import { useFetch } from "@/hooks/use-fetch";
import { useToast } from "@/components/ui/use-toast";
import { SubscriptionTable } from "../tables/subscriptions-tables/subscription-table";
import { columns } from "../tables/subscriptions-tables/columns";

interface ResponseSubscriptions {
  ok: boolean;
  error?: string;
  subscriptions?: Subscription[];
}

// TODO: Style on error, when no data, and the loading (use a skeleton?)
export const SubscriptionContent = () => {
  const [openCreateSubModal, setOpenCreateSubModal] = useState(false);
  const { fetchPetition } = useFetch();
  const { toast } = useToast();

  const fetchSubscriptions = async () => {
    const response = await fetchPetition<ResponseSubscriptions>({
      url: URL_GET_SUBSCRIPTION,
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(response.error ?? "Network response was not ok");
    }
    return response.subscriptions;
  };

  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [URL_GET_SUBSCRIPTION],
    queryFn: fetchSubscriptions,
  });

  useEffect(() => {
    if (error && !isLoading) {
      toast({
        title: "There has been an error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, isLoading]);

  return (
    <>
      <CreateSubscriptionModal
        isOpen={openCreateSubModal}
        onClose={() => setOpenCreateSubModal(false)}
        refetch={refetch}
      />
      <div className="flex items-start justify-between">
        <Heading
          maxWidthClass="max-w-[calc(100%-180px)]"
          title="Subscriptions"
          description="Manage all your subscriptions to ensure you're not paying for anything you don't use"
        />
        <Button variant="default" onClick={() => setOpenCreateSubModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add subscriptions
        </Button>
      </div>
      <Separator />
      {error ? (
        <p>There was an error retrieving the subscriptions</p>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : !userData || userData?.length === 0 ? (
        <div className="flex items-end gap-x-2">
          <p>Seems like you dont have any subscription. </p>
          <Button
            className="p-0 h-[22px]"
            variant="link"
            onClick={() => setOpenCreateSubModal(true)}
          >
            Want to add some?
          </Button>
        </div>
      ) : (
        <SubscriptionTable columns={columns} data={userData} />
      )}
    </>
  );
};
