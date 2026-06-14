"use client";
import { useEffect, useState, useCallback } from "react";
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
import { ClientSelectOption } from "@/types/clients";


import { Trash2 } from "lucide-react";
import { ReasonNotesSection } from "./sections/ReasonNotesSection";
import { ClientDocumentSection } from "./sections/ClientDocumentSection";
import { ItemsSummarySection } from "./sections/ItemsSummarySection";

const getFriendlyErrorMessages = (errors: any): string[] => {
  const messages: string[] = [];
  
  const fieldLabels: Record<string, string> = {
    "reason": "Motivo",
    "notes": "Notas",
    "managerBarcode": "Código de Barras do Gerente",
    "invoiceBody.client.id": "Cliente",
    "invoiceBody.client.name": "Nome do Cliente",
    "invoiceBody.client.taxNumber": "NIF do Cliente",
    "invoiceBody.client.phone": "Telefone do Cliente",
    "invoiceBody.client.address": "Endereço do Cliente",
    "invoiceBody.issueDate": "Data de Emissão",
    "invoiceBody.dueDate": "Data de Vencimento",
    "invoiceBody.subtotal": "Subtotal da factura",
    "invoiceBody.taxAmount": "Valor do Imposto",
    "invoiceBody.discountAmount": "Valor do Desconto",
    "invoiceBody.total": "Total da factura",
    "creditNote.subtotal": "Subtotal da Nota de Crédito",
    "creditNote.taxAmount": "Imposto da Nota de Crédito",
    "creditNote.discountAmount": "Desconto da Nota de Crédito",
    "creditNote.total": "Total da Nota de Crédito",
  };

  const walk = (obj: any, path: string = "") => {
    if (!obj || typeof obj !== "object") return;
    
    if (typeof obj.message === "string") {
      let displayPath = path;
      if (path.startsWith("invoiceBody.items[")) {
        const match = path.match(/invoiceBody\.items\[(\d+)\]\.(.*)/);
        if (match) {
          const index = parseInt(match[1]) + 1;
          const field = match[2];
          const fieldNameMap: Record<string, string> = {
            name: "Nome",
            quantity: "Quantidade",
            price: "Preço Unitário",
          };
          displayPath = `Item ${index} (${fieldNameMap[field] || field})`;
        }
      } else {
        displayPath = fieldLabels[path] || path;
      }
      messages.push(`${displayPath}: ${obj.message}`);
      return;
    }

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const nextPath = path 
          ? isNaN(Number(key)) 
            ? `${path}.${key}` 
            : `${path}[${key}]`
          : key;
        
        walk(obj[key], nextPath);
      }
    }
  };

  walk(errors);
  return messages;
};

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

  const [selectedClient, setSelectedClient] = useState<ClientSelectOption | null>(null);

  const handleClientChange = useCallback(
    (option: ClientSelectOption | null) => {
      setSelectedClient(option);

      if (!option) {
        setValue("invoiceBody.client.id", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.name", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.taxNumber", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.address", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.phone", "", { shouldValidate: true, shouldDirty: true });
        return;
      }

      if (option.__isNew__) {
        setValue("invoiceBody.client.id", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.name", option.label, { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.taxNumber", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.address", "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.phone", "", { shouldValidate: true, shouldDirty: true });
      } else if (option.data) {
        setValue("invoiceBody.client.id", option.data.id, { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.name", option.data.name, { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.taxNumber", option.data.taxNumber || "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.address", option.data.address || "", { shouldValidate: true, shouldDirty: true });
        setValue("invoiceBody.client.phone", option.data.phone || "", { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );

  // Inicializa o cliente seleccionado.
  useEffect(() => {
    if (invoice.client) {
      setValue("invoiceBody.client.id", invoice.client.id);
      setValue("invoiceBody.client.name", invoice.client.name);
      setValue("invoiceBody.client.taxNumber", (invoice.client as any).taxNumber || "");
      setValue("invoiceBody.client.address", (invoice.client as any).address || "");
      setValue("invoiceBody.client.phone", (invoice.client as any).phone || "");

      setSelectedClient({
        value: invoice.client.id,
        label: invoice.client.name,
        data: invoice.client as any,
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
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Validation errors in CreditNoteForm:", errors);
        const errorList = getFriendlyErrorMessages(errors);
        if (errorList.length > 0) {
          ErrorMessage(`Erro de validação: ${errorList.join(" | ")}`);
        } else {
          ErrorMessage("Por favor, preencha todos os campos obrigatórios corretamente.");
        }
      })}
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
            selectedClient={selectedClient}
            onClientChange={handleClientChange}
          />

          <Separator />

          <ItemsSummarySection
            control={control}
            register={register}
            errors={errors}
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
