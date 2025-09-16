import { z } from "zod";

export const FeaturesSchema = z.object({
  hasPOS: z.boolean(),
  hasGestAI: z.boolean(),
  canExportSaft: z.boolean(),
  hasStockManagement: z.boolean(),
  hasAdvancedReporting: z.boolean(),
  hasSupplierManagement: z.boolean(),
  hasSimplifiedReporting: z.boolean(),
});

const PlanSchema = z.object({
  id: z.string().optional(),
  name: z.enum(["Base", "Tsunami", "Smart Pro"]),
  priceMonthly: z.string(),
  isPublic: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  maxUsers: z.number(),
  maxStores: z.number(),
  billingIntervals: z.any(),
  features: FeaturesSchema,
});

export const subscriptionSchema = z.object({
  status: z.string(),
  companyId: z.string(),
  planId: z.string(),

  months: z.number().min(1, "Informe pelo menos 1 mês"),
  periodStartsAt: z.string().datetime().optional(),
  periodEndsAt: z.string().datetime().optional(),
  canceledAt: z.string().datetime().nullable().optional(),

  paymentProvider: z.string().optional(),
  providerCustomerId: z.string().optional(),
  providerSubscriptionId: z.string().optional(),

  plan: PlanSchema,
  name: z.string(),
  email: z.string().email(),
  company: z.string(),
  phone: z.string(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
