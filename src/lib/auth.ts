"use server";
import { cookies } from "next/headers";
import { SessionPayload } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const authCookies = await cookies();
  const accessToken = authCookies.get("accessToken")?.value;
  const refreshToken = authCookies.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) return null;

  return { accessToken, refreshToken };
}
