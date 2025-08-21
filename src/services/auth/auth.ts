import { User } from "@/types";
import api from "../api";

export const authService = {

  getMe: async (): Promise<User | null> => {
    try {
      const response = await api.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuário atual:", error);
      return null;
    }
  },
};