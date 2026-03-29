"use client"
import { useAuthStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  async function handleLogout() {
    // 1. Executa o logout no Zustand e na API PRIMEIRO.
    // Aguardamos que o cookie de sessão seja destruído no servidor.
    await logout();

    // 2. Só DEPOIS removemos os queries.
    // Se fizéssemos isto antes, o React Query iria refazer os fetches pendentes
    // enquanto a sessão ainda era válida, recolocando o "user" em cache!
    queryClient.removeQueries();
    queryClient.clear();

    // 3. Apagar os dados locais
    localStorage.removeItem("current-store");
    localStorage.removeItem("MGEST-AUTH-STORE");

    // 4. Navegar via Next.js router para um redirecionamento suave sem "hard reload"
    router.replace("/auth/login");
  }

  return { handleLogout };
}