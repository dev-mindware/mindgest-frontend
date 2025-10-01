import { create } from "zustand";
import { User } from "@/types";
import { logoutAction } from "@/app/actions/login";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: async () => {
    await logoutAction();
    set({ user: null });
  },
}));
