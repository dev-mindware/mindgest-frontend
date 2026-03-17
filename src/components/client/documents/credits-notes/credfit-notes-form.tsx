"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditNoteSchema, CreditNoteFormData } from "@/schemas";
import { useCreateCreditNote, useAnnulationNote } from "@/hooks";
import { InvoiceDetails, ReceiptDetails } from "@/types/credit-note";
import { isInvoice, isReceipt } from "@/types/credit-notes-guards";
import { mapDocumentToCreditNoteDefaults } from "@/utils/credit-notes";
import { formatCurrency, parseCurrency } from "@/utils";
import { ButtonSubmit, Input, InputCurrency, RHFSelect, Textarea, Separator, Button } from "@/components";
import { ErrorMessage } from "@/utils/messages";


import { Trash2 } from "lucide-react";
import { ReasonNotesSection } from "./sections/ReasonNotesSection";
import { ClientDocumentSection } from "./sections/ClientDocumentSection";
import { ItemsSummarySection } from "./sections/ItemsSummarySection";

type Props = {
  invoice: InvoiceDetails | ReceiptDetails;
  docType?: "invoice-receipt" | "invoice-normal";
};

export function CreditNoteForm({ invoice, docType }: Props) {
  const router = useRouter();
  const { mutateAsync: annulationNote } = useAnnulationNote();
  const { mutateAsync: createCreditNote } = useCreateCreditNote();

  const isInvoiceDoc = isInvoice(invoice);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreditNoteFormData>({
    resolver: zodResolver(CreditNoteSchema),
    mode: "onChange",
    defaultValues: mapDocumentToCreditNoteDefaults(invoice),
  });

  const reason = useWatch({ control, name: "reason" });
  const watchedItems = useWatch({ control, name: "invoiceBody.items" });

  // Inicializar cliente selecionado
  useEffect(() => {
    if (invoice.client) {
      setValue("invoiceBody.client", {
        id: invoice.client.id,
        name: invoice.client.name,
        taxNumber: (invoice.client as any).taxNumber || "",
        address: (invoice.client as any).address || "",
        phone: (invoice.client as any).phone || "",
      });
    }
  }, [invoice, setValue]);

  // Recalculo dos totais e delta (creditNote)
  useEffect(() => {
    if (reason === "ANNULMENT") return;

    const subtotal = watchedItems?.reduce(
      (acc: number, item: any) => acc + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    ) ?? 0;

    const base = invoice.subtotal || 1;
    const taxRate = invoice.taxAmount / base;
    const discountRate = invoice.discountAmount / base;

    const tax = subtotal * taxRate;
    const discount = subtotal * discountRate;
    const total = subtotal + tax - discount;

    setValue("invoiceBody.subtotal", +subtotal.toFixed(2));
    setValue("invoiceBody.taxAmount", +tax.toFixed(2));
    setValue("invoiceBody.discountAmount", +discount.toFixed(2));
    setValue("invoiceBody.total", +total.toFixed(2));

    const deltaItems = watchedItems?.map((item: any) => {
      const original = (invoice as any).items?.find((i: any) => i.id === item.id);
      if (!original) return null;

      const originalPrice = original.unitPrice;
      const originalQuantity = original.quantity;
      const originalTotal = originalPrice * originalQuantity;

      const newPrice = Number(item.price) || 0;
      const newQuantity = Number(item.quantity) || 0;
      const newTotal = newPrice * newQuantity;

      return {
        id: original.id,
        itemsId: original.id,
        itemName: original.name,
        originalPrice,
        newPrice,
        originalQuantity,
        quantity: newQuantity,
        originalTotal,
        newTotal,
        originalTaxAmount: originalTotal * taxRate,
        newTaxAmount: newTotal * taxRate,
      };
    }).filter(Boolean) as any[];

    const deltaSubtotal = Math.max(0, deltaItems.reduce((acc, i) => acc + (i.originalTotal - i.newTotal), 0));

    setValue("creditNote", {
      subtotal: +deltaSubtotal.toFixed(2),
      taxAmount: +(deltaSubtotal * taxRate).toFixed(2),
      discountAmount: +(deltaSubtotal * discountRate).toFixed(2),
      total: +(deltaSubtotal * (1 + taxRate - discountRate)).toFixed(2),
      items: deltaItems,
    });
  }, [watchedItems, reason, invoice, setValue]);

  const { fields, remove } = useFieldArray({
    control,
    name: "invoiceBody.items",
  });

  async function onSubmit(data: CreditNoteFormData) {
    try {
      if (data.reason === "ANNULMENT") {
        await annulationNote({
          id: invoice.id,
          reason: data.reason,
          notes: data.notes ?? "",
          managerBarcode: data.managerBarcode,
        });
      } else {
        await createCreditNote({
          id: invoice.id,
          data,
        });
      }

      router.replace("/documents?tab=credit-notes");
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message || "Erro ao emitir nota de crédito"
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 space-y-8 border rounded-lg"
    >
      <ReasonNotesSection
        control={control}
        register={register}
        errors={errors}
        isInvoiceDoc={isInvoiceDoc}
      />

      {reason === "CORRECTION" && (
        <div className="space-y-8">
          <ClientDocumentSection
            register={register}
            errors={errors}
            isInvoiceDoc={isInvoiceDoc}
            docType={docType}
            client={invoice.client}
          />

          <Separator />

          <ItemsSummarySection
            control={control}
            register={register}
            fields={fields}
            remove={remove}
          />
        </div>
      )}

      <div className="flex justify-end">
        <ButtonSubmit className="w-max" isLoading={isSubmitting}>
          {reason === "ANNULMENT"
            ? "Confirmar Anulação"
            : "Emitir Nota de Crédito"}
        </ButtonSubmit>
      </div>
    </form>
  );
}
