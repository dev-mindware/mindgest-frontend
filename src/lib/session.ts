import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET || "e9b25a7d3f8c14e0f6b4d9a2c5813f7e9b0a45c2f8d1e3b6a7c9d0f4b1e56a8c";

export const encodedKey = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  accessToken: string;
  refreshToken: string;
}

export async function createSession(payload: SessionPayload) {
  const accessExpiresAt = new Date(Date.now() + 4 * 60 * 1000);
  const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const authCookies = await cookies();
  authCookies.set(ACCESS_TOKEN_KEY, payload.accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessExpiresAt,
    sameSite: "lax",
    path: "/",
  });

  authCookies.set(REFRESH_TOKEN_KEY, payload.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: refreshExpiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function destroySession() {
  const authCookies = await cookies();

  // Explicitly set to expired with same options used during creation
  const options = {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  };

  authCookies.set(ACCESS_TOKEN_KEY, "", options);
  authCookies.set(REFRESH_TOKEN_KEY, "", options);
}
