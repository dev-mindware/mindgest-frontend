import { create } from "zustand";
import { User } from "@/types";
import { logoutAction } from "@/actions/login";
import { currentStoreStore } from "@/stores/store/current-store-store";

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

  logout: async () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("current-store");
      } catch {
        // ignore storage errors
      }
    }

    // Limpa também o estado em memória da loja atual,
    // evitando que o persist grave novamente o valor antigo.
    try {
      currentStoreStore.getState().setCurrentStore(undefined);
    } catch {
      // ignore caso o store ainda não esteja inicializado no cliente
    }

    set({ isLoggingOut: true });
    await logoutAction();
    set({ user: null });
  },
}));
