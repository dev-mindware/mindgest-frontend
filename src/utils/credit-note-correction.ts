type OriginalItem = {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

type CorrectedItem = {
  id: string;
  name?: string;
  quantity: number;
  price: number;
};

type CorrectionTotalsInput = {
  items: OriginalItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
};

export function calculateCreditNoteCorrection(
  original: CorrectionTotalsInput,
  correctedItems: CorrectedItem[],
) {
  const correctedSubtotal = correctedItems.reduce(
    (total, item) => total + Number(item.quantity || 0) * Number(item.price || 0),
    0,
  );
  const base = original.subtotal || 1;
  const taxRate = original.taxAmount / base;
  const discountRate = original.discountAmount / base;
  const correctedTax = correctedSubtotal * taxRate;
  const correctedDiscount = correctedSubtotal * discountRate;
  const correctedTotal = correctedSubtotal + correctedTax - correctedDiscount;

  const allItemIds = new Set([
    ...original.items.map(({ id }) => id),
    ...correctedItems.map(({ id }) => id),
  ]);
  const deltaItems = Array.from(allItemIds).map((itemId) => {
    const item = correctedItems.find(({ id }) => id === itemId);
    const originalItem = original.items.find(({ id }) => id === itemId);
    const originalPrice = Number(originalItem?.unitPrice || 0);
    const originalQuantity = Number(originalItem?.quantity || 0);
    const originalTotal = originalPrice * originalQuantity;
    const newPrice = Number(item?.price || 0);
    const newQuantity = Number(item?.quantity || 0);
    const newTotal = newPrice * newQuantity;

    return {
      id: itemId,
      itemsId: itemId,
      itemName: item?.name || originalItem?.name || "Item",
      originalPrice,
      newPrice,
      originalQuantity,
      quantity: newQuantity,
      originalTotal,
      newTotal,
      originalTaxAmount: originalTotal * taxRate,
      newTaxAmount: newTotal * taxRate,
    };
  });

  const creditSubtotal = Math.max(0, original.subtotal - correctedSubtotal);

  return {
    invoiceBody: {
      subtotal: Number(correctedSubtotal.toFixed(2)),
      taxAmount: Number(correctedTax.toFixed(2)),
      discountAmount: Number(correctedDiscount.toFixed(2)),
      total: Number(correctedTotal.toFixed(2)),
    },
    creditNote: {
      subtotal: Number(creditSubtotal.toFixed(2)),
      taxAmount: Number((creditSubtotal * taxRate).toFixed(2)),
      discountAmount: Number((creditSubtotal * discountRate).toFixed(2)),
      total: Number(
        (creditSubtotal * (1 + taxRate - discountRate)).toFixed(2),
      ),
      items: deltaItems,
    },
  };
}
