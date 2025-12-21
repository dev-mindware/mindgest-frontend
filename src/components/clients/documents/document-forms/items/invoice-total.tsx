import { Separator } from "@/components";
import { formatCurrency } from "@/utils";

interface Props {
  totals: {
    subtotal: number;
    taxAmount: number;
    retentionAmount: number;
    discountAmount: number;
    total: number;
  };
}

export function InvoiceTotals({ totals }: Props) {
  return (
    <div className="w-full sm:w-96 p-6 border rounded-lg bg-card space-y-3">
      <Row label="Subtotal" value={totals.subtotal} />

      <Row label="IVA" value={totals.taxAmount} positive />
      <Row label="Retenção" value={-totals.retentionAmount} />
      <Row label="Desconto" value={-totals.discountAmount} />

      <Separator />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">
          {formatCurrency(totals.total)}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  positive,
}: {
  label: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        value < 0
          ? "text-red-600"
          : positive
          ? "text-green-600"
          : ""
      }`}
    >
      <span>{label}</span>
      <span className="font-mono">
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
