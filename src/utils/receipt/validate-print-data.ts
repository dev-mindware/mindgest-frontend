import type { InvoiceReceiptPrintData } from "@/types";

/**
 * Os dados devolvidos pelo backend não chegam para um talão legal. A impressão
 * pelo agente é recusada e o POS oferece "Imprimir pelo browser" (PDF).
 */
export class ReceiptDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReceiptDataError";
  }
}

export function isReceiptDataError(error: unknown): error is ReceiptDataError {
  return error instanceof ReceiptDataError;
}

const isBlank = (value: unknown) =>
  value === null || value === undefined || String(value).trim() === "";

/**
 * Garante que os campos exigidos pela AGT vieram preenchidos. Não calcula nem
 * corrige nada: o backend é a única fonte destes valores.
 */
export function assertPrintable(data: InvoiceReceiptPrintData): void {
  const missing: string[] = [];

  if (isBlank(data?.number)) missing.push("número do documento");
  if (isBlank(data?.company?.name) || isBlank(data?.company?.taxNumber)) {
    missing.push("nome e NIF da empresa");
  }
  if (isBlank(data?.hash)) missing.push("hash");
  if (isBlank(data?.qrCode)) missing.push("código QR");
  if (isBlank(data?.certificationNumber)) missing.push("n.º de certificação");
  if (!data?.items?.length) missing.push("linhas");

  if (missing.length > 0) {
    throw new ReceiptDataError(
      `O documento não tem todos os dados obrigatórios para o talão (${missing.join(", ")}).`,
    );
  }
}
