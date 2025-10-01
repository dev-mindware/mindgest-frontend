"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";

export function useFetchUser() {
  const { setUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const fetchUser = async () => {
      try {
        const response = await api.get<User>("/auth/profile");

        if (response.data) {
          const userData = response.data;
          setUser(userData);
          setIsLoading(false);
        } else if (response.status === 401) {
          // Usuário não autenticado - isso é normal
          setUser(null);
          setIsLoading(false);
        } else {
          // Outros erros
          console.error("Erro ao buscar usuário:", response.statusText);
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro na requisição do usuário:", error);
        setUser(null);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setUser, user]);

  return { user, isLoading };
}

/* "use client";
import { User } from "@/types";
import { api } from "@/services/api";
import { useAuthStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";

const fetchUserProfile = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw new Error("Failed to fetch user profile.");
  }
};

export function useFetchUser() {
  const { setUser } = useAuthStore();
  const {
    data,
    isLoading,
    isFetchedAfterMount,
    status: QueryStatus,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    initialData: null,
    retry: false,
  });

  if (QueryStatus === "success") {
    setUser(data);
  } else {
    setUser(null);
  }

  return { isLoading, isInitialized: isFetchedAfterMount, user: data };
} */
