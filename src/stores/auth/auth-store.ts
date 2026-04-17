import { create } from "zustand";
import { User } from "@/types";
import { logoutAction } from "@/actions/login";
import { queryClient } from "@/lib";

interface AuthState {
  user: User | null;
  isAuthenticating: boolean;
  isLoggingOut: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticating: true,
  isLoggingOut: false,

  setUser: (user) => set({ user }),
  setIsAuthenticating: (isAuthenticating) => set({ isAuthenticating }),

  // ✅ Limpa estado, React Query e redireciona
  logout: async () => {
    set({ isLoggingOut: true, isAuthenticating: true, user: null }); // bloqueia tudo antes
    await logoutAction();
    queryClient.clear(); // Limpa toda a cache antiga (incluindo o ["user"])
    set({ isLoggingOut: false }); 
    window.location.replace("/auth/login"); // Hard redirect para limpar a memória do browser
  },
}));
