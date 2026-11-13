import QRCode from "qrcode";

/** Imagem RGBA compatível com `ImageData` (aceite pelo encoder sem canvas). */
export type ReceiptImage = {
  data: Uint8ClampedArray;
  width: number;
  height: number;
};

const QR_QUIET_ZONE = 4;

const roundUpTo8 = (value: number) => Math.ceil(value / 8) * 8;

/**
 * Gera o código QR como imagem a preto e branco, sem canvas (funciona em
 * testes e no browser). Largura múltipla de 8 e nunca superior a `maxWidth`.
 */
export function createQrImage(value: string, maxWidth: number): ReceiptImage {
  const { modules } = QRCode.create(value, { errorCorrectionLevel: "M" });
  const modulesWithQuietZone = modules.size + QR_QUIET_ZONE * 2;
  // ~ 2/3 da largura útil: legível pelos leitores sem gastar papel a mais.
  const target = Math.floor((maxWidth * 2) / 3);
  const scale = Math.max(2, Math.min(8, Math.floor(target / modulesWithQuietZone)));

  const qrSize = modulesWithQuietZone * scale;
  const width = Math.min(roundUpTo8(qrSize), roundUpTo8(maxWidth));
  const height = qrSize;
  const offsetX = Math.floor((width - qrSize) / 2);

  const data = new Uint8ClampedArray(width * height * 4).fill(255);

  for (let row = 0; row < modules.size; row++) {
    for (let col = 0; col < modules.size; col++) {
      if (!modules.get(row, col)) continue;

      const startY = (row + QR_QUIET_ZONE) * scale;
      const startX = offsetX + (col + QR_QUIET_ZONE) * scale;

      for (let y = startY; y < startY + scale; y++) {
        for (let x = startX; x < startX + scale && x < width; x++) {
          const index = (y * width + x) * 4;
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
        }
      }
    }
  }

  return { data, width, height };
}

const LOGO_MAX_HEIGHT = 160;
const LOGO_TIMEOUT_MS = 4_000;

/**
 * Carrega o logótipo da empresa para um canvas e devolve os píxeis, com fundo
 * branco, largura múltipla de 8 e no máximo `maxWidth` pontos.
 *
 * Só no browser. Devolve `null` em qualquer falha (sem CORS, timeout, URL
 * inválido): o talão sai sem logótipo em vez de falhar a impressão.
 */
export async function loadReceiptLogo(
  url: string | null | undefined,
  maxWidth: number,
): Promise<ReceiptImage | null> {
  if (!url || typeof window === "undefined") return null;

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      const timer = window.setTimeout(() => reject(new Error("timeout")), LOGO_TIMEOUT_MS);
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        window.clearTimeout(timer);
        resolve(img);
      };
      img.onerror = () => {
        window.clearTimeout(timer);
        reject(new Error("load"));
      };
      img.src = url;
    });

    const ratio = Math.min(
      1,
      maxWidth / image.naturalWidth,
      LOGO_MAX_HEIGHT / image.naturalHeight,
    );
    const width = Math.max(8, Math.floor((image.naturalWidth * ratio) / 8) * 8);
    const height = Math.max(1, Math.round(image.naturalHeight * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    // Lança SecurityError se a imagem não tiver CORS (canvas "tainted").
    const { data } = context.getImageData(0, 0, width, height);
    return { data, width, height };
  } catch {
    return null;
  }
}
