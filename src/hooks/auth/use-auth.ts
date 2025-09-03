import { useAuthStore } from "@/stores/auth";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  return { user, setUser };
}
