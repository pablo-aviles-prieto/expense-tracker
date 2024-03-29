import { BillingPeriod } from "@/types";
import { format } from "date-fns";

type NextBillingDateParams = {
  startDateStr: string;
  billingPeriod: BillingPeriod;
  dateFormat: string;
};

export const getNextBillingDate = ({
  startDateStr,
  billingPeriod,
  dateFormat,
}: NextBillingDateParams): string => {
  const startDate = new Date(startDateStr);
  const today = new Date();
  let nextBillingDate = new Date(startDate);

  while (nextBillingDate <= today) {
    switch (billingPeriod) {
      case BillingPeriod.Monthly:
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        break;
      case BillingPeriod.BiMonthly:
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 2);
        break;
      case BillingPeriod.Quarterly:
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
        break;
      case BillingPeriod.SemiAnnually:
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 6);
        break;
      case BillingPeriod.Annually:
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        break;
      case BillingPeriod.Biennially:
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 2);
        break;
      default:
        throw new Error("Invalid billing period");
    }
  }

  return format(new Date(nextBillingDate), dateFormat);
};
