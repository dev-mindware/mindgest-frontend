import { PlanType } from "@/types";

export const planHierarchy: Record<PlanType, number> = {
  "Base": 1,
  "Tsunami": 2,
  "Smart Pro": 3
};

export function hasPlanAccess(userPlan: PlanType, requiredPlan: PlanType): boolean {
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}