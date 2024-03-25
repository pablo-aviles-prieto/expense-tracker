import BreadCrumb from "@/components/breadcrumb";
import { SubscriptionContent } from "@/components/subscriptions/subscription-content";

const breadcrumbItems = [
  { title: "Subscriptions", link: "/dashboard/subscriptions" },
];

export default async function Subscriptions() {
  return (
    <div className="flex-1 p-4 pt-6 space-y-2 sm:space-y-4 md:p-8">
      <BreadCrumb items={breadcrumbItems} />
      <SubscriptionContent />
    </div>
  );
}
