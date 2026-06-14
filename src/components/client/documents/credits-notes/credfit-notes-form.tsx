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
import { calculateCreditNoteCorrection } from "@/utils";
import { ButtonSubmit } from "@/components";
import { ErrorMessage } from "@/utils/messages";
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

  // Mantém no documento os dados do cliente associado à factura original.
  useEffect(() => {
    if (invoice.client) {
      setValue("invoiceBody.client.id", invoice.client.id);
      setValue("invoiceBody.client.name", invoice.client.name);
      setValue("invoiceBody.client.taxNumber", (invoice.client as any).taxNumber || "");
      setValue("invoiceBody.client.address", (invoice.client as any).address || "");
      setValue("invoiceBody.client.phone", (invoice.client as any).phone || "");
    }
  }, [invoice, setValue]);

  // Recalculo dos totais e delta (creditNote)
  useEffect(() => {
    if (reason === "ANNULMENT") return;

    const correction = calculateCreditNoteCorrection(
      {
        items: isInvoice(invoice) ? invoice.items : [],
        subtotal: invoice.subtotal,
        taxAmount: invoice.taxAmount,
        discountAmount: invoice.discountAmount,
      },
      watchedItems || [],
    );

    setValue("invoiceBody.subtotal", correction.invoiceBody.subtotal);
    setValue("invoiceBody.taxAmount", correction.invoiceBody.taxAmount);
    setValue("invoiceBody.discountAmount", correction.invoiceBody.discountAmount);
    setValue("invoiceBody.total", correction.invoiceBody.total);
    setValue("creditNote", correction.creditNote);
  }, [watchedItems, reason, invoice, setValue]);

  const { fields, append, remove } = useFieldArray({
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
        const originalTotal = invoice.total ?? invoice.totalAmount ?? 0;
        if (data.invoiceBody.total > originalTotal + 0.01) {
          ErrorMessage(
            "O total corrigido não pode ser superior ao total do documento original.",
          );
          return;
        }

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
      className="space-y-6"
    >
      <section className="rounded-lg border bg-card p-5 shadow-sm" data-tour="credit-note-reason">
        <ReasonNotesSection
          control={control}
          register={register}
          errors={errors}
          isInvoiceDoc={isInvoiceDoc}
        />
      </section>

      {reason === "CORRECTION" && (
        <div className="space-y-6">
          <div data-tour="credit-note-client">
            <ClientDocumentSection
              register={register}
              errors={errors}
              isInvoiceDoc={isInvoiceDoc}
              docType={docType}
              client={invoice.client}
            />
          </div>

          <div data-tour="credit-note-items">
            <ItemsSummarySection
              control={control}
              register={register}
              errors={errors}
              fields={fields}
              append={append}
              remove={remove}
            />
          </div>
        </div>
      )}

      <div className="sticky bottom-0 flex justify-end border-t bg-background/95 py-4 backdrop-blur" data-tour="credit-note-submit">
        <ButtonSubmit className="w-max" isLoading={isSubmitting}>
          {reason === "ANNULMENT"
            ? "Confirmar Anulação"
            : "Emitir Nota de Crédito"}
        </ButtonSubmit>
      </div>
    </form>
  );
}
