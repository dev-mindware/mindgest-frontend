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
  id: z.string().trim().optional(),
  name: z.enum(["Base", "Pro", "Smart"]),
  priceMonthly: z.string().trim(),
  isPublic: z.boolean(),
  createdAt: z.string().trim(),
  updatedAt: z.string().trim(),
  maxUsers: z.number(),
  maxStores: z.number(),
  billingIntervals: z.any(),
  features: FeaturesSchema,
});

export const subscriptionSchema = z.object({
  status: z.string().trim(),
  companyId: z.string().trim(),
  planId: z.string().trim(),

  billingPeriodInMonths: z.number().min(1, "Informe pelo menos 1 mês"),
  periodStartsAt: z.string().trim().datetime().optional(),
  periodEndsAt: z.string().trim().datetime().optional(),
  canceledAt: z.string().trim().datetime().nullable().optional(),

  paymentProvider: z.string().trim().optional(),
  providerClientId: z.string().trim().optional(),
  providerSubscriptionId: z.string().trim().optional(),

  plan: PlanSchema,
  name: z.string().trim(),
  email: z.string().trim().email(),
  company: z.string().trim(),
  phone: z.string().trim(),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
