"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components//ui/separator";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/types";
import { Plus } from "lucide-react";

interface SubscriptionContentProps {
  userData: { ok: boolean; error?: string; subscriptions?: Subscription[] };
}

export const SubscriptionContent = ({ userData }: SubscriptionContentProps) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          maxWidthClass="max-w-[calc(100%-180px)]"
          title="Subscriptions"
          description="Manage all your subscriptions to ensure you're not paying for anything you don't use"
        />
        <Button
          variant="default"
          onClick={() => console.log("open add subscription modal")}
        >
          <Plus className="w-4 h-4 mr-2" /> Add subscriptions
        </Button>
      </div>
      <Separator />
      {userData.error ? (
        <p>There was an error retrieving the subscriptions {userData.error}</p>
      ) : userData.subscriptions?.length === 0 ? (
        <p>
          Seems like you dont have any subscription. Are you missing something?
        </p>
      ) : (
        <p>You have {userData.subscriptions?.length} subscriptions</p>
      )}
    </>
  );
};
