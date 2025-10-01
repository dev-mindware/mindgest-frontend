"use client";
import { useEffect, useState } from "react";
import { Role } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth";

interface RouteProtectorProps {
  allowed: Role[];
  children: React.ReactNode;
  // Componente opcional para exibir enquanto verifica autenticação
  fallback?: React.ReactNode;
}

export function RouteProtector({
  allowed,
  children,
  fallback,
}: RouteProtectorProps) {
  const router = useRouter();
  const { user } = useAuth(); // Assumindo que o store tem um estado de loading
  const [isChecking, setIsChecking] = useState(true);

  console.log("dentro do route protector");
  console.log("user", user);

  useEffect(() => {
    // Se ainda está carregando dados de autenticação, aguarda
    if (!user) {
      console.log("user nao encontrado");
      return;
    }

    // Pequeno delay para evitar flashes desnecessários na UI
    const timeoutId = setTimeout(() => {
      setIsChecking(false);

      // Se não há usuário autenticado, redireciona para login
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      // Se o usuário não tem permissão, redireciona para página não autorizada
      if (!allowed.includes(user.role)) {
        router.replace("/unauthorized");
        console.log("Usuário não tem permissão");
        return;
      }
    }, 100);

    // Cleanup do timeout se o componente for desmontado
    return () => clearTimeout(timeoutId);
  }, [user, allowed, router]);

  // Enquanto está verificando autenticação/autorização
  if (isChecking) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )
    );
  }

  // Se não há usuário após verificação, retorna null (redirecionamento já foi feito)
  if (!user) {
    return null;
  }

  // Se usuário não tem permissão, retorna null (redirecionamento já foi feito)
  if (!allowed.includes(user.role)) {
    console.log("USUARIO NÇAO AUTORIZADO PRA TAIL")
    return null;
  }

  // Tudo verificado com sucesso, renderiza os children
  return <>{children}</>;
}
