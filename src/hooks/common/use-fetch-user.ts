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
    // Se desabilitado, marca como não carregando e retorna
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    // Se já tem usuário, marca como não carregando e retorna
    if (user !== null) {
      setIsLoading(false);
      return;
    }

    // Se já buscou antes, não buscar novamente mas marca como não carregando
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

        // Apenas logar erros que não sejam 401 (não autenticado é esperado)
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

    // Cleanup para evitar atualizações de estado em componente desmontado
    return () => {
      isMounted = false;
    };
  }, [enabled, setUser, user]);

  return { user, isLoading };
}