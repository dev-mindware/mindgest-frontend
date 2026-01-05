"use client";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";

interface UseFetchUserOptions {
  enabled?: boolean;
}

export function useFetchUser({ enabled = true }: UseFetchUserOptions = {}) {
  const { setUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    if (user !== null) {
      setIsLoading(false);
      return;
    }

    if (hasFetched.current) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    hasFetched.current = true;

    const fetchUser = async () => {
      try {
        const response = await api.get<User>("/auth/profile");

        if (!isMounted) return;

        setUser(response.data);
      } catch (error: any) {
        if (!isMounted) return;

        if (error.response?.status !== 401) {
          console.error("Erro ao buscar usuário:", error);
        }
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return { user, isLoading };
}