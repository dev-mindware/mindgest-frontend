"use client";

import { ButtonSubmit, Input } from "@/components";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceReceiptFormData, InvoiceReceiptSchema } from "@/schemas";
import { useState } from "react";
import { InputFetch } from "@/components/common/input-fetch";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InvoiceReceiptItems } from "./items/invoice-receipt-items";

export const paymentOptions = [
  { label: "Transferência Bancária", value: "bank_transfer" },
  { label: "Dinheiro", value: "cash" },
  { label: "Cartão", value: "card" },
];

export function InvoiceReceiptForm() {
  const router = useRouter();

  // State for client API handling
  const [isClientFromAPI, setIsClientFromAPI] = useState(false);
  const [clientApiId, setClientApiId] = useState<string | undefined>(undefined);

  // Lifted state for totals calculation
  const [globalTax, setGlobalTax] = useState(0);
  const [globalRetention, setGlobalRetention] = useState(0);
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [invoiceTotals, setInvoiceTotals] = useState({
    subtotal: 0,
    taxAmount: 0,
    retentionAmount: 0,
    discountAmount: 0,
    total: 0,
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InvoiceReceiptFormData>({
    resolver: zodResolver(InvoiceReceiptSchema),
    mode: "onChange",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      items: [],
      isPaid: true,
      payment: {
        method: "cash",
      },
    },
  });

  const fieldArray = useFieldArray<InvoiceReceiptFormData, "items">({
    control,
    name: "items",
  });

  const handleClientChange = (id: string | number, fullObject: any | null) => {
    if (fullObject && fullObject.name) {
      // Client from API
      setValue("customer.name", fullObject.name);
      setValue("customer.taxNumber", fullObject.taxNumber || "");
      setValue("customer.address", fullObject.address || "");
      setValue("customer.phone", fullObject.phone || "");
      setClientApiId(fullObject.id);
      setIsClientFromAPI(true);
    } else {
      // Manual entry
      setValue("customer.name", typeof id === 'string' ? id : '');
      setValue("customer.taxNumber", "");
      setValue("customer.address", "");
      setValue("customer.phone", "");
      setClientApiId(undefined);
      setIsClientFromAPI(false);
    }
  };

  async function onSubmit(data: InvoiceReceiptFormData) {
    // Construct final payload
    const finalPayload = {
      issueDate: data.issueDate,
      customer: isClientFromAPI && clientApiId
        ? { id: clientApiId }
        : {
          name: data.customer.name,
          phone: data.customer.phone || undefined,
          address: data.customer.address || undefined,
        },
      items: data.items.map((item) => {
        if (item.isFromAPI && item.id) {
          return {
            id: item.id,
            quantity: item.quantity,
          };
        }
        return {
          name: item.description,
          price: item.unitPrice,
          quantity: item.quantity,
          type: item.type,
        };
      }),
      // Use calculated totals
      total: invoiceTotals.total,
      taxAmount: invoiceTotals.taxAmount,
      retentionAmount: invoiceTotals.retentionAmount,
      discountAmount: invoiceTotals.discountAmount,
    };

    console.log("🚀 Final Invoice Payload:", JSON.stringify(finalPayload, null, 2));
    try {
      await invoiceReceiptService.createInvoiceReceipt(finalPayload);
      toast.success("Fatura criada com sucesso!");
      router.push("/client/documents&current_tab=invoice-receipt",);
    } catch (error) {
      toast.error("Erro ao criar fatura!");
      console.error("Error creating invoice:", error);
    }


    // Reset form and state
    reset();
    setIsClientFromAPI(false);
    setClientApiId(undefined);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 mt-4 space-y-8 border rounded-lg"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Input
          type="date"
          label="Data de Emissão"
          {...register("issueDate")}
          error={errors.issueDate?.message}
        />

        <InputFetch
          startIcon="User"
          label="Cliente"
          placeholder="Digite o nome do cliente..."
          endpoint="/clients"
          displayFields={['name', 'email']}
          onValueChange={handleClientChange}
          minChars={1}
          debounceMs={300}
        />

        <div className="relative">
          <Input
            label="NIF"
            placeholder="123456789"
            {...register("customer.taxNumber")}
            error={errors.customer?.taxNumber?.message}
            disabled={isClientFromAPI}
          />
        </div>

        <div className="relative">
          <Input
            startIcon="Phone"
            placeholder="+244 923 456 789"
            label="Telefone do cliente"
            {...register("customer.phone")}
            error={errors.customer?.phone?.message}
            disabled={isClientFromAPI}
          />
        </div>

        <div className="relative">
          <Input
            startIcon="MapPin"
            placeholder="Luanda"
            label="Endereço do cliente"
            {...register("customer.address")}
            error={errors.customer?.address?.message}
            disabled={isClientFromAPI}
          />
        </div>
      </div>

      <InvoiceReceiptItems
        fieldArray={fieldArray}
        onTotalsChange={setInvoiceTotals}
        globalTax={globalTax}
        setGlobalTax={setGlobalTax}
        globalRetention={globalRetention}
        setGlobalRetention={setGlobalRetention}
        globalDiscount={globalDiscount}
        setGlobalDiscount={setGlobalDiscount}
      />

      <div className="flex justify-end mt-6">
        <ButtonSubmit className="sm:w-max" isLoading={isSubmitting}>
          Criar Fatura Recibo
        </ButtonSubmit>
      </div>
    </form>
  );
}
