import { Icons } from "@/components/icons";

interface StatusInfoResponse {
  text: string;
  icon: keyof typeof Icons;
  color: string;
}

export const getAutoRenewInfo = (
  status: boolean,
): StatusInfoResponse | null => {
  switch (status) {
    case true:
      return { text: "ON", icon: "autoRenew", color: "text-success" };
    case false:
      return { text: "OFF", icon: "autoRenewOff", color: "text-destructive" };
  }
};
