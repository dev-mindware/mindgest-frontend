import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;

export const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
}

export async function createSession(payload: SessionPayload) {
  // Access Token: 24 horas
  const accessExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // Refresh Token: 7 dias
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const authCookies = await cookies();
  authCookies.set("accessToken", payload.accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessExpiresAt,
    sameSite: "lax",
    path: "/",
  });

  authCookies.set("refreshToken", payload.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: refreshExpiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function destroySession() {
  const authCookies = await cookies();
  authCookies.delete("accessToken");
  authCookies.delete("refreshToken");
}
