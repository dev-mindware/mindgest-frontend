"use server";
import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { roleRedirects } from "@/utils";
import { LoginResponse, Role, User } from "@/types";
import { loginSchema } from "@/schemas";
import api from "@/services/api";
import { createSession } from "@/lib/session";
import { SESSION_COOKIE_KEY } from "@/constants";

export async function loginAction({
  email,
  password,
}: z.infer<typeof loginSchema>): Promise<{
  user: User | null;
  redirectPath?: string;
  message?: string;
}> {
  try {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const { user, tokens, message } = res.data;

    if (!user) {
      throw new Error("Usuário não autorizado");
    }
    // console.log("Usuário logado:", user);
    console.log("RESULTADO DA RESPOSTA");
    console.log(res.data);

    await createSession({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    const redirectPath = getRedirectPath(user.role);
    console.log(`Login bem-sucedido! Redirecionando para: ${redirectPath}`);

    return { message, user, redirectPath };
  } catch (error: any) {
    let messageError = "Ocorreu um erro desconhecido!";
    if (error?.response) {
      messageError = error?.response?.data?.message;
    }

    return {
      user: null,
      redirectPath: "/auth/login",
      message: messageError,
    };
  }
}

function getRedirectPath(role: Role): string {
  return roleRedirects[role as keyof typeof roleRedirects] || "/";
}

export async function logoutAction() {
  try {
    const authCookies = await cookies();
    authCookies.delete(SESSION_COOKIE_KEY);
  } catch (error) {
    console.error("🚨 Erro ao fazer logout:", error);
  } finally {
    redirect("/auth/login");
  }
}
