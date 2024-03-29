import { Icons } from "@/components/icons";
import { SubscriptionStatus } from "@/types";

interface StatusInfoResponse {
  text: string;
  icon: keyof typeof Icons;
  color: string;
}

export const getStatusInfo = (status: string): StatusInfoResponse | null => {
  switch (status) {
    case SubscriptionStatus.Paused:
      return { text: "Paused", icon: "pause", color: "text-warning" };
    case SubscriptionStatus.Cancelled:
      return { text: "Cancelled", icon: "cancel", color: "text-destructive" };
    case SubscriptionStatus.Active:
      return { text: "Active", icon: "active", color: "text-success" };
    default:
      return null;
  }
};
