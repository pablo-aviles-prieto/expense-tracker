import { BillingPeriod, Subscription, SubscriptionStatus } from '@/types';

export interface CostSummary {
  totalSubsmonthly: number;
  totalSubsAnnually: number;
  activeSubsMonthly: number;
  activeSubsAnnually: number;
}

const round = (value: number) => Math.round(value * 100) / 100;

export const getSubscriptionCosts = (
  subscriptions: Subscription[] | undefined
): CostSummary | null => {
  if (!subscriptions) return null;

  const rawTotals = subscriptions.reduce<CostSummary>(
    (acc, sub) => {
      const monthlyPrice = convertToMonthly(sub.price, sub.billingPeriod);
      acc.totalSubsmonthly += monthlyPrice;
      acc.totalSubsAnnually += monthlyPrice * 12;
      if (sub.status === SubscriptionStatus.Active) {
        acc.activeSubsMonthly += monthlyPrice;
        acc.activeSubsAnnually += monthlyPrice * 12;
      }
      return acc;
    },
    { totalSubsmonthly: 0, totalSubsAnnually: 0, activeSubsMonthly: 0, activeSubsAnnually: 0 }
  );

  return {
    totalSubsmonthly: round(rawTotals.totalSubsmonthly),
    totalSubsAnnually: round(rawTotals.totalSubsAnnually),
    activeSubsMonthly: round(rawTotals.activeSubsMonthly),
    activeSubsAnnually: round(rawTotals.activeSubsAnnually),
  };
};

const convertToMonthly = (price: number, period: BillingPeriod): number => {
  switch (period) {
    case BillingPeriod.Monthly:
      return price;
    case BillingPeriod.BiMonthly:
      return price / 2;
    case BillingPeriod.Quarterly:
      return price / 3;
    case BillingPeriod.SemiAnnually:
      return price / 6;
    case BillingPeriod.Annually:
      return price / 12;
    case BillingPeriod.Biennially:
      return price / 24;
    default:
      throw new Error(`Unsupported billing period: ${period}`);
  }
};
