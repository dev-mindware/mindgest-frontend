"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UseFetchUserOptions {
  enabled?: boolean;
}

export function useFetchUser({ enabled = true }: UseFetchUserOptions = {}) {
  const { setUser, setIsAuthenticating } = useAuthStore();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<User>("/auth/profile");
      return response.data;
    },
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!enabled) {
      setIsAuthenticating(false);
      return;
    }

    // Only set authenticating true if it's the initial loading (no cached data).
    // This prevents the full-screen loader from flashing during background invalidation refetches.
    if (isLoading) {
      setIsAuthenticating(true);
    } else {
      setIsAuthenticating(false);
    }

    if (isSuccess && data) {
      setUser(data);
    } else if (isError) {
      const err = error as any;
      if (err.response?.status !== 401) {
        console.error("Erro ao buscar usuário:", err);
      }
      setUser(null);
    }
  }, [
    enabled,
    isLoading,
    isSuccess,
    isError,
    data,
    error,
    setUser,
    setIsAuthenticating,
  ]);

  return { user: data || null };
}
