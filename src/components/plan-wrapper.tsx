// components/PlanWrapper.tsx
"use client";

import React from "react";
import { Plan } from "@/types";
import { PLAN_COOKIE_KEY } from "@/constants";

type WrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  minPlan: Plan;
  /** opcional: força um plano (útil em testes/SSR) */
  planOverride?: string | Plan;
};

// hierarquia simples
const order: Record<Plan, number> = {
  BASE: 1,
  TSUNAMI: 2,
  SMART_PRO: 3,
};

// normaliza qualquer variação para os três valores canónicos
function normalizePlan(raw: unknown): Plan | null {
  if (typeof raw !== "string") return null;
  const x = raw.toUpperCase().replace(/[-\s]/g, "_");
  if (x.includes("SMART")) return "SMART_PRO";
  if (x.includes("TSUNAMI")) return "TSUNAMI";
  if (x.includes("BASE")) return "BASE";
  return null;
}

// lê cookie no cliente
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

// obtém plano do utilizador; por default assume BASE até ler o cookie
function useUserPlan(): Plan {
  const [plan, setPlan] = React.useState<Plan>("BASE");
  React.useEffect(() => {
    const raw = readCookie(PLAN_COOKIE_KEY);
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

// Conveniências “como div”
export function BaseOnly(props: Omit<WrapperProps, "minPlan">) {
  return <PlanWrapper minPlan="BASE" {...props} />;
}
export function TsunamiOnly(props: Omit<WrapperProps, "minPlan">) {
  return <PlanWrapper minPlan="TSUNAMI" {...props} />;
}
export function SmartProOnly(props: Omit<WrapperProps, "minPlan">) {
  return <PlanWrapper minPlan="SMART_PRO" {...props} />;
}
