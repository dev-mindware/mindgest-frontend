export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  trialEndsAt: string;
  periodStartsAt: string;
  periodEndsAt: string;
  canceledAt: string;
  createdAt?: string;
  updatedAt?: string;
  billingInterval: string;
  paymentProvider: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  billingPeriodInMonths: string | null;
  plan: Plan;
}

export type PlanType = "Base" | "Tsunami" | "Smart Pro";

enum SubscriptionStatus {
  TRIALING = "TRIALING",
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
}

export interface Plan {
  id: string;
  name: PlanType;
  priceMonthly: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  maxUsers: number;
  maxStores: number;
  trialPeriodInDays: number | null;
  billingIntervals: any[];
  features: Features;
}

export interface Features {
  hasPOS: boolean;
  hasGestAI: boolean;
  canExportSaft: boolean;
  hasStockManagement: boolean;
  hasAdvancedReporting: boolean;
  hasSupplierManagement: boolean;
  hasSimplifiedReporting: boolean;
}