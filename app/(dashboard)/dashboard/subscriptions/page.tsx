import { errorMessages } from "@/utils/const";
import { type NextAuthOptions, getServerSession } from "next-auth";
import type { CustomSessionI } from "@/types";
import { authOptions } from "@/lib/auth-options";
import { getUsersSubscriptions } from "@/services/user";
import BreadCrumb from "@/components/breadcrumb";
import { SubscriptionContent } from "@/components/subscriptions/subscription-content";

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
      <SubscriptionContent userData={userData} />
    </div>
  );
}
