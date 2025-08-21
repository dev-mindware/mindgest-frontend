"use server";

import { getSession } from "@/lib/auth";

export async function getPlan() {
  const session = await getSession();
  return session?.user?.company.plan || null;
}