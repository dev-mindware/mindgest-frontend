import { clientSchema } from "@/schemas/add-client";
import { CorrectionSchema } from "@/schemas/add-credit-note";
import { companySchema } from "@/schemas/company";
import { ClientSchema as EditProformaClientSchema } from "@/schemas/edit-proforma";
import {
  optionalTaxNumberSchema,
  taxNumberSchema,
} from "@/schemas/helps";

describe("validação de NIF", () => {
  const companyTaxNumber = "500123456LA001";
  const personalTaxNumber = "1234567890";

  it.each([companyTaxNumber, personalTaxNumber])(
    "aceita o NIF empresarial ou particular: %s",
    (taxNumber) => {
      expect(taxNumberSchema.safeParse(taxNumber).success).toBe(true);
    },
  );

  it("normaliza as letras do NIF empresarial", () => {
    expect(taxNumberSchema.parse("500123456la001")).toBe(companyTaxNumber);
  });

  it.each(["123456789", "12345678901", "500123456L001", "ABCDEFGHIJ"])(
    "rejeita um NIF inválido: %s",
    (taxNumber) => {
      expect(taxNumberSchema.safeParse(taxNumber).success).toBe(false);
    },
  );

  it("permite NIF vazio apenas nos campos opcionais", () => {
    expect(optionalTaxNumberSchema.safeParse("").success).toBe(true);
    expect(taxNumberSchema.safeParse("").success).toBe(false);
  });

  it("aplica a validação comum no registo da actividade e no cliente", () => {
    const company = {
      taxNumber: personalTaxNumber,
      name: "Manuel António",
      address: "Luanda",
      phone: "923456789",
      email: "manuel@example.com",
    };
    const client = {
      name: "Cliente Particular",
      taxNumber: personalTaxNumber,
      phone: "923456789",
      email: "cliente@example.com",
      address: "Luanda",
    };

    expect(companySchema.safeParse(company).success).toBe(true);
    expect(clientSchema.safeParse(client).success).toBe(true);
  });

  it("aplica a validação comum à edição de proforma e à nota de crédito", () => {
    expect(
      EditProformaClientSchema.safeParse({
        name: "Cliente Particular",
        phone: "923456789",
        address: "Luanda",
        taxNumber: "NIF-INVALIDO",
      }).success,
    ).toBe(false);

    const creditNoteTaxNumberSchema =
      CorrectionSchema.shape.invoiceBody.shape.client.shape.taxNumber;

    expect(creditNoteTaxNumberSchema.safeParse(personalTaxNumber).success).toBe(
      true,
    );
    expect(creditNoteTaxNumberSchema.safeParse("NIF-INVALIDO").success).toBe(
      false,
    );
  });
});
