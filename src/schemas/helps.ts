import { z } from "zod";

// After removing dots/spaces, accepts:
// - Full Angola IBAN: AO + 2 check digits + 21 numeric digits (25 chars)
// - Body only: 21 numeric digits
// - International IBAN: 2 letters country code + 2 check digits + 10 to 30 alphanumeric characters
const angolaIbanBodyRegex = /^(AO\d{2})?\d{21}$/;
const internationalIbanRegex = /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/;

/** Normalizes an IBAN by stripping dots, spaces and uppercasing. */
const normalizeIban = (value: string) =>
  value.replace(/[.\s]/g, "").toUpperCase();

const accountNumberRegex = /^\d{6,24}$/;

export const FileSchema = z.object({
  fieldname: z.string().trim().optional(),
  originalname: z.string().trim(),
  encoding: z.string().trim().optional(),
  mimetype: z.string().trim(),
  buffer: z.any().optional(),
  size: z.number(),
  url: z.string().trim().url().optional(),
});

export const ItemSchema = z.object({
  id: z.string().trim().optional(),
  description: z.string().trim().optional(),
  type: z.enum(["PRODUCT", "SERVICE"]),
  quantity: z
    .number({ invalid_type_error: "A quantidade deve ser um número" })
    .positive("A quantidade deve ser maior que 0"),
  unitPrice: z
    .number({ invalid_type_error: "O preço unitário deve ser um número" })
    .positive("O preço unitário deve ser maior que 0"),
  discount: z

    .number({ invalid_type_error: "O desconto deve ser numérico" })
    .min(0, "O desconto não pode ser negativo")
    .optional()
    .nullable(),
  total: z
    .number({ invalid_type_error: "O total deve ser um número" })
    .positive("O total deve ser maior que 0")
    .optional()
    .nullable(),

  isFromAPI: z.boolean().optional(),
  taxId: z.string().trim().optional().or(z.literal("")),
  apiId: z.string().trim().optional(),
}).superRefine((data, ctx) => {
  if (!data.isFromAPI && !data.apiId && !data.taxId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["taxId"],
      message: "Seleccione um imposto",
    });
  }
});

export const taxNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .nonempty("Campo obrigatório")
  .refine(
    (value) => /^\d{9}[A-Z]{2}\d{3}$/.test(value) || /^\d{10}$/.test(value),
    "NIF inválido. Introduza o NIF de uma pessoa singular ou colectiva.",
  );

export const optionalTaxNumberSchema = z.union([
  taxNumberSchema,
  z.literal(""),
]).optional();

export const phoneNumberSchema = z
  .string({ invalid_type_error: "Insira um número de telefone válido" })
  .trim()
  .refine(
    (value) => !value || /^\d*$/.test(value),
    "O número de telefone deve conter apenas dígitos",
  )
  .refine(
    (value) => !value || value.length === 9,
    "O número deve ter 9 dígitos",
  )
  .refine(
    (value) => !value || /^(92|99|91|95|93|94|97)\d{7}$/.test(value),
    "Insira número de telemovél válido",
  );

export const passwordSchema = z
  .string()
  .trim()
  .nonempty("Campo obrigatório")
  .min(8, "A palavra-passe deve ter, no mínimo, 8 caracteres");

export const ibanSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val === "") return true;
      const normalized = normalizeIban(val);
      return (
        angolaIbanBodyRegex.test(normalized) ||
        internationalIbanRegex.test(normalized)
      );
    },
    "IBAN inválido - utilize o formato padrão AO06.0040.0000.5660.0824.1017.4 ou IBAN internacional válido",
  );

export const accountNumberSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val) return false;
      const clean = val.replace(/[-\s.]/g, "");
      return accountNumberRegex.test(clean);
    },
    "Número da conta inválido (deve conter entre 6 e 24 dígitos)",
  );
