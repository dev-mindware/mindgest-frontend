"use server";
import { getSession } from "@/lib/auth";
export async function clearLocalSession() {
  const { destroySession } = await import("@/lib/session");
  await destroySession();
}
