"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/auth";
import { useGetStores, useSwitchStore } from "@/hooks/entities";
import { currentStoreStore } from "@/stores/store/current-store-store";
import { Role } from "@/types";

interface StoreProviderProps {
    children: ReactNode;
}

import { usePathname } from "next/navigation";

export function StoreProvider({ children }: StoreProviderProps) {
    const { user } = useAuth();
    const pathname = usePathname();
    const currentStore = currentStoreStore((state) => state.currentStore);

    const isAuthPage = pathname?.includes("/auth/");
    const { storesData } = useGetStores(user?.role as Role, !isAuthPage && !!user);
    const { mutate: switchStore } = useSwitchStore();

    useEffect(() => {
        if (isAuthPage || !user) return;

        // If we have stores and none is selected, select the first one
        if (!currentStore && storesData && storesData.length > 0) {
            switchStore(storesData[0]);
        }

        // If the user has only one store (like a cashier), ensure it's selected
        if (storesData && storesData.length === 1 && currentStore?.id !== storesData[0].id) {
            switchStore(storesData[0]);
        }
    }, [storesData, currentStore, switchStore, user, isAuthPage]);

    return <>{children}</>;
}
