"use client"
import { useAuthStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleLogout() {
    console.log('1. Iniciando logout');
    await logout();

    console.log('2. Após logout - token no store:', useAuthStore.getState().user);

    await queryClient.cancelQueries({ queryKey: ['user'] });
    console.log('3. Queries canceladas');

    queryClient.setQueryData(['user'], null);
    console.log('4. QueryData setado como null');
    console.log('5. Estado atual da query:', queryClient.getQueryData(['user']));

    localStorage.removeItem("current-store");
    localStorage.removeItem("MGEST-AUTH-STORE");

    router.replace("/auth/login");
    console.log('6. Navegou para login');
  }

  return { handleLogout };
}