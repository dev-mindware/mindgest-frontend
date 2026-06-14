import { ItemSchema } from "@/schemas/helps";
import { itemSchema } from "@/schemas/item-schema";

describe("imposto obrigatório nos itens", () => {
  it("rejeita a criação de produto sem imposto", () => {
    const result = itemSchema.safeParse({
      name: "Produto",
      price: 1000,
      type: "PRODUCT",
      categoryId: "category-id",
      taxId: "",
    });

    expect(result.success).toBe(false);
  });

  it("aceita a criação de produto com imposto", () => {
    const result = itemSchema.safeParse({
      name: "Produto",
      price: 1000,
      type: "PRODUCT",
      categoryId: "category-id",
      taxId: "tax-id",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita um item de documento sem imposto", () => {
    const result = ItemSchema.safeParse({
      description: "Produto",
      type: "PRODUCT",
      quantity: 1,
      unitPrice: 1000,
      taxId: "",
    });

    expect(result.success).toBe(false);
  });
});
