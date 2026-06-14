import { storeSchema } from "@/schemas/add-store";

const validStore = {
  name: "Loja Central",
  code: "SEDE",
  email: "loja@mindgest.ao",
  phone: "+244923000000",
  address: "Rua Principal, Luanda",
};

describe("validação de lojas", () => {
  it("aceita o código fiscal SEDE", () => {
    expect(storeSchema.safeParse(validStore).success).toBe(true);
  });

  it("exige o código do estabelecimento", () => {
    const result = storeSchema.safeParse({ ...validStore, code: "" });

    expect(result.success).toBe(false);
  });

  it("rejeita caracteres não suportados no código", () => {
    const result = storeSchema.safeParse({
      ...validStore,
      code: "LOJA 01",
    });

    expect(result.success).toBe(false);
  });
});
