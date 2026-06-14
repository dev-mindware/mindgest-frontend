import { normalizeStorePayload } from "@/services/stores-service";

describe("normalizeStorePayload", () => {
  it("normaliza o código antes do envio para a API", () => {
    const payload = normalizeStorePayload({
      name: "Loja Central",
      code: " loja-01 ",
    });

    expect(payload.code).toBe("LOJA-01");
  });

  it("utiliza SEDE quando o código recebido está vazio", () => {
    const payload = normalizeStorePayload({
      name: "Loja Central",
      code: "   ",
    });

    expect(payload.code).toBe("SEDE");
  });

  it("não acrescenta o código numa actualização parcial", () => {
    const payload = normalizeStorePayload({ name: "Novo nome" });

    expect(payload).toEqual({ name: "Novo nome" });
  });
});
