"use client";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonSubmit, Input, RHFSelect, Textarea } from "@/components";
import { CreditNoteSchema, CreditNoteFormData } from "@/schemas";
import { useCreateCreditNote, useAnnulationNote } from "@/hooks";
import { InvoiceDetails } from "@/types/credit-note";
import { formatCurrency } from "@/utils";

type Props = {
  invoice: InvoiceDetails;
};

export function CreditNoteForm({ invoice }: Props) {
  const router = useRouter();
  const { mutateAsync: annulationNote } = useAnnulationNote();
  const { mutateAsync: createCreditNote } = useCreateCreditNote();
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
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: invoice.dueDate,
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
        total: invoice.totalAmount,
      },
    },
  });

  const reason = useWatch({ control, name: "reason" });
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });

  useEffect(() => {
    if (reason === "ANNULATION") return;

    const subtotal = watchedItems?.reduce((acc, item) => {
      return acc + (Number(item.quantity) || 0) * (Number(item.price) || 0);
    }, 0);

    const originalSubtotal = subtotal || 1;
    const taxRate = invoice.taxAmount / originalSubtotal;
    const discountRate = invoice.discountAmount / originalSubtotal;

    const newTaxAmount = subtotal! * taxRate;
    const newDiscountAmount = subtotal! * discountRate;
    const newTotal = subtotal! + newTaxAmount - newDiscountAmount;

    setValue("invoiceBody.subtotal", Number(subtotal!.toFixed(2)));
    setValue("invoiceBody.taxAmount", Number(newTaxAmount.toFixed(2)));
    setValue(
      "invoiceBody.discountAmount",
      Number(newDiscountAmount.toFixed(2))
    );
    setValue("invoiceBody.total", Number(newTotal.toFixed(2)));
  }, [watchedItems, reason, setValue, invoice]);

  const { fields } = useFieldArray({
    control,
    name: "invoiceBody.items",
  });

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
      setTimeout(() => {
        router.replace("/client/documents?tab=credit-notes");
      }, 1500);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao emitir nota de crédito"
      );
    }
  }
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 space-y-8 border rounded-lg"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RHFSelect
          label="Motivo (Obrigatório)"
          name="reason"
          control={control}
          options={[
            { value: "CORRECTION", label: "Correção de Itens/Preços" },
            { value: "ANNULATION", label: "Anulação Total" },
          ]}
        />

        <Input
          type="date"
          label="Data de Emissão da Nota"
          {...register("invoiceBody.issueDate")}
          error={errors?.invoiceBody?.issueDate?.message}
          min={invoice.issueDate.split("T")[0]}
        />
      </div>

      <Textarea
        label="Notas / Motivo Detalhado"
        {...register("notes")}
        error={errors?.notes?.message}
        placeholder="Explique o motivo desta retificação..."
      />

      {reason === "CORRECTION" && (
        <div className="animate-in fade-in duration-500 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Itens para Retificação
            </h3>
            <p className="text-sm text-gray-500">
              Ajuste as quantidades ou preços para gerar o crédito parcial.
            </p>

            {fields.map((field, index) => {
              const originalItem = invoice.items[index];
              return (
                <div
                  key={field.id}
                  className="grid gap-4 md:grid-cols-3 p-4 border rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400">
                      ID DO ITEM
                    </span>
                    <span className="text-sm py-2 font-mono">
                      {originalItem.id}
                    </span>
                  </div>

                  <Input
                    type="number"
                    label={`Qtd (Máx: ${originalItem.quantity})`}
                    {...register(`invoiceBody.items.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    error={
                      errors.invoiceBody?.items?.[index]?.quantity?.message
                    }
                  />

                  <Input
                    type="number"
                    label={`Preço Unit. (Máx: ${formatCurrency(
                      originalItem.unitPrice
                    )})`}
                    {...register(`invoiceBody.items.${index}.price`, {
                      valueAsNumber: true,
                    })}
                    error={errors.invoiceBody?.items?.[index]?.price?.message}
                  />
                </div>
              );
            })}
          </div>
          <div className="grid gap-6 md:grid-cols-4 p-4 rounded-lg border border-border">
            <Input
              type="number"
              label="Subtotal Calculado"
              {...register("invoiceBody.subtotal", {
                valueAsNumber: true,
              })}
              readOnly
            />

            <Input
              type="number"
              label="Imposto"
              {...register("invoiceBody.taxAmount")}
              readOnly
            />

            <Input
              min={0}
              max={100}
              type="number"
              label="Desconto"
              {...register("invoiceBody.discountAmount")}
              readOnly
            />

            <Input
              type="number"
              label="Total de Crédito"
              {...register("invoiceBody.total")}
              className="font-bold text-blue-700"
              readOnly
            />
          </div>
        </div>
      )}

      {reason === "ANNULATION" && (
        <div className="p-4 bg-card border border-border rounded-lg text-primary">
          <strong>Atenção:</strong> A anulação total cancela todos os valores da
          fatura original e não permite edição de itens.
        </div>
      )}

      <div className="flex justify-end pt-4">
        <ButtonSubmit
          className={`w-full sm:w-max ${
            reason === "ANNULATION" ? "bg-red-600 hover:bg-red-700" : ""
          }`}
          isLoading={isSubmitting}
        >
          {reason === "ANNULATION"
            ? "Confirmar Anulação Total"
            : "Emitir Nota de Crédito"}
        </ButtonSubmit>
      </div>
    </form>
  );
}
