import type { MindPrintErrorCode, PaperWidth } from "@/types";

/** Liga a impressão directa pelo agente MindPrint. Por omissão desligada. */
export const MINDPRINT_ENABLED =
  process.env.NEXT_PUBLIC_MINDPRINT_ENABLED === "true";

export const MINDPRINT_DEFAULT_PORT = 17321;

export const MINDPRINT_HEALTH_TIMEOUT_MS = 1_500;
export const MINDPRINT_REQUEST_TIMEOUT_MS = 8_000;
export const MINDPRINT_PRINT_TIMEOUT_MS = 20_000;

/** N.º de certificação do MindGest (só para a factura de exemplo; nos documentos reais vem do backend). */
export const AGT_SOFTWARE_CERTIFICATION_NUMBER = "FE/241/AGT/2026";

/** Colunas da fonte A (12x24) por largura de papel. */
export const PAPER_COLUMNS: Record<PaperWidth, number> = {
  "80mm": 48,
  "58mm": 32,
};

/** Largura máxima, em pontos, das imagens (logótipo/QR). Múltiplo de 8. */
export const PAPER_MAX_IMAGE_WIDTH: Record<PaperWidth, number> = {
  "80mm": 384,
  "58mm": 320,
};

/** Erros em que o token deixou de valer e é preciso emparelhar de novo. */
export const MINDPRINT_UNPAIRED_CODES: MindPrintErrorCode[] = [
  "NOT_PAIRED",
  "INVALID_TOKEN",
];

/** Erros em que a impressora escolhida já não serve: pedir nova selecção. */
export const MINDPRINT_PRINTER_SELECTION_CODES: MindPrintErrorCode[] = [
  "INVALID_PRINTER",
  "PRINTER_NOT_FOUND",
  "NO_DEFAULT_PRINTER",
];

/** Erros que indicam um bug do MindGest (devem ser registados). */
export const MINDPRINT_CLIENT_BUG_CODES: MindPrintErrorCode[] = [
  "INVALID_REQUEST",
  "INVALID_DATA",
  "PAYLOAD_TOO_LARGE",
];

export const MINDPRINT_FALLBACK_MESSAGES: Partial<
  Record<MindPrintErrorCode, string>
> = {
  AGENT_UNAVAILABLE:
    "O MindPrint não respondeu. Confirme que está instalado e em execução e que o browser tem autorização para aceder a dispositivos na rede local.",
  NOT_PAIRED: "Este browser não está emparelhado com o MindPrint.",
  INVALID_TOKEN:
    "O emparelhamento com o MindPrint deixou de ser válido. Emparelhe novamente.",
  NO_PAIRING_CODE: "Peça um código no ícone do MindPrint.",
  INVALID_CODE: "Código de emparelhamento errado.",
  CODE_EXPIRED: "O código expirou. Peça um código novo no ícone do MindPrint.",
  RATE_LIMITED: "Demasiadas tentativas. Aguarde um pouco e tente novamente.",
  UNKNOWN: "Resposta inesperada do MindPrint.",
};
