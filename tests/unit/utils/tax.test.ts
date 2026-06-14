import { createTaxOptions, sortTaxesNewestFirst } from "@/utils/tax";
import type { Tax } from "@/types";

function createTax(overrides: Partial<Tax>): Tax {
  return {
    id: "tax-id",
    name: "IVA",
    type: "PERCENTAGE",
    rate: 14,
    description: "Imposto sobre o valor acrescentado",
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("opções de impostos", () => {
  const olderTax = createTax({
    id: "older",
    name: "Imposto antigo",
    createdAt: "2025-01-01T00:00:00.000Z",
  });
  const newerTax = createTax({
    id: "newer",
    name: "Imposto recente",
    description: "Descrição do imposto recente",
    createdAt: "2026-01-01T00:00:00.000Z",
  });

  it("ordena os impostos do mais recente para o mais antigo", () => {
    expect(sortTaxesNewestFirst([olderTax, newerTax]).map((tax) => tax.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("inclui a descrição nas opções apresentadas", () => {
    expect(createTaxOptions([newerTax])[0]).toEqual({
      label: "Imposto recente (14%)",
      value: "newer",
      description: "Descrição do imposto recente",
    });
  });
});
