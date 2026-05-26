/**
 * @jest-environment node
 *
 * Testa a rota /api/auth/refresh com diferentes cenários.
 */

import { POST } from "@/app/api/auth/refresh/route";
import { NextRequest } from "next/server";
import axios from "axios";

jest.mock("axios");
jest.mock("@/lib/session", () => ({
  createSession: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("@/actions/auth", () => ({
  clearLocalSession: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";
import { createSession } from "@/lib/session";
import { clearLocalSession } from "@/actions/auth";

const mockedAxios = axios as jest.Mocked<typeof axios>;

function createRequest(
  origin: string | null,
  cookieValue: string | null = "valid-refresh-token"
): NextRequest {
  const headers = new Headers();
  if (origin) headers.set("origin", origin);

  const req = new NextRequest("http://localhost:3000/api/auth/refresh", {
    method: "POST",
    headers,
  });

  // Mock cookies()
  (cookies as jest.Mock).mockResolvedValue({
    get: jest.fn().mockReturnValue(
      cookieValue ? { value: cookieValue } : undefined
    ),
  });

  return req;
}

describe("POST /api/auth/refresh", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_API_URL = "http://api.example.com";
    jest.clearAllMocks();
  });

  describe("Validação de origem", () => {
    it("rejeita origem diferente com 403", async () => {
      const req = createRequest("http://evil.com");
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(403);
      expect(body.code).toBe("INVALID_ORIGIN");
    });

    it("rejeita request sem header origin", async () => {
      const req = createRequest(null);
      const res = await POST(req);

      expect(res.status).toBe(403);
    });

    it("aceita origem da própria app", async () => {
      const req = createRequest("http://localhost:3000");

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          tokens: { accessToken: "new-access", refreshToken: "new-refresh" },
          user: { role: "OWNER" },
        },
      });

      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe("Cookie de refresh", () => {
    it("retorna 401 sem cookie de refresh", async () => {
      const req = createRequest("http://localhost:3000", null);
      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body.code).toBe("NO_REFRESH_TOKEN");
    });
  });

  describe("Resposta do backend", () => {
    it("retorna novo access token em sucesso", async () => {
      const req = createRequest("http://localhost:3000");

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          tokens: { accessToken: "new-access", refreshToken: "new-refresh" },
          user: { role: "OWNER" },
        },
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.accessToken).toBe("new-access");
      expect(body.success).toBe(true);
      expect(createSession).toHaveBeenCalledWith({
        accessToken: "new-access",
        refreshToken: "new-refresh",
        role: "OWNER",
      });
    });

    it("seta header Cache-Control para nunca cachear", async () => {
      const req = createRequest("http://localhost:3000");

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          tokens: { accessToken: "new", refreshToken: "ref" },
          user: { role: "OWNER" },
        },
      });

      const res = await POST(req);
      expect(res.headers.get("cache-control")).toContain("no-store");
    });
  });

  describe("Tratamento de erros", () => {
    it("retorna 401 e limpa sessão quando backend retorna 401", async () => {
      const req = createRequest("http://localhost:3000");

      const error: any = new Error("Unauthorized");
      error.response = { status: 401 };
      error.isAxiosError = true;
      mockedAxios.post.mockRejectedValueOnce(error);

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body.code).toBe("REFRESH_TOKEN_INVALID");
      expect(clearLocalSession).toHaveBeenCalled();
    });

    it("retorna 502 sem limpar sessão em erro 5xx do backend", async () => {
      const req = createRequest("http://localhost:3000");

      const error: any = new Error("Server error");
      error.response = { status: 500 };
      error.isAxiosError = true;
      mockedAxios.post.mockRejectedValueOnce(error);

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(502);
      expect(body.code).toBe("BACKEND_UNAVAILABLE");
      expect(clearLocalSession).not.toHaveBeenCalled();
    });

    it("retorna 504 em timeout sem limpar sessão", async () => {
      const req = createRequest("http://localhost:3000");

      const error: any = new Error("timeout");
      error.code = "ECONNABORTED";
      error.isAxiosError = true;
      mockedAxios.post.mockRejectedValueOnce(error);

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(504);
      expect(body.code).toBe("REFRESH_TIMEOUT");
      expect(clearLocalSession).not.toHaveBeenCalled();
    });

    it("rejeita resposta com role inválido", async () => {
      const req = createRequest("http://localhost:3000");

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          tokens: { accessToken: "new", refreshToken: "ref" },
          user: { role: "HACKER_ROLE" },
        },
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.code).toBe("INVALID_ROLE");
      expect(clearLocalSession).toHaveBeenCalled();
    });

    it("rejeita resposta sem tokens", async () => {
      const req = createRequest("http://localhost:3000");

      mockedAxios.post.mockResolvedValueOnce({
        data: { user: { role: "OWNER" } }, // sem tokens
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(500);
      expect(body.code).toBe("INVALID_BACKEND_RESPONSE");
    });
  });

  describe("Fail-closed para CORS", () => {
    it("recusa request quando NEXT_PUBLIC_APP_URL não está configurada (prod)", async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      const originalEnv = process.env.NODE_ENV;
      Object.defineProperty(process.env, "NODE_ENV", {
        value: "production",
        configurable: true,
      });

      const req = createRequest("http://localhost:3000");
      const res = await POST(req);

      expect(res.status).toBe(403);

      Object.defineProperty(process.env, "NODE_ENV", {
        value: originalEnv,
        configurable: true,
      });
    });
  });
});
