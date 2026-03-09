"use client";
import { useEffect } from "react";
import { SubscriptionStatus, Role, PlanType, PLAN_HIERARCHY } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { menuItems, MenuItem } from "@/constants/menu-items";
import { Loader } from "./loader";

// Helper to flatten menu items to find urls easily
const flattenMenu = (items: MenuItem[]): MenuItem[] => {
  return items.reduce((acc: MenuItem[], item) => {
    acc.push(item);
    if (item.items) {
      acc.push(...flattenMenu(item.items));
    }
    return acc;
  }, []);
};

interface RouteProtectorProps {
  allowed: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RouteProtector({
  allowed,
  children,
  fallback,
}: RouteProtectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticating, subscriptionStatus } = useAuth();

  useEffect(() => {
    // Só redireciona após autenticação completa
    if (isAuthenticating) return;

    if (!user) {
      if (pathname !== "/auth/login") {
        router.replace("/auth/login");
      }
      return;
    }

    if (!allowed.includes(user.role)) {
      if (pathname !== "/unauthorized") {
        router.replace("/unauthorized");
      }
      return;
    }

    if (
      subscriptionStatus === SubscriptionStatus.PENDING &&
      !pathname.startsWith("/settings") &&
      !pathname.startsWith("/plans")
    ) {
      const target = "/settings?tab=subscription";
      if (pathname + (window.location.search || "") !== target) {
        router.replace(target);
      }
      return;
    }

    // Plan-based route protection
    const currentPlan = (user?.company?.subscription?.plan.name as PlanType) || "Base";
    const currentPlanLevel = PLAN_HIERARCHY[currentPlan] || 0;

    const allItems = flattenMenu(menuItems.items);

    const matchingItem = allItems
      .filter((item) => item.url !== "#" && item.url !== "/" && pathname.startsWith(item.url))
      .sort((a, b) => b.url.length - a.url.length)[0];

    if (matchingItem && matchingItem.minPlan) {
      const requiredPlanLevel = PLAN_HIERARCHY[matchingItem.minPlan] || 0;

      if (currentPlanLevel < requiredPlanLevel) {
        if (pathname !== "/dashboard") {
          window.location.href = "/dashboard";
        }
        return;
      }
    }

  }, [user, allowed, router, isAuthenticating, pathname, subscriptionStatus]);

  // Enquanto está verificando autenticação/autorização
  if (isAuthenticating || !user) {
    return (
      fallback || (
        <Loader />
      )
    );
  }

  // Se usuário não tem permissão, retorna null (redirecionamento já foi feito)
  if (!allowed.includes(user.role)) {
    return null;
  }

  if (
    subscriptionStatus === SubscriptionStatus.PENDING &&
    !pathname.startsWith("/settings") &&
    !pathname.startsWith("/plans")
  ) {
    return null;
  }

  // Double check rendering guard for plan
  const currentPlan = (user?.company?.subscription?.plan.name as PlanType) || "Base";
  const currentPlanLevel = PLAN_HIERARCHY[currentPlan] || 0;

  const allItems = flattenMenu(menuItems.items);
  const matchingItem = allItems
    .filter((item) => item.url !== "#" && item.url !== "/" && pathname.startsWith(item.url))
    .sort((a, b) => b.url.length - a.url.length)[0];

  if (matchingItem && matchingItem.minPlan) {
    const requiredPlanLevel = PLAN_HIERARCHY[matchingItem.minPlan] || 0;
    if (currentPlanLevel < requiredPlanLevel) {
      return null;
    }
  }

  return <>{children}</>;
}
