import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";

export async function GET() {
  await destroySession();
  return NextResponse.redirect(
    new URL(
      "/auth/login",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ),
  );
}

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true });
}
