/**
 * @jest-environment node
 *
 * NOTA: proxy roda em Edge runtime, então testamos em ambiente Node.
 * NextRequest/NextResponse precisam de polyfills do Node.
 */

import { proxy } from "@/proxy";
import { NextRequest } from "next/server";
import { signRole } from "@/lib/session";

// Helper para criar request mock
async function createRequest(
  pathname: string,
  cookies: Record<string, string> = {}
): Promise<NextRequest> {
  const url = `http://localhost:3000${pathname}`;
  const req = new NextRequest(url);
  for (const [key, value] of Object.entries(cookies)) {
    if (key === "user_role" && value && value !== "HACKER" && value !== "owner") {
      const signed = await signRole(value);
      req.cookies.set(key, signed);
    } else {
      req.cookies.set(key, value);
    }
  }
  return req;
}

describe("proxy", () => {
  describe("Rotas públicas", () => {
    it("permite acesso a /auth/login sem cookies", async () => {
      const req = await createRequest("/auth/login");
      const res = await proxy(req);
      // NextResponse.next() não tem location header
      expect(res.headers.get("location")).toBeNull();
    });

    it("permite acesso a /unauthorized sem autenticação", async () => {
      const req = await createRequest("/unauthorized");
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("permite acesso a /auth/register sem autenticação", async () => {
      const req = await createRequest("/auth/register");
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  describe("Rotas privadas sem autenticação", () => {
    it("redireciona para /auth/login ao acessar /dashboard", async () => {
      const req = await createRequest("/dashboard");
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");
    });

    it("redireciona para /auth/login ao acessar /admin/dashboard", async () => {
      const req = await createRequest("/admin/dashboard");
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");
    });

    it("guarda 'from' na URL ao redirecionar", async () => {
      const req = await createRequest("/admin/dashboard");
      const res = await proxy(req);
      const location = res.headers.get("location") || "";
      expect(location).toContain("from=");
      expect(decodeURIComponent(location)).toContain("/admin/dashboard");
    });
  });

  describe("Rotas privadas com autenticação", () => {
    it("permite acesso quando autenticado com role válido", async () => {
      const req = await createRequest("/dashboard", {
        refresh_token: "valid-token",
        user_role: "OWNER",
      });
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("permite ADMIN acessar /admin/dashboard", async () => {
      const req = await createRequest("/admin/dashboard", {
        refresh_token: "valid-token",
        user_role: "ADMIN",
      });
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  describe("Cookies manipulados (segurança)", () => {
    it("limpa cookies se role for inválido", async () => {
      const req = await createRequest("/dashboard", {
        refresh_token: "valid-token",
        user_role: "HACKER",
      });
      const res = await proxy(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");

      // Verifica que tem Set-Cookie para deletar
      const setCookieHeaders = res.headers.getSetCookie?.() || [];
      const hasDeleteCookies = setCookieHeaders.some(
        (h) =>
          h.includes("refresh_token=") &&
          (h.includes("Max-Age=0") || h.includes("Expires="))
      );
      expect(hasDeleteCookies).toBe(true);
    });

    it("limpa cookies se role estiver ausente mas refresh existir", async () => {
      const req = await createRequest("/dashboard", {
        refresh_token: "valid-token",
      });
      const res = await proxy(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");
    });

    it("aceita case correto e rejeita variações", async () => {
      const req1 = await createRequest("/dashboard", {
        refresh_token: "token",
        user_role: "owner", // lowercase (não será assinado pelo helper)
      });
      const res1 = await proxy(req1);
      expect(res1.headers.get("location")).toContain("/auth/login");

      const req2 = await createRequest("/dashboard", {
        refresh_token: "token",
        user_role: "OWNER", // correto
      });
      const res2 = await proxy(req2);
      expect(res2.headers.get("location")).toBeNull();
    });

    it("limpa cookies e rejeita se a role for OWNER mas a assinatura for inválida", async () => {
      const req = new NextRequest("http://localhost:3000/dashboard");
      req.cookies.set("refresh_token", "valid-token");
      req.cookies.set("user_role", "OWNER.invalid-signature-value-123");
      const res = await proxy(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");

      const setCookieHeaders = res.headers.getSetCookie?.() || [];
      const hasDeleteRoleCookie = setCookieHeaders.some(
        (h) =>
          h.includes("user_role=") &&
          (h.includes("Max-Age=0") || h.includes("Expires="))
      );
      expect(hasDeleteRoleCookie).toBe(true);
    });
  });

  describe("Autenticado em página de auth", () => {
    it("redireciona OWNER para /dashboard", async () => {
      const req = await createRequest("/auth/login", {
        refresh_token: "token",
        user_role: "OWNER",
      });
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/dashboard");
    });

    it("redireciona CASHIER para /pos/counter", async () => {
      const req = await createRequest("/auth/login", {
        refresh_token: "token",
        user_role: "CASHIER",
      });
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/pos/counter");
    });

    it("redireciona ADMIN para /admin/dashboard", async () => {
      const req = await createRequest("/auth/login", {
        refresh_token: "token",
        user_role: "ADMIN",
      });
      const res = await proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/admin/dashboard");
    });
  });

  describe("Loop prevention", () => {
    it("NÃO redireciona quando autenticado em /dashboard", async () => {
      const req = await createRequest("/dashboard", {
        refresh_token: "token",
        user_role: "OWNER",
      });
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("NÃO redireciona quando não autenticado em /auth/login", async () => {
      const req = await createRequest("/auth/login");
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("ignora rotas /api/auth/*", async () => {
      const req = await createRequest("/api/auth/refresh");
      const res = await proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });
  });
});
