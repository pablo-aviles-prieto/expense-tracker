export enum BillingPeriod {
  Monthly = "MONTHLY",
  BiMonthly = "BI-MONTHLY",
  Quarterly = "QUARTERLY",
  SemiAnnually = "SEMI-ANNUALLY",
  Annually = "ANNUALLY",
  Biennially = "BIENNIALLY",
}

export enum SubscriptionStatus {
  Active = "ACTIVE",
  Paused = "PAUSED",
  Cancelled = "CANCELLED",
}

export interface Subscription {
  name: string;
  price: number;
  startDate: string; // Date in format yyyy-MM-dd
  nextBillingDate: string; // Date in format yyyy-MM-dd
  billingPeriod: BillingPeriod;
  autoRenew: boolean;
  status: SubscriptionStatus;
  notes?: string;
}
