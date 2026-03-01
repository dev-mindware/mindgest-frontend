"use server";
import { cookies } from "next/headers";
import { SessionPayload } from "./session";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants";

export async function getSession(): Promise<SessionPayload | null> {
  const authCookies = await cookies();
  const accessToken = authCookies.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = authCookies.get(REFRESH_TOKEN_KEY)?.value;

  // ✅ Só o refreshToken é obrigatório para considerar sessão válida.
  // O accessToken pode ter expirado (4 min) — o interceptor do axios trata do refresh.
  if (!refreshToken) return null;

  return {
    accessToken: accessToken ?? "", // pode estar vazio/expirado — axios vai renovar
    refreshToken,
  };
}