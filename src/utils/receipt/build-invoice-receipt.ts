import ReceiptPrinterEncoder from "@point-of-sale/receipt-printer-encoder";
import { PAPER_COLUMNS, PAPER_MAX_IMAGE_WIDTH } from "@/constants/mindprint";
import type { InvoiceReceiptPrintData, PaperWidth } from "@/types";
import { formatAmount } from "../format-currency";
import { formatDateTimeRaw } from "../format-date";
import { createQrImage, type ReceiptImage } from "./receipt-images";
import {
  cleanReceiptText,
  columns,
  field,
  labelValue,
  wrapParagraphs,
  wrapText,
} from "./receipt-text";

export type InvoiceReceiptOptions = {
  paperWidth: PaperWidth;
  /** Logótipo já carregado (ver `loadReceiptLogo`). Opcional. */
  logo?: ReceiptImage | null;
};

const FEED_BEFORE_CUT = 4;
const MIN_DESCRIPTION_WIDTH = 16;

function formatQuantity(value: number | string): string {
  const number = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(number)) return cleanReceiptText(value);
  return Number.isInteger(number)
    ? String(number)
    : number.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}

const maxLength = (values: string[], minimum: number) =>
  Math.max(minimum, ...values.map((value) => value.length));

/**
 * Monta o encoder com o talão da Factura Recibo, pela mesma ordem do documento
 * legal. Exposto à parte de `buildInvoiceReceipt` para os testes poderem ler
 * as linhas geradas (`encoder.commands()`).
 *
 * Os campos legais (hash, n.º de certificação, QR, NIF) são impressos tal como
 * vêm do backend: nada é recalculado aqui.
 */
export function createInvoiceReceiptEncoder(
  data: InvoiceReceiptPrintData,
  { paperWidth, logo }: InvoiceReceiptOptions,
): ReceiptPrinterEncoder {
  const width = PAPER_COLUMNS[paperWidth];
  const maxImageWidth = PAPER_MAX_IMAGE_WIDTH[paperWidth];
  const currency = cleanReceiptText(data.currencyCode) || "Kz";

  const encoder = new ReceiptPrinterEncoder({
    language: "esc-pos",
    columns: width,
    codepageMapping: "xprinter",
    imageMode: "raster",
    feedBeforeCut: FEED_BEFORE_CUT,
  });

  const lines = (values: string[]) => {
    values.forEach((value) => encoder.line(value));
    return encoder;
  };
  const rule = () => encoder.line("-".repeat(width));
  const heading = (value: string) =>
    encoder.bold(true).line(cleanReceiptText(value).slice(0, width)).bold(false);

  encoder.initialize().codepage("auto");

  // Logótipo
  if (logo) {
    encoder
      .align("center")
      .image(logo, logo.width, logo.height, "atkinson")
      .newline();
  }

  // Cabeçalho
  encoder.align("center").bold(true);
  lines(wrapText(data.title || "FACTURA RECIBO", width));
  encoder.bold(false);
  lines(wrapText(data.number, width));
  encoder.align("left").newline();

  lines(field("Data de emissão", formatDateTimeRaw(data.issueDate), width));
  lines(field("Período contabilístico", data.accountingPeriod, width));
  rule();

  // DE
  heading("DE");
  lines(wrapText(data.company.name, width));
  lines(field("E-mail", data.company.email, width));
  lines(field("Telefone", data.company.phone, width));
  lines(field("Morada", data.company.address, width));
  lines(field("NIF", data.company.taxNumber, width));
  encoder.newline();

  // PARA
  heading("PARA");
  lines(wrapText(data.client.name || "Consumidor Final", width));
  lines(field("NIF", data.client.taxNumber, width));
  rule();

  // Linhas: Descrição / Taxa/Imp / Total, com "qtd x preço" por baixo
  const itemTotals = data.items.map((item) => formatAmount(item.total));
  const totalWidth = maxLength(itemTotals, "Total".length);
  const taxWidth = Math.min(
    maxLength(data.items.map((item) => cleanReceiptText(item.taxLabel)), "Taxa/Imp".length),
    10,
  );
  const descriptionWidth = width - totalWidth - taxWidth - 2;
  // Em papel estreito a descrição ocuparia demasiadas linhas numa coluna
  // apertada: passa a ter a largura toda e os valores vêm na linha de baixo.
  const stacked = descriptionWidth < MIN_DESCRIPTION_WIDTH;
  const itemColumns = (description: string, tax: string, total: string) =>
    columns([
      { text: description, width: descriptionWidth },
      { text: tax, width: taxWidth, align: "right" },
      { text: total, width: totalWidth, align: "right" },
    ]);

  encoder.bold(true);
  lines(itemColumns("Descrição", "Taxa/Imp", "Total"));
  encoder.bold(false);
  rule();

  data.items.forEach((item, index) => {
    const quantityPrice = `${formatQuantity(item.quantity)} x ${formatAmount(item.unitPrice)}`;
    if (stacked) {
      lines(wrapText(item.description, width));
      lines(
        labelValue(
          `  ${quantityPrice}`,
          `${cleanReceiptText(item.taxLabel)}  ${itemTotals[index]}`,
          width,
        ),
      );
      return;
    }
    lines(itemColumns(item.description, item.taxLabel, itemTotals[index]));
    lines(wrapText(`  ${quantityPrice}`, width));
  });
  rule();

  // Quadro de impostos
  if (data.taxes.length > 0) {
    const incidences = data.taxes.map((tax) => formatAmount(tax.incidence));
    const amounts = data.taxes.map((tax) => formatAmount(tax.amount));
    const incidenceWidth = maxLength(incidences, "Incidência".length);
    const amountWidth = maxLength(amounts, "Valor Imp.".length);
    const labelWidth = width - incidenceWidth - amountWidth - 2;
    const taxColumns = (label: string, incidence: string, amount: string) =>
      columns([
        { text: label, width: labelWidth },
        { text: incidence, width: incidenceWidth, align: "right" },
        { text: amount, width: amountWidth, align: "right" },
      ]);
    const taxHeader = "Imposto/Taxa".length <= labelWidth ? "Imposto/Taxa" : "Imp./Taxa";

    encoder.bold(true);
    lines(taxColumns(taxHeader, "Incidência", "Valor Imp."));
    encoder.bold(false);
    data.taxes.forEach((tax, index) =>
      lines(taxColumns(tax.label, incidences[index], amounts[index])),
    );
    data.taxes.forEach((tax) => {
      if (cleanReceiptText(tax.note)) lines(wrapText(tax.note ?? "", width));
    });
    rule();
  }

  // Totais
  const discount = Number(data.discountAmount ?? 0);
  const retention = Number(data.retentionAmount ?? 0);
  lines(labelValue("Subtotal", formatAmount(data.subtotal), width));
  if (discount > 0) lines(labelValue("Desconto", `-${formatAmount(discount)}`, width));
  lines(labelValue("Impostos", formatAmount(data.taxAmount), width));
  if (retention > 0) {
    lines(labelValue("Retenção na fonte", `-${formatAmount(retention)}`, width));
  }

  // TOTAL em tamanho duplo; se não couber em metade das colunas, só altura dupla.
  const totalValue = `${formatAmount(data.total)} ${currency}`;
  const doubleWidthFits = "TOTAL".length + 1 + totalValue.length <= Math.floor(width / 2);
  encoder.bold(true);
  if (doubleWidthFits) {
    encoder.size(2, 2);
    lines(labelValue("TOTAL", totalValue, Math.floor(width / 2)));
  } else {
    encoder.size(1, 2);
    lines(labelValue("TOTAL", totalValue, width));
  }
  encoder.size(1, 1).bold(false);
  rule();

  lines(field("Emitido por", data.issuedBy, width));

  if (cleanReceiptText(data.notes)) {
    encoder.newline();
    heading("Notas");
    lines(wrapParagraphs(data.notes ?? "", width));
  }

  if (cleanReceiptText(data.paymentTerms)) {
    encoder.newline();
    heading("Condições de Pagamento");
    lines(wrapParagraphs(data.paymentTerms ?? "", width));
  }

  // QR (como imagem), hash e certificação
  encoder.newline().align("center");
  if (data.qrCode) {
    const qr = createQrImage(data.qrCode, maxImageWidth);
    encoder.image(qr, qr.width, qr.height, "threshold", 128).newline();
  }
  lines(field("Hash", data.hash, width));
  lines(
    wrapText(
      `Processado por programa certificado n.º ${cleanReceiptText(data.certificationNumber)}`,
      width,
    ),
  );

  // Rodapé
  const footer = (data.footer ?? []).flatMap((line) => wrapText(line, width));
  if (footer.length > 0) {
    encoder.newline();
    lines(footer);
  }

  encoder.align("left").cut("partial");
  return encoder;
}

/** Bytes ESC/POS do talão da Factura Recibo, prontos para o MindPrint. */
export function buildInvoiceReceipt(
  data: InvoiceReceiptPrintData,
  options: InvoiceReceiptOptions,
): Uint8Array {
  return createInvoiceReceiptEncoder(data, options).encode();
}
