
import { User } from '@/types'
import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  user: any
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user:  {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => set({ user }),
  logout: async () => {
    /* await logoutAction(); */
    set({ accessToken: null, user: null });
  },
}))
