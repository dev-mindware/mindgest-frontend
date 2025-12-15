"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonSubmit, Input } from "@/components";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceReceiptFormData, InvoiceReceiptSchema } from "@/schemas";
import { InputFetch } from "@/components/common/input-fetch";
import { InvoiceItems } from "./items/invoice-items";
import { useCreateInvoiceReceipt } from "@/hooks";

export const paymentOptions = [
  { label: "Transferência Bancária", value: "bank_transfer" },
  { label: "Dinheiro", value: "cash" },
  { label: "Cartão", value: "card" },
];

export function InvoiceReceiptForm() {
  const { mutateAsync: createInvoiceReceipt } = useCreateInvoiceReceipt()
  const [isClientFromAPI, setIsClientFromAPI] = useState(false);
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InvoiceReceiptFormData>({
    resolver: zodResolver(InvoiceReceiptSchema) as any,
    mode: "onChange",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      items: [],
      isPaid: false,
      clientApiId: undefined,
      globalTax: 0,
      globalRetention: 0,
      globalDiscount: 0,
      invoiceTotals: {
        subtotal: 0,
        taxAmount: 0,
        retentionAmount: 0,
        discountAmount: 0,
        total: 0,
      },
    },
  });

  const fieldArray = useFieldArray<InvoiceReceiptFormData, "items">({
    control,
    name: "items",
  });

  const clientApiId = useWatch({ control, name: "clientApiId" });
  const globalTax = useWatch({ control, name: "globalTax" }) ?? 0;
  const globalRetention = useWatch({ control, name: "globalRetention" }) ?? 0;
  const globalDiscount = useWatch({ control, name: "globalDiscount" }) ?? 0;
  const invoiceTotals = useWatch({ control, name: "invoiceTotals" }) ?? {
    subtotal: 0,
    taxAmount: 0,
    retentionAmount: 0,
    discountAmount: 0,
    total: 0,
  };

  // criar um hook pra isso
  const handleClientChange = (id: string | number, fullObject: any | null) => {
    if (fullObject && fullObject.name) {
      // Client from API
      setValue("client.name", fullObject.name);
      setValue("client.taxNumber", fullObject.taxNumber || "");
      setValue("client.address", fullObject.address || "");
      setValue("client.phone", fullObject.phone || "");
      setValue("clientApiId", fullObject.id);
      setIsClientFromAPI(false);
    } else {
      // Manual entry
      setValue("client.name", typeof id === "string" ? id : "");
      setValue("client.taxNumber", "");
      setValue("client.address", "");
      setValue("client.phone", "");
      setValue("clientApiId", undefined);
      setIsClientFromAPI(true);
    }
  };

  console.log("ERROS DO FORMULARIO: ")
  console.log(errors)


  async function onSubmit(data: InvoiceReceiptFormData) {
    const finalPayload = {
      issueDate: data.issueDate,
      /*  dueDate: data.dueDate, */
      client:
        isClientFromAPI && clientApiId
          ? { id: clientApiId }
          : {
            name: data.client.name,
            phone: data.client.phone || undefined,
            address: data.client.address || undefined,
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
      total: invoiceTotals?.total ?? 0,
      taxAmount: invoiceTotals?.taxAmount ?? 0,
      retentionAmount: invoiceTotals?.retentionAmount ?? 0,
      discountAmount: invoiceTotals?.discountAmount ?? 0,
    };

    try {
      await createInvoiceReceipt(finalPayload);
      reset();
      setIsClientFromAPI(false);
      setValue("clientApiId", undefined);
    } catch (error: any) {
      if (error?.response) {
        toast.error(error?.response?.data?.message || "Erro ao criar fatura!");
      } else {
        toast.error("Ecorreu um erro desconhecido. Tente novamente");
      }
    }
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
          displayFields={["name", "email"]}
          onValueChange={handleClientChange}
          minChars={1}
          debounceMs={300}
        />

        <div className="relative">
          <Input
            label="NIF"
            placeholder="123456789"
            {...register("client.taxNumber")}
            error={errors.client?.taxNumber?.message}
            disabled={isClientFromAPI}
          />
        </div>

        <div className="relative">
          <Input
            startIcon="Phone"
            placeholder="  923 456 789"
            label="Telefone do cliente"
            {...register("client.phone")}
            error={errors.client?.phone?.message}
            disabled={isClientFromAPI}
          />
        </div>

        <div className="relative">
          <Input
            startIcon="MapPin"
            placeholder="Luanda"
            label="Endereço do cliente"
            {...register("client.address")}
            error={errors.client?.address?.message}
            disabled={isClientFromAPI}
          />
        </div>
      </div>

      <InvoiceItems
        fieldArray={fieldArray as any}
        onTotalsChange={(totals) => setValue("invoiceTotals", totals)}
        globalTax={globalTax}
        setGlobalTax={(value) => setValue("globalTax", value)}
        globalRetention={globalRetention}
        setGlobalRetention={(value) => setValue("globalRetention", value)}
        globalDiscount={globalDiscount}
        setGlobalDiscount={(value) => setValue("globalDiscount", value)}
      />

      <div className="flex justify-end mt-6">
        <ButtonSubmit className="sm:w-max" isLoading={isSubmitting}>
          Criar Fatura Recibo
        </ButtonSubmit>
      </div>
    </form>
  );
}
