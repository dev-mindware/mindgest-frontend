"use client";
import { useFetchUser } from "@/hooks/auth";
import { useAuthStore } from "@/stores/auth";
import { useEffect, useState } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const { refetchUser, hasAccessToken } = useFetchUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = hasAccessToken();
        console.log("Tem token no cookie?", token);

        if (!token) return;

        const { data: user } = await refetchUser();
        console.log("Usuário carregado:", user);
        if (user) setUser(user);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [refetchUser, hasAccessToken, setUser]);

  if (loading) {
    return <div>Carregando dados do Usuário...</div>; 
  }

  return <>{children}</>;
}
