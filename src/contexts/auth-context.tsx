"use client";
// import { useFetchUser } from "@/hooks";
// import { useAuthStore } from "@/stores";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const setUser = useAuthStore((state) => state.setUser);
  // const { fetchCurrentUser, hasAccessToken } = useFetchUser();

  useEffect(() => {
    const loadUser = async () => {
      // if (!hasAccessToken()) return; 

      // const user = await fetchCurrentUser();
      // if (user) setUser(user);
    };

    loadUser();
  }, []);

  return <>{children}</>;
}
