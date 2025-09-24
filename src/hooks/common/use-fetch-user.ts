"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { api } from "@/services/api";
import { User } from "@/types";

export function useFetchUser() {
 const { setUser, setLoading, setInitialized, isLoading, isInitialized } =
   useAuthStore();

 useEffect(() => {
   if (isInitialized || isLoading) return;

   const fetchUser = async () => {
     try {
       setLoading(true);

       const response = await api.get<User>("/auth/profile");

       if (response.data) {
         const userData = response.data;
         setUser(userData);
       } else if (response.status === 401) {
         // Usuário não autenticado - isso é normal
         setUser(null);
       } else {
         // Outros erros
         console.error("Erro ao buscar usuário:", response.statusText);
         setUser(null);
       }
     } catch (error) {
       console.error("Erro na requisição do usuário:", error);
       setUser(null);
     } finally {
       setLoading(false);
       setInitialized(true); // CRUCIAL: marca como inicializado independente do resultado
     }
   };

   fetchUser();
 }, [setUser, setLoading, setInitialized, isInitialized, isLoading]);

 return { isLoading, isInitialized };
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

