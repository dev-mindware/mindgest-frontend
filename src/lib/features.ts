import { Plan } from "@/types";

export const planHierarchy: Record<Plan, number> = {
  "BASE": 1,
  "TSUNAMI": 2,
  "SMART_PRO": 3
};

export function hasPlanAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}