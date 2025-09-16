"use client";
import { Role } from "@/types";
import { getUserRole } from "@/utils";
import { useAuthStore } from "@/stores/auth";

export function useCurrentRole() {
  const { user } = useAuthStore();
  const isAdmin = getUserRole(user?.role as Role) == "admin";

  return {
    currentRole: getUserRole(user?.role as Role),
    isAdmin,
  };
}
