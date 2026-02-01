"use client";

import { useRouter, usePathname } from "next/navigation";
import { menuItems, MenuItem } from "@/constants/menu-items";
import { PlanType } from "@/types/subscription";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { useFetchUser } from "@/hooks/common";
import { Loader } from "./loader";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_PATHS = ["/auth", "/login", "/register"];

const PLAN_HIERARCHY: Record<PlanType, number> = {
  Base: 0,
  Pro: 1,
  Smart: 2,
};

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const { isAuthenticating, user } = useAuthStore();
  useFetchUser({ enabled: !isAuthRoute });

  const [isCheckingPlan, setIsCheckingPlan] = useState(true);

  useEffect(() => {
    if (isAuthenticating || isAuthRoute) {
      setIsCheckingPlan(false);
      return;
    }

    // Helper to traverse menu items and find the matching rule
    const findMatchingItem = (
      items: MenuItem[],
      parentMinPlan?: PlanType
    ): { item: MenuItem; applicableMinPlan?: PlanType } | undefined => {
      for (const item of items) {
        let effectiveMinPlan = parentMinPlan;

        if (item.minPlan) {
          if (!effectiveMinPlan) {
            effectiveMinPlan = item.minPlan;
          } else {
            const parentLevel = PLAN_HIERARCHY[effectiveMinPlan];
            const itemLevel = PLAN_HIERARCHY[item.minPlan];
            if (itemLevel > parentLevel) {
              effectiveMinPlan = item.minPlan;
            }
          }
        }

        if (item.url === pathname) {
          return { item, applicableMinPlan: effectiveMinPlan };
        }

        if (item.items) {
          const subMatch = findMatchingItem(item.items, effectiveMinPlan);
          if (subMatch) return subMatch;
        }
      }
      return undefined;
    };

    const currentPlan = (user?.company?.subscription?.plan.name as PlanType) || "Base";
    const match = findMatchingItem(menuItems.items);

    if (match?.applicableMinPlan) {
      const currentLevel = PLAN_HIERARCHY[currentPlan] || 0;
      const requiredLevel = PLAN_HIERARCHY[match.applicableMinPlan] || 0;

      if (currentLevel < requiredLevel) {
        router.replace("/dashboard");
        return; // Keep checking true effectively
      }
    }

    setIsCheckingPlan(false);

  }, [pathname, isAuthenticating, isAuthRoute, router, user]);


  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (isAuthenticating || isCheckingPlan) {
    return <Loader />;
  }

  return <>{children}</>;
}
