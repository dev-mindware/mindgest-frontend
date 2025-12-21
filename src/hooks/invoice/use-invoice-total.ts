import { useMemo } from "react";

interface UseInvoiceTotalsParams {
  items: {
    unitPrice: number;
    quantity: number;
  }[];
  tax: number;
  retention: number;
  discount: number;
}

export function useInvoiceTotals({
  items,
  tax,
  retention,
  discount,
}: UseInvoiceTotalsParams) {
  return useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    const taxAmount = subtotal * (tax / 100);
    const retentionAmount = subtotal * (retention / 100);
    const discountAmount = subtotal * (discount / 100);

    const total =
      subtotal + taxAmount - retentionAmount - discountAmount;

    return {
      subtotal,
      taxAmount,
      retentionAmount,
      discountAmount,
      total,
    };
  }, [items, tax, retention, discount]);
}
