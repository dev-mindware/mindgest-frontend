"use client";
import { useFetchUser } from "@/hooks/common";
import { Loader } from "./loader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isInitialized } = useFetchUser();

  if (!isInitialized && isLoading) return <Loader />;

  return <>{children}</>;
}
