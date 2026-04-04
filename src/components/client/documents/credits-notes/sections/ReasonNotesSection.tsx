"use client";
import { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { CreditNoteFormData } from "@/schemas";
import { RHFSelect, Textarea } from "@/components";

interface ReasonNotesSectionProps {
  control: Control<CreditNoteFormData>;
  register: UseFormRegister<CreditNoteFormData>;
  errors: FieldErrors<CreditNoteFormData>;
  isInvoiceDoc: boolean;
}

export function ReasonNotesSection({
  control,
  register,
  errors,
  isInvoiceDoc,
}: ReasonNotesSectionProps) {
  return (
    <div className="space-y-4">
      <RHFSelect
        label="Motivo"
        name="reason"
        control={control}
        options={[
          ...(isInvoiceDoc ? [{ value: "CORRECTION", label: "Correção" }] : []),
          { value: "ANNULMENT", label: "Anulação Total" },
        ]}
      />

      <Textarea
        label="Notas"
        {...register("notes")}
        error={errors?.notes?.message}
      />
    </div>
  );
}
