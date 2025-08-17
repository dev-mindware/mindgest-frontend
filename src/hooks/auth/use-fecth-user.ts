"use client";

import { useQuery } from "@tanstack/react-query";
import { TOKEN_COOKIE_KEY } from "@/constants";
import { getCookie } from "cookies-next";
import { useAuthStore } from "@/stores/auth";
import { authService } from "@/services";
import { User } from "@/types";

export function useFetchUser() {
  const { setUser } = useAuthStore();

  const hasAccessToken = () =>
    getCookie(TOKEN_COOKIE_KEY) as string | undefined;

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const user = await authService.getMe();
      setUser(user as User); 
      return user;
    },
    enabled: !!hasAccessToken(), 
    retry: false,
    staleTime: 1000 * 60 * 5, 
  });

  return query;
}