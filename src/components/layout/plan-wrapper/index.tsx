"use client";

import React from "react";
import { Plan } from "@/types";
import { useAuth } from "@/hooks/auth";

type WrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  minPlan: Plan;
  planOverride?: string | Plan;
};

const order: Record<Plan, number> = {
  BASE: 1,
  TSUNAMI: 2,
  SMART_PRO: 3,
};

function normalizePlan(raw: unknown): Plan | null {
  if (typeof raw !== "string") return null;
  const x = raw.toUpperCase().replace(/[-\s]/g, "_");
  if (x.includes("SMART")) return "SMART_PRO";
  if (x.includes("TSUNAMI")) return "TSUNAMI";
  if (x.includes("BASE")) return "BASE";
  return null;
}

function useUserPlan(): Plan {
  const { user } = useAuth();
  const [plan, setPlan] = React.useState<Plan>("BASE");
  
  React.useEffect(() => {
    const raw = user?.company.plan! 
    const norm = normalizePlan(raw);
    if (norm) setPlan(norm);
  }, []);
  return plan;
}

function hasPlan(userPlan: Plan, required: Plan) {
  return order[userPlan] >= order[required];
}

export function PlanWrapper({ children, minPlan, planOverride, ...rest }: WrapperProps) {
  const detected = useUserPlan();
  const effective = normalizePlan(planOverride ?? detected) ?? "BASE";
  if (!hasPlan(effective, minPlan)) return null;
  return <div {...rest}>{children}</div>;
}

export function BaseOnly(props: Omit<WrapperProps, "minPlan">) {
  return <PlanWrapper minPlan="BASE" {...props} />;
}
export function TsunamiOnly(props: Omit<WrapperProps, "minPlan">) {
  return <PlanWrapper minPlan="TSUNAMI" {...props} />;
}
export function SmartProOnly(props: Omit<WrapperProps, "minPlan">) {
  return <PlanWrapper minPlan="SMART_PRO" {...props} />;
}
