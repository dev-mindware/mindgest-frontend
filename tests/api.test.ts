/**
 * Testa o interceptor do axios.
 * Requer: npm install -D axios-mock-adapter
 */
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// ============================================================================
// MOCKS — As funções mock são criadas DENTRO do factory para evitar
// problemas de hoisting do Jest (jest.mock é elevado ao topo).
// ============================================================================

jest.mock("@/lib/browser-redirect", () => ({
  redirectToLogin: jest.fn(),
  hardRedirect: jest.fn(),
}));

jest.mock("@/actions/auth", () => ({
  clearLocalSession: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/actions/token", () => ({
  getAccessToken: jest.fn().mockResolvedValue("initial-token"),
  getRefreshToken: jest.fn().mockResolvedValue("refresh-token"),
}));

jest.mock("@/stores", () => ({
  currentStoreStore: {
    getState: () => ({ currentStore: { id: "store-123" } }),
  },
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue({ value: "mocked-cookie-value" }),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn().mockReturnValue(true),
  }),
}));

// ============================================================================
// IMPORTA O API E OS MOCKS APÓS jest.mock
// ============================================================================
import { api, resetAccessTokenCache } from "@/services/api";
import { redirectToLogin } from "@/lib/browser-redirect";

// Cast para Jest.Mock para podermos verificar chamadas
const mockRedirectToLogin = redirectToLogin as jest.Mock;

describe("API Interceptor", () => {
  let mock: MockAdapter;
  let mockRefresh: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    mockRefresh = new MockAdapter(axios);
    resetAccessTokenCache();
    mockRedirectToLogin.mockClear();
  });

  afterEach(() => {
    mock.restore();
    mockRefresh.restore();
  });

  // ==========================================================================
  describe("Anexação de token", () => {
    it("anexa Bearer token no header de requests autenticados", async () => {
      mock.onGet("/protected").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer initial-token");
        return [200, { ok: true }];
      });

      await api.get("/protected");
    });

    it("NÃO anexa token em rotas de auth público", async () => {
      mock.onPost("/auth/login").reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, { ok: true }];
      });

      await api.post("/auth/login", { email: "a", password: "b" });
    });

    it("anexa token em rota de registro de colaborador (ex: /auth/register/user)", async () => {
      mock.onPost("/auth/register/user").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer initial-token");
        return [200, { ok: true }];
      });

      await api.post("/auth/register/user", { name: "Collaborator" });
    });
  });

  // ==========================================================================
  describe("Refresh transparente em 401", () => {
    it("faz refresh e retenta o request original", async () => {
      let callCount = 0;

      mock.onGet("/protected").reply(() => {
        callCount++;
        if (callCount === 1) return [401, { message: "Token expired" }];
        return [200, { ok: true, data: "success" }];
      });

      mockRefresh
        .onPost("/api/auth/refresh")
        .reply(200, { accessToken: "new-token" });

      const response = await api.get("/protected");

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ ok: true, data: "success" });
      expect(callCount).toBe(2);
    });

    it("usa novo token nos próximos requests", async () => {
      mock.onGet("/first").replyOnce(401);
      mock.onGet("/first").reply(200);
      mock.onGet("/second").reply((config) => {
        expect(config.headers?.Authorization).toBe("Bearer new-token");
        return [200];
      });

      mockRefresh
        .onPost("/api/auth/refresh")
        .reply(200, { accessToken: "new-token" });

      await api.get("/first");
      await api.get("/second");
    });
  });

  // ==========================================================================
  describe("Refresh concorrente (failedQueue)", () => {
    it("apenas 1 refresh para múltiplos requests simultâneos", async () => {
      let refreshCount = 0;

      mock.onGet("/req1").replyOnce(401).onGet("/req1").reply(200);
      mock.onGet("/req2").replyOnce(401).onGet("/req2").reply(200);
      mock.onGet("/req3").replyOnce(401).onGet("/req3").reply(200);

      mockRefresh.onPost("/api/auth/refresh").reply(() => {
        refreshCount++;
        return [200, { accessToken: "new-token" }];
      });

      await Promise.all([
        api.get("/req1"),
        api.get("/req2"),
        api.get("/req3"),
      ]);

      expect(refreshCount).toBe(1);
    });
  });

  // ==========================================================================
  describe("Falha de refresh", () => {
    it("rejeita todos os requests da fila quando refresh falha", async () => {
      mock.onGet("/protected").reply(401);
      mockRefresh.onPost("/api/auth/refresh").reply(401);

      await expect(api.get("/protected")).rejects.toThrow();
    });

    it("não tenta refresh em rotas de auth", async () => {
      let refreshCount = 0;

      mock.onPost("/auth/login").reply(401);
      mockRefresh.onPost("/api/auth/refresh").reply(() => {
        refreshCount++;
        return [200, { accessToken: "new" }];
      });

      await expect(
        api.post("/auth/login", { email: "x", password: "y" })
      ).rejects.toThrow();

      expect(refreshCount).toBe(0);
    });

    it("não desloga em 500", async () => {
      mock.onGet("/protected").reply(500, { message: "Server error" });

      await expect(api.get("/protected")).rejects.toMatchObject({
        response: { status: 500 },
      });

      expect(mockRedirectToLogin).not.toHaveBeenCalled();
    });

    it("não desloga em 403", async () => {
      mock.onGet("/forbidden").reply(403);

      await expect(api.get("/forbidden")).rejects.toMatchObject({
        response: { status: 403 },
      });

      expect(mockRedirectToLogin).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  describe("Injeção de storeId", () => {
    it("injeta storeId em GET /invoice", async () => {
      mock.onGet("/invoice").reply((config) => {
        expect(config.params?.storeId).toBe("store-123");
        return [200];
      });

      await api.get("/invoice");
    });

    it("injeta storeId em POST /invoice", async () => {
      mock.onPost("/invoice").reply((config) => {
        const data = JSON.parse(config.data);
        expect(data.storeId).toBe("store-123");
        return [200];
      });

      await api.post("/invoice", { amount: 100 });
    });

    it("NÃO injeta em rotas excluídas (/expenses)", async () => {
      mock.onGet("/expenses").reply((config) => {
        expect(config.params?.storeId).toBeUndefined();
        return [200];
      });

      await api.get("/expenses");
    });

    it("respeita storeId já fornecido manualmente", async () => {
      mock.onGet("/invoice").reply((config) => {
        expect(config.params?.storeId).toBe("manual-store");
        return [200];
      });

      await api.get("/invoice", { params: { storeId: "manual-store" } });
    });
  });
});