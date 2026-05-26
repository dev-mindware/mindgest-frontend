/**
 * @jest-environment node
 *
 * NOTA: proxy roda em Edge runtime, então testamos em ambiente Node.
 * NextRequest/NextResponse precisam de polyfills do Node.
 */

import { proxy } from "@/proxy";
import { NextRequest } from "next/server";

// Helper para criar request mock
function createRequest(
  pathname: string,
  cookies: Record<string, string> = {}
): NextRequest {
  const url = `http://localhost:3000${pathname}`;
  const req = new NextRequest(url);
  Object.entries(cookies).forEach(([key, value]) => {
    req.cookies.set(key, value);
  });
  return req;
}

describe("proxy", () => {
  describe("Rotas públicas", () => {
    it("permite acesso a /auth/login sem cookies", () => {
      const req = createRequest("/auth/login");
      const res = proxy(req);
      // NextResponse.next() não tem location header
      expect(res.headers.get("location")).toBeNull();
    });

    it("permite acesso a /unauthorized sem autenticação", () => {
      const req = createRequest("/unauthorized");
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("permite acesso a /auth/register sem autenticação", () => {
      const req = createRequest("/auth/register");
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  describe("Rotas privadas sem autenticação", () => {
    it("redireciona para /auth/login ao acessar /dashboard", () => {
      const req = createRequest("/dashboard");
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");
    });

    it("redireciona para /auth/login ao acessar /admin/dashboard", () => {
      const req = createRequest("/admin/dashboard");
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");
    });

    it("guarda 'from' na URL ao redirecionar", () => {
      const req = createRequest("/admin/dashboard");
      const res = proxy(req);
      const location = res.headers.get("location") || "";
      expect(location).toContain("from=");
      expect(decodeURIComponent(location)).toContain("/admin/dashboard");
    });
  });

  describe("Rotas privadas com autenticação", () => {
    it("permite acesso quando autenticado com role válido", () => {
      const req = createRequest("/dashboard", {
        refresh_token: "valid-token",
        user_role: "OWNER",
      });
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("permite ADMIN acessar /admin/dashboard", () => {
      const req = createRequest("/admin/dashboard", {
        refresh_token: "valid-token",
        user_role: "ADMIN",
      });
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });
  });

  describe("Cookies manipulados (segurança)", () => {
    it("limpa cookies se role for inválido", () => {
      const req = createRequest("/dashboard", {
        refresh_token: "valid-token",
        user_role: "HACKER",
      });
      const res = proxy(req);

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

    it("limpa cookies se role estiver ausente mas refresh existir", () => {
      const req = createRequest("/dashboard", {
        refresh_token: "valid-token",
      });
      const res = proxy(req);

      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/auth/login");
    });

    it("aceita case correto e rejeita variações", () => {
      const req1 = createRequest("/dashboard", {
        refresh_token: "token",
        user_role: "owner", // lowercase
      });
      const res1 = proxy(req1);
      expect(res1.headers.get("location")).toContain("/auth/login");

      const req2 = createRequest("/dashboard", {
        refresh_token: "token",
        user_role: "OWNER", // correto
      });
      const res2 = proxy(req2);
      expect(res2.headers.get("location")).toBeNull();
    });
  });

  describe("Autenticado em página de auth", () => {
    it("redireciona OWNER para /dashboard", () => {
      const req = createRequest("/auth/login", {
        refresh_token: "token",
        user_role: "OWNER",
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/dashboard");
    });

    it("redireciona CASHIER para /pos/counter", () => {
      const req = createRequest("/auth/login", {
        refresh_token: "token",
        user_role: "CASHIER",
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/pos/counter");
    });

    it("redireciona ADMIN para /admin/dashboard", () => {
      const req = createRequest("/auth/login", {
        refresh_token: "token",
        user_role: "ADMIN",
      });
      const res = proxy(req);
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toContain("/admin/dashboard");
    });
  });

  describe("Loop prevention", () => {
    it("NÃO redireciona quando autenticado em /dashboard", () => {
      const req = createRequest("/dashboard", {
        refresh_token: "token",
        user_role: "OWNER",
      });
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("NÃO redireciona quando não autenticado em /auth/login", () => {
      const req = createRequest("/auth/login");
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });

    it("ignora rotas /api/auth/*", () => {
      const req = createRequest("/api/auth/refresh");
      const res = proxy(req);
      expect(res.headers.get("location")).toBeNull();
    });
  });
});
