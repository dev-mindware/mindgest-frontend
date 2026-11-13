import {
  MINDPRINT_FALLBACK_MESSAGES,
  MINDPRINT_HEALTH_TIMEOUT_MS,
  MINDPRINT_PRINT_TIMEOUT_MS,
  MINDPRINT_REQUEST_TIMEOUT_MS,
} from "@/constants/mindprint";
import type {
  MindPrintErrorCode,
  MindPrintHealth,
  MindPrintPrinter,
  MindPrintPrintResult,
  MindPrintTestResult,
} from "@/types";
import { bytesToBase64 } from "@/utils/bytes-to-base64";

/**
 * Cliente do agente local MindPrint (http://127.0.0.1:<porta>).
 *
 * Usa `fetch` directo e não o cliente Axios da API: o agente corre no PC do
 * balcão, não é o backend do MindGest, e não deve receber os cabeçalhos nem
 * os interceptores de autenticação da API.
 */

export class MindPrintError extends Error {
  readonly code: MindPrintErrorCode;
  readonly status: number;
  /** Segundos a aguardar (só em `RATE_LIMITED`). */
  readonly retryAfter?: number;

  constructor(
    code: MindPrintErrorCode,
    message: string,
    status = 0,
    retryAfter?: number,
  ) {
    super(message);
    this.name = "MindPrintError";
    this.code = code;
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export function isMindPrintError(error: unknown): error is MindPrintError {
  return error instanceof MindPrintError;
}

type ClientConfig = {
  port: number;
  token?: string | null;
};

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  timeoutMs?: number;
  auth?: boolean;
};

function fallbackMessage(code: MindPrintErrorCode): string {
  return MINDPRINT_FALLBACK_MESSAGES[code] ?? MINDPRINT_FALLBACK_MESSAGES.UNKNOWN!;
}

async function request<T>(
  { port, token }: ClientConfig,
  path: string,
  { method = "GET", body, timeoutMs = MINDPRINT_REQUEST_TIMEOUT_MS, auth = false }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && token) headers["X-Token"] = token;

  let response: Response;
  try {
    response = await fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    // Agente não instalado, parado, timeout ou acesso à rede local recusado.
    throw new MindPrintError("AGENT_UNAVAILABLE", fallbackMessage("AGENT_UNAVAILABLE"));
  } finally {
    clearTimeout(timer);
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const error = (payload as { error?: { code?: string; message?: string } } | null)?.error;
    const code = (error?.code as MindPrintErrorCode | undefined) ?? "UNKNOWN";
    const retryAfterHeader = Number(response.headers.get("Retry-After"));
    throw new MindPrintError(
      code,
      error?.message || fallbackMessage(code),
      response.status,
      Number.isFinite(retryAfterHeader) && retryAfterHeader > 0 ? retryAfterHeader : undefined,
    );
  }

  if (payload === null) {
    throw new MindPrintError("UNKNOWN", fallbackMessage("UNKNOWN"), response.status);
  }

  return payload as T;
}

export type MindPrintPrintRequest = {
  printer?: string | null;
  data: Uint8Array;
  jobId: string;
};

export function createMindPrintClient(config: ClientConfig) {
  return {
    health: () =>
      request<MindPrintHealth>(config, "/health", {
        timeoutMs: MINDPRINT_HEALTH_TIMEOUT_MS,
      }),

    pair: (code: string) =>
      request<{ token: string }>(config, "/pair", {
        method: "POST",
        body: { code },
      }),

    printers: () =>
      request<{ printers: MindPrintPrinter[] }>(config, "/printers", {
        auth: true,
      }).then((response) => response.printers ?? []),

    print: ({ printer, data, jobId }: MindPrintPrintRequest) =>
      request<MindPrintPrintResult>(config, "/print", {
        method: "POST",
        auth: true,
        timeoutMs: MINDPRINT_PRINT_TIMEOUT_MS,
        body: {
          ...(printer ? { printer } : {}),
          data: bytesToBase64(data),
          jobId,
        },
      }),

    testPrint: (printer?: string | null) =>
      request<MindPrintTestResult>(config, "/test-print", {
        method: "POST",
        auth: true,
        timeoutMs: MINDPRINT_PRINT_TIMEOUT_MS,
        body: printer ? { printer } : {},
      }),
  };
}

export type MindPrintClient = ReturnType<typeof createMindPrintClient>;
