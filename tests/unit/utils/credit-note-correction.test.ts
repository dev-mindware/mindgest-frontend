import { calculateCreditNoteCorrection } from "@/utils/credit-note-correction";

const originalDocument = {
  items: [
    { id: "item-1", name: "Produto A", quantity: 3, unitPrice: 100 },
  ],
  subtotal: 300,
  taxAmount: 42,
  discountAmount: 0,
};

describe("calculateCreditNoteCorrection", () => {
  it("recalcula o crédito quando a quantidade de um item é reduzida", () => {
    const result = calculateCreditNoteCorrection(originalDocument, [
      { id: "item-1", name: "Produto A", quantity: 2, price: 100 },
    ]);

    expect(result.invoiceBody.subtotal).toBe(200);
    expect(result.creditNote.subtotal).toBe(100);
    expect(result.creditNote.total).toBe(114);
    expect(result.creditNote.items[0]).toEqual(
      expect.objectContaining({ originalQuantity: 3, quantity: 2 }),
    );
  });

  it("inclui itens acrescentados no novo estado do documento", () => {
    const result = calculateCreditNoteCorrection(originalDocument, [
      { id: "item-1", name: "Produto A", quantity: 1, price: 100 },
      { id: "item-2", name: "Serviço B", quantity: 1, price: 50 },
    ]);

    expect(result.invoiceBody.subtotal).toBe(150);
    expect(result.creditNote.subtotal).toBe(150);
    expect(result.creditNote.items[1]).toEqual(
      expect.objectContaining({
        id: "item-2",
        originalQuantity: 0,
        originalPrice: 0,
        quantity: 1,
        newPrice: 50,
      }),
    );
  });

  it("regista com quantidade zero um item removido do documento", () => {
    const result = calculateCreditNoteCorrection(originalDocument, []);

    expect(result.invoiceBody.subtotal).toBe(0);
    expect(result.creditNote.subtotal).toBe(300);
    expect(result.creditNote.items[0]).toEqual(
      expect.objectContaining({
        id: "item-1",
        originalQuantity: 3,
        quantity: 0,
        newTotal: 0,
      }),
    );
  });
});
