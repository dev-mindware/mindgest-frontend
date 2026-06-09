"use server";

import { refreshAccessToken } from "@/lib/session";

export async function refreshAccessTokenAction(newAccessToken: string) {
  await refreshAccessToken(newAccessToken);
}