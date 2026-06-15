/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/contributors/verify/route";
import axios from "axios";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

function createRequest(taxNumber = "5000012345", origin = "http://localhost:3000") {
  return new NextRequest("http://localhost:3000/api/contributors/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin,
      "x-forwarded-for": `${taxNumber}-${Math.random()}`,
    },
    body: JSON.stringify({ taxNumber }),
  });
}

describe("POST /api/contributors/verify", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.SIGT_BASE_URL = "https://sigt.example.test/contribuinte";
    process.env.SIGT_USERNAME = "username";
    process.env.SIGT_PASSWORD = "password";
    jest.restoreAllMocks();
    mockedAxios.get.mockReset();
  });

  it("normaliza um contribuinte activo", async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
          ObterContribuinte: {
            contribuinte: {
              numeroNIF: "5000012345",
              nome: "Contribuinte de Teste",
              tipoContribuinte: "COLLECTIVE",
              estadoContribuinte: "A",
              regimeIva: "GNAD",
              indicadorNaoResidente: false,
            },
          },
      },
    } as never);

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      taxNumber: "5000012345",
      name: "Contribuinte de Teste",
      status: "A",
      hasRestrictions: false,
    });
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("numeroDocumento=5000012345"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Username: "username",
          Password: "password",
        }),
        proxy: false,
        timeout: 10000,
      }),
    );
  });

  it("assinala um contribuinte com restrições sem rejeitar a consulta", async () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: {
          ObterContribuinte: {
            contribuinte: {
              numeroNIF: "5000012345",
              nome: "Contribuinte Suspenso",
              tipoContribuinte: "SINGULAR",
              estadoContribuinte: "G",
              regimeIva: "SIMP",
              indicadorNaoResidente: false,
            },
          },
      },
    } as never);

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.hasRestrictions).toBe(true);
    expect(body.status).toBe("G");
  });

  it("devolve 404 quando o contribuinte não existe", async () => {
    mockedAxios.get.mockResolvedValue({ status: 404, data: null } as never);

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.code).toBe("TAXPAYER_NOT_FOUND");
  });

  it("trata credenciais recusadas como serviço indisponível", async () => {
    mockedAxios.get.mockResolvedValue({ status: 401, data: "Unauthorized" } as never);

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.code).toBe("SERVICE_UNAVAILABLE");
    expect(body.message).toContain("não está autorizado");
  });

  it("rejeita um formato de NIF inválido antes de contactar o serviço", async () => {
    const response = await POST(createRequest("123"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.code).toBe("INVALID_TAX_NUMBER");
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it("não expõe detalhes quando a configuração está ausente", async () => {
    delete process.env.SIGT_PASSWORD;

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      message: "O serviço de verificação está temporariamente indisponível.",
      code: "SERVICE_UNAVAILABLE",
    });
    expect(JSON.stringify(body)).not.toContain("username");
  });
});
