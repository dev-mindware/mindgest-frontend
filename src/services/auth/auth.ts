import { LoginResponse, User } from "@/types";
import { setCookie, deleteCookie } from "cookies-next"; 
import { PLAN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY, ROLE_COOKIE_KEY, TOKEN_COOKIE_KEY } from "@/constants";
import api from "../api";
import axios from "axios";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );

      const { accessToken, refreshToken, user, message } = response.data;

      setCookie(TOKEN_COOKIE_KEY, accessToken, { path: "/" });
      setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, { path: "/" });
      setCookie(PLAN_COOKIE_KEY, user.company.plan, { path: "/" });
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return { message, user, accessToken, refreshToken };
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response?.data?.message || "Erro ao fazer login");
      }
      throw new Error("Erro inesperado");
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      deleteCookie(TOKEN_COOKIE_KEY, { path: "/" });
      deleteCookie(REFRESH_TOKEN_COOKIE_KEY, { path: "/" });
      deleteCookie(ROLE_COOKIE_KEY, { path: "/" });
      deleteCookie(PLAN_COOKIE_KEY, { path: "/" });
      delete api.defaults.headers.common["Authorization"];
    }
  },

  // getMe: () => api.get<User>("/profile/me"),

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