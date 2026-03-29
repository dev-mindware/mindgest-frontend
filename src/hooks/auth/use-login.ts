"use client"
import { useAuthStore } from "@/stores";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginAction } from "@/actions/login";
import { ErrorMessage } from "@/utils/messages";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient(); // ← instância correcta do provider
  const { setUser, setIsAuthenticating } = useAuthStore();

  async function handleLogin({ email, password }: { email: string; password: string }) {
    try {
      const res = await loginAction({ email, password });

      if (!res.user) {
        ErrorMessage(res.message || "Erro ao tentar fazer login.");
        return;
      }

      setIsAuthenticating(true);
      queryClient.clear(); // ← instância correcta
      setUser(res.user);
      router.replace(res.redirectPath || "/");
    } catch (error) {
      setIsAuthenticating(false);
      ErrorMessage("Ocorreu um erro inesperado. Tente novamente.");
    }
  }

  return { handleLogin };
}