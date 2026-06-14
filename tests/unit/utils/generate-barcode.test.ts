import { generateBarcode } from "@/utils/generate-barcode";

describe("generateBarcode", () => {
  it("gera um EAN-13 numérico com dígito de controlo válido", () => {
    const barcode = generateBarcode();
    const digits = barcode.split("").map(Number);
    const checksumTotal = digits
      .slice(0, 12)
      .reduce(
        (total, digit, index) => total + digit * (index % 2 === 0 ? 1 : 3),
        0,
      );
    const expectedCheckDigit = (10 - (checksumTotal % 10)) % 10;

    expect(barcode).toMatch(/^\d{13}$/);
    expect(digits[12]).toBe(expectedCheckDigit);
  });
});
