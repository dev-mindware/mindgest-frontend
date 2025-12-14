import { InvoiceResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { DocumentStatusBadge } from "@/components/clients/documents/common";

interface InvoiceTemplateProps {
    data: InvoiceResponse;
}

export function InvoiceTemplate({ data }: InvoiceTemplateProps) {
    return (
        <div className="space-y-6 text-sm">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">Fatura</h2>
                    <p className="text-muted-foreground">{data.number}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold">Data de Emissão</p>
                    <p>{formatDateTime(data.createdAt)}</p>
                    <p className="font-semibold mt-2">Vencimento</p>
                    <p>{formatDateTime(data.dueDate)}</p>
                </div>
            </div>

            <Separator />

            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1 text-muted-foreground">Cliente</h3>
                    <p className="font-medium text-lg">{data.client.name}</p>
                    {/* Add more client details if available in expanded data */}
                </div>
                <div className="text-right">
                    <h3 className="font-semibold mb-1 text-muted-foreground">Estado</h3>
                    <DocumentStatusBadge status={data.status} />
                </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium">Item</th>
                            <th className="px-4 py-2 text-right font-medium">Qtd</th>
                            <th className="px-4 py-2 text-right font-medium">Preço</th>
                            <th className="px-4 py-2 text-right font-medium">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {data.items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-4 py-2">{item.item.name}</td>
                                <td className="px-4 py-2 text-right">{item.quantity}</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(Number(item.price))}</td>
                                <td className="px-4 py-2 text-right">{formatCurrency(Number(item.total))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end gap-2">
                <div className="w-full sm:w-1/2 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>{formatCurrency(Number(data.subtotal))}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Desconto:</span>
                        <span>{data.discountAmount ? formatCurrency(Number(data.discountAmount)) : formatCurrency(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Imposto:</span>
                        <span>{formatCurrency(Number(data.taxAmount))}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>{formatCurrency(Number(data.total))}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            {data.notes && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-1 text-muted-foreground">Notas</h3>
                    <p className="text-muted-foreground">{data.notes}</p>
                </div>
            )}
        </div>
    );
}
