"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components//ui/separator";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateSubscriptionModal } from "@/components/modal/create-subscription-modal";

interface SubscriptionContentProps {
  userData: { ok: boolean; error?: string; subscriptions?: Subscription[] };
}

// TODO: Style on error, when no data, and the table when subscriptions are found
export const SubscriptionContent = ({ userData }: SubscriptionContentProps) => {
  const [openCreateSubModal, setOpenCreateSubModal] = useState(false);

  return (
    <>
      <CreateSubscriptionModal
        isOpen={openCreateSubModal}
        onClose={() => setOpenCreateSubModal(false)}
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
      {userData.error ? (
        <p>There was an error retrieving the subscriptions {userData.error}</p>
      ) : !userData.subscriptions || userData.subscriptions.length === 0 ? (
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
        <p>You have {userData.subscriptions.length} subscriptions</p>
      )}
    </>
  );
};
