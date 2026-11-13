export function parseCurrency(value: string): number {
  const numericValue = value.replace(/\D/g, "");
  return numericValue ? parseFloat(numericValue) / 100 : 0;
}

/**
 * Abreviação compacta para eixos de gráficos (ex.: 22M Kz, 5,5M Kz, 500k Kz, 0 Kz).
 * Evita quebra de linha e distorção nos eixos laterais.
 */
export function formatAxisCurrency(
  value: number | string,
  currencyCode?: string,
): string {
  if (value === undefined || value === null || value === "") return "";
  const number = typeof value === "number" ? value : parseFloat(value.toString());
  if (isNaN(number)) return "";

  const suffix = currencyCode ? ` ${currencyCode}` : " Kz";
  const abs = Math.abs(number);

  if (abs === 0) return `0${suffix}`;

  if (abs >= 1_000_000_000) {
    const formatted = (number / 1_000_000_000).toLocaleString("pt-PT", {
      maximumFractionDigits: 1,
    });
    return `${formatted}B${suffix}`;
  }

  if (abs >= 1_000_000) {
    const formatted = (number / 1_000_000).toLocaleString("pt-PT", {
      maximumFractionDigits: 1,
    });
    return `${formatted}M${suffix}`;
  }

  if (abs >= 1_000) {
    const formatted = (number / 1_000).toLocaleString("pt-PT", {
      maximumFractionDigits: 1,
    });
    return `${formatted}k${suffix}`;
  }

  return `${number.toLocaleString("pt-PT")}${suffix}`;
}

/**
 * Como `formatCurrency`, mas sem casas decimais.
 * Para valores grandes onde os cêntimos só fazem ruído.
 */
export function formatCurrencyCompact(
  value: string | number,
  currencyCode?: string,
): string {
  if (value === undefined || value === null || value === "") return "";
  const number =
    typeof value === "number" ? value : parseFloat(value.toString());

  const suffix = currencyCode ? ` ${currencyCode}` : " Kz";

  return (
    new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      maximumFractionDigits: 0,
    }).format(number) + suffix
  );
}

/**
 * Valor com duas casas e espaço como separador de milhares, sem moeda
 * (ex.: 1 450,00). Usado nos talões térmicos, onde o espaço normal é seguro
 * em qualquer código de página da impressora.
 */
export function formatAmount(value: string | number): string {
  if (value === undefined || value === null || value === "") return "";
  const number =
    typeof value === "number" ? value : parseFloat(value.toString());
  if (isNaN(number)) return "";

  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(number)
    .replace(/\./g, " ");
}

export function formatCurrency(
  value: string | number,
  currencyCode?: string,
): string {
  if (value === undefined || value === null || value === "") return "";
  const number =
    typeof value === "number" ? value : parseFloat(value.toString());

  const suffix = currencyCode ? ` ${currencyCode}` : " Kz";

  return (
    new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number) + suffix
  );
}
