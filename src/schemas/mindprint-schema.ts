import { z } from "zod";

/** Código de 6 dígitos mostrado no ícone do MindPrint. Aceita "482 913" e "482-913". */
export const mindprintPairSchema = z.object({
  code: z
    .string()
    .transform((value) => value.replace(/[\s-]/g, ""))
    .pipe(z.string().regex(/^\d{6}$/, "Introduza os 6 dígitos do código")),
});

export type MindPrintPairFormInput = z.input<typeof mindprintPairSchema>;
export type MindPrintPairFormData = z.output<typeof mindprintPairSchema>;
