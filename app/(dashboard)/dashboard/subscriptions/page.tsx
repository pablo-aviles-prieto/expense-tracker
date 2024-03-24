import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { errorMessages, getEllipsed } from "@/utils/const";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { type NextAuthOptions, getServerSession } from "next-auth";
import type { CustomSessionI } from "@/types";
import { authOptions } from "@/lib/auth-options";
import { getUsersSubscriptions } from "@/services/user";
import BreadCrumb from "@/components/breadcrumb";

const breadcrumbItems = [
  { title: "Subscriptions", link: "/dashboard/subscriptions" },
];

const retrieveSubscriptions = async () => {
  try {
    const session = (await getServerSession(
      authOptions as NextAuthOptions,
    )) as CustomSessionI;
    const subscriptions = await getUsersSubscriptions(session.user?.id ?? "");
    return { ok: true, subscriptions };
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : errorMessages.retrieveSubscriptions;
    return { ok: false, error: errorMessage };
  }
};

export default async function Subscriptions() {
  const userData = await retrieveSubscriptions();

  return (
    <div className="flex-1 p-4 pt-6 space-y-2 sm:space-y-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          maxWidthClass="max-w-[calc(100%-150px)] sm:max-w-[calc(100%-170px)]"
          title="Subscriptions"
          description="Manage all your subscriptions to ensure you're not paying for anything you don't use"
        />
        <Link
          href={"#"}
          className={cn(
            buttonVariants(),
            getEllipsed,
            "h-8 px-3 sm:px-4 sm:h-9 text-xs sm:text-sm",
          )}
        >
          <Plus className="w-4 h-4 mr-2" /> Add subscription
        </Link>
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
    </div>
  );
}
