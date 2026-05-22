"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UseFetchUserOptions {
  enabled?: boolean;
}

export function useFetchUser({ enabled }: UseFetchUserOptions) {
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
    staleTime: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    if (isLoading) {
      setIsAuthenticating(true);
      return;
    }

    if (isSuccess && data) {
      setUser(data);
      setIsAuthenticating(false);
    } else if (isError) {
      const err = error as any;
      if (err.response?.status !== 401) {
        console.error("Erro ao buscar usuário:", err);
      }
      setUser(null);
      setIsAuthenticating(false);
    }
  }, [enabled, isLoading, isSuccess, isError, data, error, setUser, setIsAuthenticating]);

  return { user: data || null };
}