"use client";
import { useFetchUser } from "@/hooks/common";
import { Loader } from "./loader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
 const { isLoading } =  useFetchUser();

  if (isLoading) return <Loader />;

  return <>{children}</>;
}
