"use client";

import { useEffect, useMemo } from "react";
import { Role, PlanType, PLAN_HIERARCHY } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { menuItems, MenuItem } from "@/constants/menu-items";
import { Loader } from "./loader";
import { getRouteByRole } from "@/utils/role-redirects";

const flattenMenu = (items: MenuItem[]): MenuItem[] =>
  items.reduce<MenuItem[]>((acc, item) => {
    acc.push(item);
    if (item.items) acc.push(...flattenMenu(item.items));
    return acc;
  }, []);

const allMenuItems = flattenMenu(menuItems.items);

type AccessResult =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "unauthorized" }
  | { status: "plan_insufficient"; redirectTo: string }
  | { status: "allowed" };

interface RouteProtectorProps {
  allowed: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RouteProtector({ allowed, children, fallback }: RouteProtectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticating } = useAuth();

  const matchingItem = useMemo(() =>
    allMenuItems
      .filter(
        (item) =>
          item.url !== "#" &&
          item.url !== "/" &&
          (pathname === item.url || pathname.startsWith(item.url + "/"))
      )
      .sort((a, b) => b.url.length - a.url.length)[0],
    [pathname]
  );

  const currentPlanLevel = useMemo(() => {
    const plan = (user?.company?.subscription?.plan.name as PlanType) || "Base";
    return PLAN_HIERARCHY[plan] || 0;
  }, [user]);

  // Toda a lógica de acesso centralizada num único lugar
  const access = useMemo((): AccessResult => {
    if (isAuthenticating) return { status: "loading" };
    if (!user)            return { status: "unauthenticated" };
    if (!allowed.includes(user.role)) return { status: "unauthorized" };

    // Cashiers bypass ao check de plano
    if (user.role !== "CASHIER" && matchingItem?.minPlan) {
      const required = PLAN_HIERARCHY[matchingItem.minPlan] || 0;

      if (currentPlanLevel < required) {
        const fallbackRoute = getRouteByRole(user.role);
        const redirectTo = pathname !== fallbackRoute ? fallbackRoute : "/unauthorized";
        return { status: "plan_insufficient", redirectTo };
      }
    }

    return { status: "allowed" };
  }, [isAuthenticating, user, allowed, matchingItem, currentPlanLevel, pathname]);

  useEffect(() => {
    switch (access.status) {
      case "unauthenticated":
        if (pathname !== "/auth/login") router.replace("/auth/login");
        break;
      case "unauthorized":
        if (pathname !== "/unauthorized") router.replace("/unauthorized");
        break;
      case "plan_insufficient":
        router.replace(access.redirectTo);
        break;
    }
  }, [access, pathname, router]);

  if (access.status !== "allowed") {
    return fallback || <Loader />;
  }

  return <>{children}</>;
}