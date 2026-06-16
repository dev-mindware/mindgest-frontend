import type { Plan, PlanType } from "@/types";

export const PRO_PLAN_NEGOTIATION_EMAIL = "geral@mindware.ao";

export function isCustomPricedPlan(plan?: Pick<Plan, "name"> | null): boolean {
  return plan?.name === "Pro";
}

export function getPlanDisplayPrice(plan?: Pick<Plan, "name" | "priceMonthly"> | null): string {
  if (!plan) return "";

  return isCustomPricedPlan(plan) ? "Personalizável" : plan.priceMonthly;
}

export function isCustomPricedPlanType(planType?: PlanType | null): boolean {
  return planType === "Pro";
}
