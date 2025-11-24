"use client";
import { ButtonSubmit, Input, RHFSelect } from "@/components";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptInvoiceFormData, ReceiptInvoiceSchema } from "@/schemas";
import { InvoiceItems } from "./items-items";
import { useEffect, useState } from "react";
import { SummaryCard } from "../sumary-card";
import { handleDownloadInvoice } from "@/utils/pdf";
import { useModal } from "@/stores";
import { InputFetch } from "@/components/common/input-fetch";

export const paymentOptions = [
  { label: "Transferência Bancária", value: "bank_transfer" },
  { label: "Dinheiro", value: "cash" },
  { label: "Cartão", value: "card" },
];

export function InvoiceForm() {
  const { openModal } = useModal();
  
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<ReceiptInvoiceFormData>({
    resolver: zodResolver(ReceiptInvoiceSchema),
    mode: "onChange",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      items: [],
    },
  });

  const fieldArray = useFieldArray<ReceiptInvoiceFormData, "items">({
    control,
    name: "items",
  });

  const handleClientChange = (value: string | number) => {
    if (typeof value === 'string') {
      setValue("customer.name", value);
    }
  };

  async function onSubmit(data: ReceiptInvoiceFormData) {
    console.log("Invoice:", JSON.stringify(data, null, 2));
    await new Promise((resolve) => setTimeout(resolve, 3000));
    handleDownloadInvoice(data);
    openModal("invoice-created");
    reset();
  }

  const items = watch("items");

  // Cálculos automáticos
  useEffect(() => {
    if (!items || items.length === 0) return;

    const subtotal = items.reduce(
      (acc, item) => acc + (item.unitPrice || 0) * (item.quantity || 0),
      0
    );

    const totalTax = items.reduce(
      (acc, item) => 
        acc + (item.unitPrice || 0) * (item.quantity || 0) * ((item.tax || 0) / 100),
      0
    );

    const totalDue = subtotal + totalTax;

    setValue("totals.subtotal", subtotal);
    setValue("totals.totalTax", totalTax);
    setValue("totals.totalDue", totalDue);
  }, [items, setValue]);

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
        <Input
          type="date"
          label="Data de Vencimento"
          {...register("dueDate")}
          error={errors.dueDate?.message}
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
        
        <Input
          label="NIF"
          placeholder="123456789"
          {...register("customer.vatNumber")}
          error={errors.customer?.vatNumber?.message}
        />
        
        <Input
          startIcon="MapPin"
          placeholder="Luanda"
          label="Endereço do cliente"
          className="md:col-span-2"
          {...register("customer.address")}
          error={errors.customer?.address?.message}
        />
      </div>

      <InvoiceItems fieldArray={fieldArray} control={control} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard 
          label="Subtotal" 
          value={watch("totals.subtotal") || 0} 
        />
        <SummaryCard 
          label="Taxa Total" 
          value={watch("totals.totalTax") || 0} 
        />
        <SummaryCard
          label="Total a Pagar"
          value={watch("totals.totalDue") || 0}
          highlight
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RHFSelect
          name="payment.method"
          label="Método de Pagamento"
          options={paymentOptions}
          control={control}
        />
        {watch("payment.method") === "bank_transfer" && (
          <Input
            label="IBAN"
            placeholder="Ex: AO06 0000 0000 0000 0000 0000 0"
            className="md:col-span-2"
            {...register("payment.bankDetails")}
            error={errors.payment?.bankDetails?.message}
          />
        )}
      </div>

      <div className="flex justify-end mt-6">
        <ButtonSubmit className="sm:w-max" isLoading={isSubmitting}>
          Criar Fatura
        </ButtonSubmit>
      </div>
    </form>
  );
}