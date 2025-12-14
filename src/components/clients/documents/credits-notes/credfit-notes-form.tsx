"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ButtonSubmit, Input, RHFSelect, Textarea } from "@/components";

import { CreditNoteSchema, CreditNoteFormData } from "@/schemas";

import { useCreateCreditNote, useAnnulationNote } from "@/hooks";

import { InvoiceDetails } from "@/types/credit-note";

type Props = {
  invoice: InvoiceDetails;
};

export function CreditNoteForm({ invoice }: Props) {
  const router = useRouter();
  const { mutateAsync: createCreditNote } = useCreateCreditNote();
  const { mutateAsync: annulationNote } = useAnnulationNote();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreditNoteFormData>({
    resolver: zodResolver(CreditNoteSchema),
    mode: "onChange",
    defaultValues: {
      reason: "CORRECTION",
      notes: "",
      invoiceBody: {
        client: {
          id: invoice.clientId,
          name: invoice.clientName,
          email:
            invoice.clientEmail ||
            `${invoice.clientName.toLowerCase()}@gmail.com`,
        },
        items: invoice.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
        total: invoice.totalAmount,
      },
    },
  });

  const reason = useWatch({ control, name: "reason" });

  /* =========================
     Reset body ao mudar motivo
     ========================= */
  useEffect(() => {
    if (reason === "ANNULATION") return;

    setValue("invoiceBody", {
      client: {
        id: invoice.clientId,
        name: invoice.clientName,
        email: invoice.clientEmail
          ? invoice.clientEmail
          : `${invoice.clientName.toLowerCase()}@gmail.com`,
      },
      items: invoice.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      subtotal: invoice.subtotal,
      taxAmount: invoice.taxAmount,
      discountAmount: invoice.discountAmount,
      total: invoice.totalAmount,
    });
  }, [reason, setValue, invoice]);

  const { fields } = useFieldArray({
    control,
    name: "invoiceBody.items",
  });

  /* =========================
     Submit
     ========================= */
  async function onSubmit(data: CreditNoteFormData) {
    try {
      if (data.reason === "ANNULATION") {
        await annulationNote({
          id: invoice.id,
          reason: data.reason,
          notes: data.notes!,
        });
      } else {
        await createCreditNote({
          id: invoice.id,
          data,
        });
      }

      router.push("/client/documents?tab=credit-notes");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao emitir nota de crédito"
      );
    }
  }

  console.log("ERROS: ");
  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 space-y-8 border rounded-lg"
    >
      {/* =========================
          Cabeçalho
         ========================= */}
      <div className="grid gap-4 md:grid-cols-2">
        <RHFSelect
          label="Motivo"
          name="reason"
          control={control}
          options={[
            { value: "CORRECTION", label: "Correção" },
            { value: "ANNULATION", label: "Anulação" },
          ]}
        />

        <Input
          type="date"
          label="Data de Emissão"
          {...register("invoiceBody.issueDate")}
          error={errors?.invoiceBody?.issueDate?.message}
          disabled={reason === "ANNULATION"}
        />
      </div>

      <Textarea
        label="Notas / Descrição"
        {...register("notes")}
        error={errors?.notes?.message}
      />

      {/* =========================
          CORRECTION
         ========================= */}
      {reason === "CORRECTION" && (
        <>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Itens</h3>

            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 md:grid-cols-3">
                <Input
                  disabled
                  label="ID"
                  {...register(`invoiceBody.items.${index}.id`)}
                />

                <Input
                  type="number"
                  label="Quantidade"
                  {...register(`invoiceBody.items.${index}.quantity`, {
                    valueAsNumber: true,
                  })}
                  error={errors.invoiceBody?.items?.[index]?.quantity?.message}
                />

                <Input
                  type="number"
                  label="Preço"
                  {...register(`invoiceBody.items.${index}.price`, {
                    valueAsNumber: true,
                  })}
                  error={errors.invoiceBody?.items?.[index]?.price?.message}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Input
              type="number"
              label="Subtotal"
              {...register("invoiceBody.subtotal", {
                valueAsNumber: true,
              })}
              error={errors.invoiceBody?.subtotal?.message}
            />

            <Input
              type="number"
              label="Imposto"
              {...register("invoiceBody.taxAmount", {
                valueAsNumber: true,
              })}
              error={errors.invoiceBody?.taxAmount?.message}
            />

            <Input
              type="number"
              label="Desconto"
              {...register("invoiceBody.discountAmount", {
                valueAsNumber: true,
              })}
              error={errors.invoiceBody?.discountAmount?.message}
            />

            <Input
              type="number"
              label="Total"
              {...register("invoiceBody.total", {
                valueAsNumber: true,
              })}
              error={errors.invoiceBody?.total?.message}
            />
          </div>
        </>
      )}

      {/* =========================
          Botão
         ========================= */}
      <div className="flex justify-end">
        <ButtonSubmit className="w-full sm:w-max" isLoading={isSubmitting}>
          {reason === "ANNULATION"
            ? "Emitir Anulação"
            : "Emitir Nota de Crédito"}
        </ButtonSubmit>
      </div>
    </form>
  );
}
