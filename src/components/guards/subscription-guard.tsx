"use client";

import { useAuthStore } from "@/stores";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubscriptionStatus } from "@/types";

const EXCLUDED_PATHS = ["/auth", "/login", "/register", "/paywall", "/billing"];

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticating } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Wait until auth verification is complete
    if (isAuthenticating) return;

    // If there is no user, let AuthProvider handle redirection
    if (!user) {
      setIsVerified(true);
      return;
    }

    // Bypass check for excluded routes like auth and the paywall itself
    const isExcluded = EXCLUDED_PATHS.some((path) => pathname.startsWith(path));
    if (isExcluded) {
      setIsVerified(true);
      return;
    }

    const subStatus = user.company?.subscription?.status;

    // Based on the Netflix/Spotify model, only these statuses grant access.
    // Modify based on your exact business logic.
    const hasActiveSubscription =
      subStatus === SubscriptionStatus.ACTIVE ||
      subStatus === SubscriptionStatus.TRIALING;

    if (!hasActiveSubscription) {
      router.replace("/paywall");
    } else {
      setIsVerified(true);
    }
  }, [user, isAuthenticating, pathname, router]);

  // Prevent flashing internal ERP components before we verify the subscription state
  if (!isVerified && user) {
    // Note: Can return a centered spinner or <Loader /> here if desired.
    return null; 
  }

  return <>{children}</>;
}
