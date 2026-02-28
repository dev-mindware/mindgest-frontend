"use client";
import { useEffect } from "react";
import { SubscriptionStatus, Role, PlanType, PLAN_HIERARCHY } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { menuItems, MenuItem } from "@/constants/menu-items";

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
      router.replace("/auth/login");
      return;
    }

    if (!allowed.includes(user.role)) {
      router.replace("/unauthorized");
      return;
    }

    if (
      subscriptionStatus === SubscriptionStatus.PENDING &&
      !pathname.startsWith("/settings") &&
      !pathname.startsWith("/plans")
    ) {
      router.replace("/settings?tab=subscription");
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
        window.location.href = "/dashboard";
        return;
      }
    }

  }, [user, allowed, router, isAuthenticating, pathname, subscriptionStatus]);

  // Enquanto está verificando autenticação/autorização
  if (isAuthenticating || !user) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 border-t-2 border-foreground rounded-full animate-spin w-12 h-12" />
            <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse" />
          </div>
          <p className="mt-4 text-sm text-foreground/50 tracking-widest uppercase font-medium">Autenticando</p>
        </div>
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
