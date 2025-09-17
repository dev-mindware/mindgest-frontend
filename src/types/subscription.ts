
export interface Subscription {
  id: string;
  status: string;
  trialEndsAt: null;
  periodStartsAt: string;
  periodEndsAt: string;
  canceledAt: string;
  createdAt?: string;
  updatedAt?: string;
  billingInterval: string;
  paymentProvider: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  plan: Plan;
}

export type PlanType = "Base" | "Tsunami" | "Smart Pro"

export interface Plan {
  id: string;
  name: PlanType;
  priceMonthly: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  maxUsers: number;
  maxStores: number;
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