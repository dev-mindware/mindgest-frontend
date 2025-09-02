export type Plan = "BASE" | "TSUNAMI" | "SMART_PRO";

const planOrder: Record<Plan, number> = {
  BASE: 1,
  TSUNAMI: 2,
  SMART_PRO: 3,
};

export function normalizePlan(plan: string | undefined | null): Plan | null {
  if (!plan) return null;

  const normalized = plan.toUpperCase().replace("-", "_");

  if (normalized.includes("SMART")) return "SMART_PRO";
  if (normalized.includes("TSUNAMI")) return "TSUNAMI";
  if (normalized.includes("BASE")) return "BASE";

  return null;
}

export function PlanAccess(userPlan: string | null | undefined, requiredPlan: Plan): boolean {
  const normalized = normalizePlan(userPlan);
  if (!normalized) return false;
  return planOrder[normalized] >= planOrder[requiredPlan];
}
