"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from "@/constants";
import { LoginResponse, User } from "@/types";
import { loginSchema } from "@/schemas";
import api from "../api";

export const authService = {
  async login({ email, password }: z.infer<typeof loginSchema>) {
    try {
      const res = await api.post<LoginResponse>("/login", { email, password });
      const {
        user,
        tokens: { accessToken, refreshToken },
      } = res.data;

      if (!user) throw new Error("Usuário não autorizado");

      const authCookies = await cookies();

      authCookies.set(TOKEN_COOKIE_KEY, accessToken, {
        path: "/",
        secure: true,
        maxAge: 8 * 60 * 60,
      });

      authCookies.set(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
        path: "/",
        secure: true,
        maxAge: 30 * 86400,
      });

      const redirectPath = "/dashboard";

      return {
        user,
        accessToken,
        refreshToken,
        redirectPath,
        messageError: undefined,
      };
    } catch (error: any) {
      let messageError = "";
      if (error?.response) {
        messageError = error?.response?.data?.message;
      } else {
        messageError = "Ocorreu um erro desconhecido!";
      }

      return { user: null, accessToken: null, redirectPath: "/", messageError };
    }
  },

  async refresh(): Promise<{ accessToken: string }> {
    const authCookies = await cookies();
    const refreshToken = authCookies.get(REFRESH_TOKEN_COOKIE_KEY)?.value;

    if (!refreshToken) {
      throw new Error("Refresh token não encontrado.");
    }

    const res = await api.post<{ accessToken: string }>("/refresh", {
      refreshToken,
    });

    return res.data;
  },

  async logout() {
    try {
      const authCookies = await cookies();
      authCookies.delete(TOKEN_COOKIE_KEY);
      authCookies.delete(REFRESH_TOKEN_COOKIE_KEY);
      console.log("Logout bem-sucedido! Redirecionando para /");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      redirect("/");
    }
  },
};