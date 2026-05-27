"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores";
import { SubscriptionGuard } from "@/components/guards/subscription-guard";
import { AUTH_PAGES } from "@/constants/routes";
import { useFetchUser } from "@/hooks";
import { Loader } from "./loader";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_PAGES.some((path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  });
  const { isAuthenticating } = useAuthStore();

  // Só busca user em rotas privadas
  useFetchUser({ enabled: !isAuthRoute });

  if (isAuthRoute) return <>{children}</>;
  if (isAuthenticating) return <Loader />;

  return <SubscriptionGuard>{children}</SubscriptionGuard>;
}

/* "use client";
import { useFetchUser } from "@/hooks/common";
import { useAuthStore } from "@/stores";
import { Loader } from "./loader";
import { usePathname } from "next/navigation";
import { SubscriptionGuard } from "@/components/guards/subscription-guard";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_PATHS = ["/auth", "/auth/login", "/auth/register"];

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
  const { isAuthenticating } = useAuthStore();
  useFetchUser({ enabled: !isAuthRoute  });

  if (isAuthRoute) return <>{children}</>;

  if (isAuthenticating) return <Loader />;

  return (
    <SubscriptionGuard>
      {children}
    </SubscriptionGuard>
  );
} */