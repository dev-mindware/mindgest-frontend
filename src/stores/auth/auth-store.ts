import { create } from 'zustand'
import { User } from '@/types'
import { logoutAction } from '@/app/actions/login'

interface AuthState {
  user: User | null
  isLoading: boolean // NOVO: estado de carregamento
  isInitialized: boolean // NOVO: indica se a verificação inicial foi feita
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void // NOVO: controlar loading
  setInitialized: (initialized: boolean) => void // NOVO: controlar inicialização
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  
  logout: async () => {
    await logoutAction();
    set({ user: null, isInitialized: true }); // Mantém inicializado após logout
  },
}))