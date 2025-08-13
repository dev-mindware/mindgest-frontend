"use server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  PLAN_COOKIE_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
  ROLE_COOKIE_KEY,
  TOKEN_COOKIE_KEY,
} from "@/constants";
import { roleRedirects } from "@/utils";
import { LoginResponse, Role, User } from "@/types";
import { loginSchema } from "@/schemas";
import api from "@/services/api";

export async function loginAction({
  email,
  password,
}: z.infer<typeof loginSchema>): Promise<{
  user: User | null;
  redirectPath?: string;
  message?: string;
  accessToken: string | null;
  refreshToken: string | null;
}> {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    const authCookies = await cookies();
    const { user, accessToken, refreshToken, message } = res.data;

    if (!user) throw new Error("Usuário não autorizado");

    authCookies.set(TOKEN_COOKIE_KEY, accessToken, {
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 8,
    });

    authCookies.set(REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 30 * 24,
    });

    authCookies.set(PLAN_COOKIE_KEY, user.company.plan, {
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    authCookies.set(ROLE_COOKIE_KEY, user.role, {
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    console.log(user);

    const redirectPath = getRedirectPath(user.role);
    console.log(`Login bem-sucedido! Redirecionando para: ${redirectPath}`);

    return { message, user, accessToken, redirectPath, refreshToken };
  } catch (error: any) {
    let messageError = "";
    if (error?.response) {
      messageError = error?.response?.data?.message;
    } else {
      messageError = "Ocorreu um erro desconhecido!";
    }

    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      redirectPath: "/",
      message: messageError,
    };
  }
}

function getRedirectPath(role: Role): string {
  switch (role) {
    case "ADMIN":
      return roleRedirects[role];
    case "OWNER":
      return roleRedirects[role];
    case "MANAGER":
      return roleRedirects[role];
    case "SELLER":
      return roleRedirects[role];
    case "CASHIER":
      return roleRedirects[role];
      return roleRedirects[role];
    default:
      return "/";
  }
}

export async function logoutAction() {
  try {
    const authCookies = await cookies();

    authCookies.delete(TOKEN_COOKIE_KEY);
    authCookies.delete(PLAN_COOKIE_KEY);
    authCookies.delete(REFRESH_TOKEN_COOKIE_KEY);
  } catch (error) {
    console.error("🚨 Erro ao fazer logout:", error);
  } finally {
    redirect("/");
  }
}
