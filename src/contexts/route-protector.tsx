"use client";
import { useEffect } from "react";
import { Role } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores";

interface RouteProtectorProps {
  allowed: Role[];
  children: React.ReactNode;
}

export function RouteProtector({ allowed, children }: RouteProtectorProps) {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }
    
    if (!allowed.includes(user.role)) {
      router.replace("/unauthorized");
      return;
    }
  }, [user, allowed, router, isInitialized]);

  // Mostra loading se ainda não foi inicializado
  if (!isInitialized) return <p></p>;

  // Se não há usuário, não renderiza nada (redirecionamento já foi acionado)
  if (!user) return null;

  // Se há usuário mas não tem permissão, não renderiza nada
  if (!allowed.includes(user.role)) return null;

  // Tudo OK, renderiza o conteúdo
  return <>{children}</>;
}
