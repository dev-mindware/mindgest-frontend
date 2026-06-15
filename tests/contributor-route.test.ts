/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/contributors/verify/route";
import { getContributorByDocument } from "@/services/setic/setic-client";

jest.mock("@/services/setic/setic-client");

const mockedGetContributor = getContributorByDocument as jest.Mock;

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
    mockedGetContributor.mockReset();

    // Default mock behavior
    mockedGetContributor.mockImplementation(() => {
      if (!process.env.SIGT_BASE_URL || !process.env.SIGT_USERNAME || !process.env.SIGT_PASSWORD) {
        throw new Error("Configuração SETIC-FP incompleta.");
      }
      return Promise.resolve({
        ObterContribuinte: {
          mensagem: "Consulta realizada com sucesso.",
          contribuinte: {
            numeroNIF: "5000012345",
            nome: "Contribuinte de Teste",
            tipoContribuinte: "COLLECTIVE",
            estadoContribuinte: "A",
            regimeIva: "GNAD",
            indicadorNaoResidente: false,
          },
        },
      });
    });
  });

  it("normaliza um contribuinte activo", async () => {
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
    expect(mockedGetContributor).toHaveBeenCalledWith({
      tipoDocumento: "NIF",
      numeroDocumento: "5000012345",
    });
  });

  it("assinala um contribuinte com restrições sem rejeitar a consulta", async () => {
    mockedGetContributor.mockResolvedValue({
      ObterContribuinte: {
        mensagem: "Consulta realizada com sucesso.",
        contribuinte: {
          numeroNIF: "5000012345",
          nome: "Contribuinte Suspenso",
          tipoContribuinte: "SINGULAR",
          estadoContribuinte: "G",
          regimeIva: "SIMP",
          indicadorNaoResidente: false,
        },
      },
    });

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.hasRestrictions).toBe(true);
    expect(body.status).toBe("G");
  });

  it("devolve 404 quando o contribuinte não existe", async () => {
    mockedGetContributor.mockRejectedValue(new Error("SETIC-FP respondeu com erro 404: Not Found"));

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.code).toBe("TAXPAYER_NOT_FOUND");
  });

  it("trata credenciais recusadas como serviço indisponível", async () => {
    mockedGetContributor.mockRejectedValue(new Error("SETIC-FP respondeu com erro 401: Unauthorized"));

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
    expect(mockedGetContributor).not.toHaveBeenCalled();
  });

  it("não expõe detalhes quando a configuração está ausente", async () => {
    delete process.env.SIGT_PASSWORD;

    const response = await POST(createRequest());
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({
      message: "Não foi possível comunicar com o serviço SETIC-FP. Verifique URL, DNS, VPN, whitelist ou disponibilidade do serviço.",
      code: "SERVICE_UNAVAILABLE",
    });
    expect(JSON.stringify(body)).not.toContain("username");
  });
});
