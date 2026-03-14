"use client";
import { useEffect } from "react";
import { Role, PlanType, PLAN_HIERARCHY } from "@/types";
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

  if (isAuthenticating || !user) {
    return (
      fallback || (
        <Loader />
      )
    );
  }

  if (!allowed.includes(user.role)) {
    return null;
  }


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