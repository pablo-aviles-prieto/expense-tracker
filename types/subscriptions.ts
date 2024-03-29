import { type IUser } from "@/models";

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
  billingPeriod: BillingPeriod;
  autoRenew: boolean;
  status: SubscriptionStatus;
  notes?: string;
}

export interface EnhancedSubscription extends Subscription {
  _id: string;
}

export interface UserSubscriptionResponse {
  ok: boolean;
  error?: string;
  updatedUser?: IUser;
}

export interface UserSubscriptionUpdateResponse {
  ok: boolean;
  error?: string;
  result?: {
    acknowledged: true;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: string | null;
  };
}

export interface UserSubscriptionDeleteResponse {
  ok: boolean;
  error?: string;
  result?: {
    acknowledged: true;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: string | null;
  };
}
