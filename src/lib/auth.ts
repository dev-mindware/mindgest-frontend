import { jwtVerify } from "jose";
import { Plan } from "./features";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret"
);

export type DecodedPayload = {
  userId: string;
  email: string;
  role: string;
  companyId: string;
  plan: string; // Plano vem direto do JWT
  storeId?: string;
  iat?: number;
  exp?: number;
};

export async function decodeToken(token: string): Promise<DecodedPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);

    // Garantir tipagem segura
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      companyId: payload.companyId as string,
      plan: payload.plan as Plan,
      storeId: payload.storeId as string | undefined,
      iat: payload.iat as number | undefined,
      exp: payload.exp as number | undefined,
    };
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return null;
  }
}
