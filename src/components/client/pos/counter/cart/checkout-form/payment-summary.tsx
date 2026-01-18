import { formatCurrency } from "@/utils";

interface PaymentSummaryProps {
    subtotal: number;
    total: number;
    change: number;
    paymentMethod: "Cash" | "Credit Card";
}

export function PaymentSummary({ subtotal, total, change, paymentMethod }: PaymentSummaryProps) {
    return (
        <>
            <h3 className="font-bold mb-3">Resumo de Pagamento</h3>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">
                        {formatCurrency(subtotal)}
                    </span>
                </div>
                {change > 0 && paymentMethod === "Cash" && (
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                        <span>Troco</span>
                        <span>{formatCurrency(change)}</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-base font-bold mb-6 border-t border-dashed pt-2">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
            </div>
        </>
    );
}
