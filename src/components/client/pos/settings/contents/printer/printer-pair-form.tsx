"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@/components";
import type { usePrinter } from "@/hooks/pos/use-printer";
import {
  mindprintPairSchema,
  type MindPrintPairFormData,
  type MindPrintPairFormInput,
} from "@/schemas/mindprint-schema";
import { isMindPrintError } from "@/services/mindprint-service";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import { PrinterSection } from "./printer-section";

type PrinterPairFormProps = {
  printer: ReturnType<typeof usePrinter>;
};

/** Erros que dizem respeito ao código e aparecem junto ao campo. */
const CODE_FIELD_ERRORS = ["INVALID_CODE", "CODE_EXPIRED", "NO_PAIRING_CODE"];

export function PrinterPairForm({ printer }: PrinterPairFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<MindPrintPairFormInput, unknown, MindPrintPairFormData>({
    resolver: zodResolver(mindprintPairSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async ({ code }: MindPrintPairFormData) => {
    try {
      await printer.pair(code);
      reset();
      SucessMessage("Browser emparelhado com o MindPrint.");
    } catch (error) {
      if (!isMindPrintError(error)) {
        ErrorMessage("Não foi possível emparelhar com o MindPrint.");
        return;
      }
      if (error.code === "RATE_LIMITED") {
        const wait = error.retryAfter ? ` Aguarde ${error.retryAfter} segundos.` : "";
        setError("code", { message: `${error.message}${wait}` });
        return;
      }
      if (CODE_FIELD_ERRORS.includes(error.code)) {
        setError("code", { message: error.message });
        return;
      }
      ErrorMessage(error.message);
    }
  };

  return (
    <PrinterSection title="Emparelhar este browser">
      <p className="text-xs text-muted-foreground">
        No ícone do MindPrint junto ao relógio, escolha &quot;Mostrar código de
        emparelhamento&quot; e introduza aqui os 6 dígitos. O código é válido durante 5 minutos.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 sm:items-start">
        <div className="flex-1">
          <Input
            {...register("code")}
            placeholder="000 000"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={9}
            aria-label="Código de emparelhamento"
            error={errors.code?.message}
          />
        </div>
        <Button type="submit" disabled={printer.isPairing}>
          {printer.isPairing ? "A emparelhar…" : "Emparelhar"}
        </Button>
      </form>
    </PrinterSection>
  );
}
