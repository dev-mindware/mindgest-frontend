"use client";
import { useQuery } from "@tanstack/react-query";
import { TOKEN_COOKIE_KEY } from "@/constants";
import { authService } from "@/services/auth/auth";
import { useAuthStore } from "@/stores/auth";
import { getCookie } from "cookies-next";
import { User } from "@/types";

export function useFetchUser() {
  const { setUser } = useAuthStore();

  function hasAccessToken(): string | undefined {
    return getCookie(TOKEN_COOKIE_KEY) as string | undefined;
  }

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const user = await authService.getMe();
      const currentUser = user as User;
      setUser({ ...currentUser });
      return user;
    },
    enabled: !!hasAccessToken(), 
    retry: false,
   
    staleTime: 1000 * 60 * 5, 
  });

  return {
    ...query,
    refetchUser: query.refetch,
    hasAccessToken,
  };
}
