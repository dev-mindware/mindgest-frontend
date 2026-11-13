/**
 * Helpers de paginação de texto para talões de largura fixa (fonte mono).
 * Todas as funções garantem que nenhuma linha devolvida passa de `width`.
 */

export type ReceiptAlign = "left" | "right" | "center";

export type ReceiptCell = {
  text: string;
  width: number;
  align?: ReceiptAlign;
};

/**
 * Normaliza para NFC, troca pontuação tipográfica por ASCII (as impressoras
 * não a têm nos códigos de página) e quebras/tabs/controlos por espaços.
 */
export function cleanReceiptText(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .normalize("NFC")
    .replace(/[‐-―−]/g, "-")
    .replace(/[‘’‚′]/g, "'")
    .replace(/[“”„″]/g, '"')
    .replace(/…/g, "...")
    .replace(/[\u0000-\u001f\u007f  ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Quebra por palavras; palavras maiores do que `width` são partidas. */
export function wrapText(value: string, width: number): string[] {
  const text = cleanReceiptText(value);
  if (!text || width <= 0) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of text.split(" ")) {
    let rest = word;

    while (rest.length > width) {
      if (current) {
        lines.push(current);
        current = "";
      }
      lines.push(rest.slice(0, width));
      rest = rest.slice(width);
    }

    if (!rest) continue;

    if (!current) {
      current = rest;
    } else if (current.length + 1 + rest.length <= width) {
      current += ` ${rest}`;
    } else {
      lines.push(current);
      current = rest;
    }
  }

  if (current || lines.length === 0) lines.push(current);
  return lines;
}

/** Texto multi-parágrafo (respeita as quebras de linha originais). */
export function wrapParagraphs(value: string, width: number): string[] {
  return String(value ?? "")
    .split(/\r?\n/)
    .flatMap((paragraph) =>
      cleanReceiptText(paragraph) ? wrapText(paragraph, width) : [],
    );
}

export function alignText(text: string, width: number, align: ReceiptAlign = "left"): string {
  const value = text.slice(0, width);
  const gap = width - value.length;
  if (align === "right") return " ".repeat(gap) + value;
  if (align === "center") {
    const left = Math.floor(gap / 2);
    return " ".repeat(left) + value + " ".repeat(gap - left);
  }
  return value + " ".repeat(gap);
}

/**
 * Linhas de uma "tabela" de células com larguras fixas, separadas por um espaço.
 * Cada célula quebra por palavras; a linha termina sem espaços à direita.
 */
export function columns(cells: ReceiptCell[]): string[] {
  const wrapped = cells.map((cell) => wrapText(cell.text, cell.width));
  const height = Math.max(...wrapped.map((lines) => lines.length));
  const lines: string[] = [];

  for (let row = 0; row < height; row++) {
    const parts = cells.map((cell, index) =>
      alignText(wrapped[index][row] ?? "", cell.width, cell.align),
    );
    lines.push(parts.join(" ").trimEnd());
  }

  return lines;
}

/**
 * "Rótulo ........ valor" numa largura. O valor nunca é partido; se não couber
 * na mesma linha, o rótulo fica numa linha e o valor alinhado à direita na seguinte.
 */
export function labelValue(label: string, value: string, width: number): string[] {
  const cleanLabel = cleanReceiptText(label);
  const cleanValue = cleanReceiptText(value);

  if (cleanLabel.length + 1 + cleanValue.length <= width) {
    return [
      cleanLabel + " ".repeat(width - cleanLabel.length - cleanValue.length) + cleanValue,
    ];
  }

  return [
    ...wrapText(cleanLabel, width),
    ...wrapText(cleanValue, width).map((line) => alignText(line, width, "right")),
  ];
}

/** "Rótulo: valor" com quebra por palavras. */
export function field(label: string, value: string | null | undefined, width: number): string[] {
  const clean = cleanReceiptText(value);
  if (!clean) return [];
  return wrapText(`${label}: ${clean}`, width);
}
