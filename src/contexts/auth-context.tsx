  "use client";
  import { useFetchUser } from "@/hooks/common";
  import { Loader } from "./loader";
  import { usePathname } from "next/navigation";

  interface AuthProviderProps {
    children: React.ReactNode;
  }

  const AUTH_PATHS = ["/auth", "/login", "/register"];

  export function AuthProvider({ children }: AuthProviderProps) {
    const pathname = usePathname();
    const isAuthRoute = AUTH_PATHS.some((path) => pathname.startsWith(path));
    const { isLoading } = useFetchUser({ enabled: !isAuthRoute });

    // Não valida auth em rotas de autenticação
    if (isAuthRoute) {
      return <>{children}</>;
    }

    // Mostra loader enquanto carrega
    if (isLoading) {
      return <Loader />;
    }

    return <>{children}</>;
  }