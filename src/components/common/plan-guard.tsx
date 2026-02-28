"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/auth-store";
import { menuItems, MenuItem } from "@/constants/menu-items";
import { PLAN_HIERARCHY, PlanType } from "@/types";

// Helper to flatten menu items
const flattenMenu = (items: MenuItem[]): MenuItem[] => {
    return items.reduce((acc: MenuItem[], item) => {
        acc.push(item);
        if (item.items) {
            // @ts-ignore
            acc.push(...flattenMenu(item.items));
        }
        return acc;
    }, []);
};

export function PlanGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isAuthLoading } = useAuthStore();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (isAuthLoading) return;

        if (!user) {
            setIsChecking(false);
            return;
        }

        const currentPlan = (user?.company?.subscription?.plan.name as PlanType) || "Base";
        const currentPlanLevel = PLAN_HIERARCHY[currentPlan] || 0;

        const allItems = flattenMenu(menuItems.items);

        // Find matching route by finding the longest matching url prefix
        const matchingItem = allItems
            .filter((item) => item.url !== "#" && item.url !== "/" && pathname.startsWith(item.url))
            .sort((a, b) => b.url.length - a.url.length)[0];

        if (matchingItem && matchingItem.minPlan) {
            const requiredPlanLevel = PLAN_HIERARCHY[matchingItem.minPlan] || 0;

            if (currentPlanLevel < requiredPlanLevel) {
                // User doesn't have access, redirect safely to dashboard or fallback
                router.replace("/dashboard");
                return; // Early return to avoid setting isChecking to false immediately
            }
        }

        setIsChecking(false);
    }, [pathname, user, isAuthLoading, router]);

    if (isChecking || isAuthLoading) {
        return <div className="h-full w-full opacity-0 pointer-events-none" />;
    }

    return <>{children}</>;
}
