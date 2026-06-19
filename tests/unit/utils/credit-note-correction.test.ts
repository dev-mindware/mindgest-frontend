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

  it("usa o subtotal dos itens, não o subtotal guardado quando divergem", () => {
    // Factura com subtotal guardado errado (50) mas itens que somam 450.
    const staleDocument = {
      items: [
        { id: "item-1", name: "Produto A", quantity: 9, unitPrice: 50, tax: 14 },
      ],
      subtotal: 50, // desactualizado
      taxAmount: 7, // 50 * 14% (também desactualizado, mas a razão 14% mantém-se)
      discountAmount: 0,
    };

    // Remove o item: o crédito deve ser o valor real dos itens (450), não 50.
    const result = calculateCreditNoteCorrection(staleDocument, []);

    expect(result.creditNote.subtotal).toBe(450);
    expect(result.creditNote.taxAmount).toBe(63);
    expect(result.creditNote.total).toBe(513);
  });

  it("aplica a taxa de imposto de cada item quando há taxas diferentes", () => {
    // item-1 a 14%, item-2 isento (0%) — art. 10.º n.º 2 do D.P. 71/25.
    const mixedDocument = {
      items: [
        { id: "item-1", name: "Produto A", quantity: 2, unitPrice: 100, tax: 14 },
        { id: "item-2", name: "Serviço B", quantity: 1, unitPrice: 100, tax: 0 },
      ],
      subtotal: 300,
      taxAmount: 28, // 200 * 14% + 100 * 0%
      discountAmount: 0,
    };

    // Reduz o item-1 para 1 unidade; o item-2 mantém-se.
    const result = calculateCreditNoteCorrection(mixedDocument, [
      { id: "item-1", name: "Produto A", quantity: 1, price: 100, tax: 14 },
      { id: "item-2", name: "Serviço B", quantity: 1, price: 100, tax: 0 },
    ]);

    // Documento corrigido: subtotal 200, imposto 14 (100*14% + 100*0%).
    expect(result.invoiceBody.subtotal).toBe(200);
    expect(result.invoiceBody.taxAmount).toBe(14);
    // Crédito: subtotal 100, imposto 14 (a parte retirada é toda do item a 14%).
    expect(result.creditNote.subtotal).toBe(100);
    expect(result.creditNote.taxAmount).toBe(14);
    expect(result.creditNote.total).toBe(114);
  });
});
