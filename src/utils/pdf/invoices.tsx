import { TDocumentDefinitions, Style } from "pdfmake/interfaces";
import { CompanyFormData, InvoiceFormData, ProformaFormData, ReceiptFormData } from "@/schemas";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { convertImageToBase64 } from "./convert-img-to-blod";
(pdfMake as any).addVirtualFileSystem(pdfFonts);

async function buildHeader(company?: CompanyFormData) {
  const logoBase64 = await convertImageToBase64("/logo.png");

  return {
    columns: [
      logoBase64
        ? { image: logoBase64, width: 80, alignment: 'left' }
        : { text: "LOGO", fontSize: 18, bold: true, alignment: 'left' },
      {
        stack: [
          { text: company?.name || "Nome da Empresa", style: "header" },
          { text: `NIF: ${company?.vatNumber || "----"}` },
          { text: company?.address || "Endereço da empresa" },
          company?.contact?.phone && { text: `Tel: ${company.contact.phone}` },
          company?.contact?.email && { text: `Email: ${company.contact.email}` },
        ].filter(Boolean),
        alignment: 'right'
      }
    ],
    margin: [0, 0, 0, 20]
  };
}

const styles: { [key: string]: Style } = {
  header: { fontSize: 14, bold: true },
  tableHeader: { bold: true, fillColor: "#f3f4f6" },
  total: { fontSize: 12, bold: true, alignment: 'right' as const },
};

function buildItemsTable(items: any[]) {
  const body = [
    [
      { text: "Descrição", style: "tableHeader" },
      { text: "Qtd", style: "tableHeader" },
      { text: "Preço Unit.", style: "tableHeader" },
      { text: "IVA", style: "tableHeader" },
      { text: "Total", style: "tableHeader" },
    ],
    ...items.map(item => [
      item.description || "-",
      item.quantity,
      `${item.unitPrice.toFixed(2)} Kz`,
      `${item.tax}%`,
      `${item.total.toFixed(2)} Kz`,
    ])
  ];

  return {
    table: {
      headerRows: 1,
      widths: ['*', 'auto', 'auto', 'auto', 'auto'],
      body
    },
    layout: {
      hLineWidth: function (i: number, node: any) {
        return (i === 0 || i === node.table.body.length) ? 1 : 0;
      },
      vLineWidth: () => 0,
      fillColor: (i: number) => i % 2 ? '#f5f5f5' : null
    },
    margin: [0, 0, 0, 20]
  };
}

function buildTotals(totals: any) {
  return {
    table: {
      widths: ['*', 'auto'],
      body: [
        ["Subtotal", `${totals.subtotal.toFixed(2)} Kz`],
        ["IVA Total", `${totals.totalTax.toFixed(2)} Kz`],
        [
          { text: "Total a Pagar", style: "total" },
          { text: `${totals.totalDue.toFixed(2)} Kz`, style: "total" }
        ],
      ],
    },
    layout: 'noBorders',
    alignment: 'right'
  };
}

export async function generateInvoicePDF(invoice: InvoiceFormData): Promise<any> {
  const header = await buildHeader(invoice.company);

  return {
    content: [
      header,
      { text: "FATURA", style: "header", alignment: "center", margin: [0, 0, 0, 20] },
      {
        columns: [
          {
            stack: [
              { text: "Cliente:", style: "tableHeader" },
              { text: invoice.customer.name },
              { text: invoice.customer.address },
              ...(invoice.customer.vatNumber ? [{ text: `NIF: ${invoice.customer.vatNumber}` }] : [])
            ].filter(Boolean)
          },
          {
            stack: [
              { text: `Nº Documento: ${invoice.documentNumber}` },
              { text: `Data Emissão: ${invoice.issueDate}` },
              { text: `Data Vencimento: ${invoice.dueDate}` },
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      buildItemsTable(invoice.items),
      buildTotals(invoice.totals),
      { text: "Método de Pagamento", style: "header", margin: [0, 20, 0, 5] },
      { text: invoice.payment.method },
      ...(invoice.payment.bankDetails ? [{ text: `Detalhes bancários: ${invoice.payment.bankDetails}` }] : [])
    ].filter(Boolean),
    styles,
    defaultStyle: { fontSize: 10 }
  };
}

export async function generateProformaPDF(proforma: ProformaFormData): Promise<any> {
  const header = await buildHeader(proforma.company);

  return {
    content: [
      header,
      { text: "PROFORMA", style: "header", alignment: "center", margin: [0, 0, 0, 20] },
      {
        columns: [
          {
            stack: [
              { text: "Cliente:", style: "tableHeader" },
              { text: proforma.customer.name || '' },
              { text: proforma.customer.address || '' },
              ...(proforma.customer.vatNumber ? [{ text: `NIF: ${proforma.customer.vatNumber}` }] : [])
            ].filter(Boolean)
          },
          {
            stack: [
              { text: `Nº Documento: ${proforma.documentNumber}` },
              { text: `Data Emissão: ${proforma.issueDate}` }
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      buildItemsTable(proforma.items),
      buildTotals(proforma.totals),
      ...(proforma.payment ? [
        { text: "Método de Pagamento", style: "header", margin: [0, 20, 0, 5] },
        { text: proforma.payment.method },
        ...(proforma.payment.bankDetails ? [{ text: `Detalhes bancários: ${proforma.payment.bankDetails}` }] : [])
      ] : [])
    ].filter(Boolean),
    styles,
    defaultStyle: { fontSize: 10 }
  };
}

export async function generateReceiptPDF(receipt: ReceiptFormData): Promise<any> {
  const header = await buildHeader(receipt.company);

  return {
    content: [
      header,
      { text: "RECIBO", style: "header", alignment: "center", margin: [0, 0, 0, 20] },
      {
        columns: [
          {
            stack: receipt.customer ? [
              { text: "Cliente:", style: "tableHeader" },
              { text: receipt.customer.name },
              { text: receipt.customer.address },
              ...(receipt.customer.vatNumber ? [{ text: `NIF: ${receipt.customer.vatNumber}` }] : [])
            ].filter(Boolean) : []
          },
          {
            stack: [
              { text: `Nº Documento: ${receipt.documentNumber}` },
              { text: `Data Emissão: ${receipt.issueDate}` },
              { text: `Ref. Fatura: ${receipt.referenceInvoice}` },
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      ...(receipt.items && receipt.items.length > 0 ? [buildItemsTable(receipt.items)] : []),
      {
        table: {
          widths: ['*', 'auto'],
          body: [
            [
              { text: "Total Pago", style: "total" },
              { text: `${receipt.totals.totalDue.toFixed(2)} Kz`, style: "total" }
            ],
            ["Forma de Pagamento", receipt.payment?.method || "-"],
          ]
        },
        layout: 'lightHorizontalLines',
        margin: [0, 20, 0, 0]
      }
    ].filter(Boolean),
    styles,
    defaultStyle: { fontSize: 10 }
  };
}

export async function handleDownloadInvoice(invoiceData: InvoiceFormData) {
  const docDefinition = await generateInvoicePDF(invoiceData);
  pdfMake.createPdf(docDefinition).download(`fatura-${invoiceData.documentNumber}.pdf`);
}

export async function handleDownloadProforma(proformaData: ProformaFormData) {
  const docDefinition = await generateProformaPDF(proformaData);
  pdfMake.createPdf(docDefinition).download(`proforma-${proformaData.documentNumber}.pdf`);
}

export async function handleDownloadReceipt(receiptData: ReceiptFormData) {
  const docDefinition = await generateReceiptPDF(receiptData);
  pdfMake.createPdf(docDefinition).download(`recibo-${receiptData.documentNumber}.pdf`);
}