"use client";

import { useFetchUser } from "@/hooks/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useFetchUser();

  return <>{children}</>;
}
