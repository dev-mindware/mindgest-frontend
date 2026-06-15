import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import https from "node:https";
import {
  isValidAngolanTaxNumber,
  normalizeTaxNumber,
  taxpayerHasRestrictions,
} from "@/lib/contributor";
import type {
  ContributorErrorCode,
  TaxpayerStatus,
  TaxpayerType,
  VatRegime,
  VerifiedContributor,
} from "@/types/contributor";

const DEFAULT_TIMEOUT_MS = 10_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimits = new Map<string, { count: number; expiresAt: number }>();

export const runtime = "nodejs";

const seticHttpsAgent = new https.Agent({
  minVersion: "TLSv1.2",
  maxVersion: "TLSv1.2",
});

function errorResponse(message: string, code: ContributorErrorCode, status: number) {
  return NextResponse.json(
    { message, code },
    {
      status,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    },
  );
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV === "test";

  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  const allowedOrigins = new Set([request.nextUrl.origin]);
  if (configuredUrl) {
    try {
      allowedOrigins.add(new URL(configuredUrl).origin);
    } catch {
      return false;
    }
  }

  try {
    return allowedOrigins.has(new URL(origin).origin);
  } catch {
    return false;
  }
}

function getClientAddress(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.expiresAt <= now) {
    rateLimits.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function readContributor(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, any>;
  return root.ObterContribuinte?.contribuinte || root.obterContribuinte?.contribuinte || root.contribuinte || null;
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return errorResponse("Origem não autorizada.", "UPSTREAM_ERROR", 403);
  }

  if (isRateLimited(getClientAddress(request))) {
    return errorResponse(
      "Foram efectuadas demasiadas consultas. Aguarde um momento.",
      "RATE_LIMITED",
      429,
    );
  }

  let body: { taxNumber?: unknown };
  try {
    body = await request.json();
  } catch {
    return errorResponse("O pedido é inválido.", "INVALID_TAX_NUMBER", 400);
  }

  const taxNumber = normalizeTaxNumber(
    typeof body.taxNumber === "string" ? body.taxNumber : "",
  );
  if (!isValidAngolanTaxNumber(taxNumber)) {
    return errorResponse("O NIF introduzido é inválido.", "INVALID_TAX_NUMBER", 400);
  }

  const baseUrl = process.env.SIGT_BASE_URL;
  const username = process.env.SIGT_USERNAME;
  const password = process.env.SIGT_PASSWORD;
  if (!baseUrl || !username || !password) {
    console.error("[SETIC-FP] Configuração do serviço incompleta.");
    return errorResponse(
      "O serviço de verificação está temporariamente indisponível.",
      "SERVICE_UNAVAILABLE",
      503,
    );
  }

  const timeoutValue = Number(process.env.SIGT_REQUEST_TIMEOUT_MS);
  const timeoutMs = Number.isFinite(timeoutValue) && timeoutValue > 0
    ? timeoutValue
    : DEFAULT_TIMEOUT_MS;
  try {
    const url = new URL(`${baseUrl.replace(/\/$/, "")}/v5/obter`);
    url.searchParams.set("tipoDocumento", "NIF");
    url.searchParams.set("numeroDocumento", taxNumber);

    const response = await axios.get(url.toString(), {
      headers: {
        Accept: "application/json",
        Username: username,
        Password: password,
      },
      timeout: timeoutMs,
      httpsAgent: seticHttpsAgent,
      proxy: false,
      validateStatus: () => true,
    });

    if (response.status === 404) {
      return errorResponse(
        "Não foi encontrado um contribuinte com este NIF.",
        "TAXPAYER_NOT_FOUND",
        404,
      );
    }
    if (response.status === 401 || response.status === 403) {
      console.error(
        "[SETIC-FP] Credenciais recusadas ou origem sem autorização:",
        response.status,
      );
      return errorResponse(
        "O acesso ao serviço fiscal não está autorizado. Confirme as credenciais e a autorização do ambiente SETIC-FP.",
        "SERVICE_UNAVAILABLE",
        503,
      );
    }
    if (response.status === 429) {
      return errorResponse(
        "O limite de consultas ao serviço fiscal foi atingido.",
        "RATE_LIMITED",
        429,
      );
    }
    if (response.status === 502 || response.status === 503) {
      return errorResponse(
        "O serviço de verificação está temporariamente indisponível.",
        "SERVICE_UNAVAILABLE",
        503,
      );
    }
    if (response.status < 200 || response.status >= 300) {
      console.error("[SETIC-FP] Resposta inesperada:", response.status);
      return errorResponse(
        "Não foi possível concluir a verificação fiscal.",
        "UPSTREAM_ERROR",
        502,
      );
    }

    const contributor = readContributor(response.data);
    if (!contributor) {
      return errorResponse(
        "Não foi encontrado um contribuinte com este NIF.",
        "TAXPAYER_NOT_FOUND",
        404,
      );
    }

    const status = contributor.estadoContribuinte as TaxpayerStatus;
    const result: VerifiedContributor = {
      taxNumber: String(contributor.numeroNIF || taxNumber),
      name: String(contributor.nome || "").trim(),
      taxpayerType: contributor.tipoContribuinte as TaxpayerType,
      status,
      vatRegime: contributor.regimeIva as VatRegime,
      nonResident: Boolean(contributor.indicadorNaoResidente),
      hasRestrictions: taxpayerHasRestrictions(status),
    };

    if (!result.name || !result.status || !result.taxpayerType || !result.vatRegime) {
      console.error("[SETIC-FP] Resposta sem os campos fiscais esperados.");
      return errorResponse(
        "O serviço fiscal devolveu uma resposta inválida.",
        "UPSTREAM_ERROR",
        502,
      );
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.code === "ECONNABORTED" || axiosError.code === "ETIMEDOUT") {
      return errorResponse(
        "A verificação demorou mais do que o esperado.",
        "UPSTREAM_TIMEOUT",
        504,
      );
    }

    console.error("[SETIC-FP] Falha de comunicação:", error instanceof Error ? error.message : "Erro desconhecido");
    return errorResponse(
      "O serviço de verificação está temporariamente indisponível.",
      "SERVICE_UNAVAILABLE",
      503,
    );
  }
}

export async function GET() {
  return errorResponse("Método não permitido.", "UPSTREAM_ERROR", 405);
}
