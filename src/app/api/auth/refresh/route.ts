import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession } from "@/lib/session";
import { clearLocalSession } from "@/actions/auth";
import axios from "axios";
import { LoginResponse } from "@/types";
import { REFRESH_TOKEN_KEY } from "@/constants/auth";

// Pequena proteção CSRF: só aceita chamadas com Origin da própria app
function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;

  if (!appUrl) {
    // Sem configuração explícita, caímos para um modo mais permissivo,
    // assumindo que o frontend chama do mesmo host.
    return true;
  }

  try {
    const allowed = new URL(appUrl);
    const current = new URL(origin);
    return (
      allowed.protocol === current.protocol &&
      allowed.hostname === current.hostname &&
      allowed.port === current.port
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAllowedOrigin(req)) {
      return NextResponse.json(
        { message: "Origem não autorizada para refresh de token" },
        { status: 403 },
      );
    }

    const authCookies = await cookies();
    const refreshToken = authCookies.get(REFRESH_TOKEN_KEY)?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Refresh token não encontrado na sessão" },
        { status: 401 },
      );
    }

    // Faz a chamada à API backend para renovar o token.
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        refreshToken,
      },
    );

    if (!response.data) {
      await clearLocalSession();
      const errorText = "Erro ao renovar token";
      return NextResponse.json(
        {
          message: "A API externa recusou a renovação do token",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = response.data;

    // Suportar resposta direta ou aninhada conforme a interface
    const parsedTokens = data.tokens;

    const newAccessToken = parsedTokens.accessToken;
    const newRefreshToken = parsedTokens.refreshToken;

    if (!newAccessToken || !newRefreshToken) {
      return NextResponse.json(
        { message: "Tokens inválidos retornados pela API", data },
        { status: 500 },
      );
    }

    await createSession({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      tokens: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error: any) {
    console.error("🚨 [API Route] Erro crítico renovando o token:", error);
    await clearLocalSession();
    return NextResponse.json(
      {
        message: "Erro de Servidor na Rota de Refresh",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
