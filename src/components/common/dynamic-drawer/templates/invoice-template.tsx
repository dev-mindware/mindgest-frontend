import { InvoiceResponse, DocumentType } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { Separator } from "@/components/ui/separator";
import {
  DocumentStatusBadge,
  DownloadDocumentButton,
} from "@/components/client";

interface InvoiceTemplateProps {
  type: DocumentType
  data: InvoiceResponse;
  hideDueDate?: boolean;
  hideActions?: boolean;
  changeValue?: number;
}

export function InvoiceTemplate({ type, data, hideDueDate, hideActions, changeValue }: InvoiceTemplateProps) {
  return (
    <div className="space-y-6 text-sm">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">
            {data.invoiceType === "INVOICE_RECEIPT"
              ? "Fatura-Recibo"
              : data.invoiceType === "PROFORMA"
                ? "Fatura Proforma"
                : data.invoiceType === "RECEIPT"
                  ? "Recibo"
                  : data.invoiceType === "CREDIT_NOTE"
                    ? "Nota de Crédito"
                    : "Fatura"}
          </h2>
          <p className="text-muted-foreground">{data.number}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Data de Emissão</p>
          <p>{formatDateTime((data as any).issueDate || data.createdAt)}</p>
          {!hideDueDate && (data.dueDate || (data as any).proformaExpiresAt) && (
            <>
              <p className="font-semibold mt-2">Vencimento</p>
              <p>{formatDateTime(data.dueDate || (data as any).proformaExpiresAt)}</p>
            </>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-1 text-muted-foreground">Cliente</h3>
          <p className="font-medium text-lg">{data.client.name}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold mb-1 text-muted-foreground">Estado</h3>
          <DocumentStatusBadge status={data.status} />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr className="text-muted-foreground border-b">
              <th className="px-4 py-3 text-left font-medium uppercase text-[10px] tracking-wider">Item</th>
              <th className="px-4 py-3 text-right font-medium uppercase text-[10px] tracking-wider">Qtd</th>
              <th className="px-4 py-3 text-right font-medium uppercase text-[10px] tracking-wider">Preço</th>
              <th className="px-4 py-3 text-right font-medium uppercase text-[10px] tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="">
            {data.items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">
                  {item.name || (item.item as any)?.name}
                </td>
                <td className="px-4 py-3 text-right text-muted-foreground">{item.quantity}</td>
                <td className="px-4 py-3 text-right text-foreground font-mono">
                  {formatCurrency(Number(item.unitPrice || item.price), data.currencyCode)}
                </td>
                <td className="px-4 py-3 text-right text-foreground font-mono font-semibold">
                  {formatCurrency(Number(item.total), data.currencyCode)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="w-full sm:w-1/2 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Subtotal</span>
            <span className="font-mono">{formatCurrency(Number(data.subtotal), data.currencyCode)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Desconto</span>
            <span className="font-mono">
              {data.discountAmount
                ? formatCurrency(Number(data.discountAmount), data.currencyCode)
                : formatCurrency(0, data.currencyCode)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-medium">Imposto</span>
            <span className="font-mono">{formatCurrency(Number(data.taxAmount), data.currencyCode)}</span>
          </div>

          {changeValue !== undefined && changeValue > 0 && (
            <div className="flex justify-between text-green-600 font-semibold py-1">
              <span>Troco</span>
              <span className="font-mono">{formatCurrency(changeValue, data.currencyCode)}</span>
            </div>
          )}

          <Separator className="my-1" />
          <div className="flex justify-between font-bold text-lg pt-1">
            <span className="text-foreground">Total</span>
            <span className="text-primary font-mono">{formatCurrency(Number(data.total), data.currencyCode)}</span>
          </div>
        </div>
      </div>

      {data.notes && (
        <div className="mt-6">
          <h3 className="font-semibold mb-1 text-muted-foreground">Notas</h3>
          <p className="text-muted-foreground">{data.notes}</p>
        </div>
      )}
      {!hideActions && (
        <div className="flex justify-end">
          <DownloadDocumentButton
            id={data.id}
            documentType={type}
            filenameBase={data.number}
          />
        </div>
      )}
    </div>
  );
}
