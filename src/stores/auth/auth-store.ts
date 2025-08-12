import { User } from "@/types";
import { create } from "zustand";
import { authService } from "@/services/auth/auth";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  logout: async () => {
    await authService.logout();
    set({ accessToken: null, user: null });
  },
}));
