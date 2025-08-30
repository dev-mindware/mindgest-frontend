"use client";
import { Button, ButtonSubmit, Input, RHFSelect } from "@/components";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceFormData, InvoiceSchema } from "@/schemas";
import { InvoiceItems } from "./items-items";
import { useEffect } from "react";
import { SummaryCard } from "../sumary-card";
import { handleDownloadInvoice } from "@/utils/pdf";
import { useModal } from "@/stores";
import { MINDWARE_INFO } from "@/constants";

export const paymentOptions = [
  { label: "Transferência Bancária", value: "bank_transfer" },
  { label: "Dinheiro", value: "cash" },
  { label: "Cartão", value: "card" },
];

export function InvoiceForm() {
  const { openModal } = useModal();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(InvoiceSchema),
    mode: "onChange",
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      items: [],
      company: MINDWARE_INFO,
    },
  });

  const fieldArray = useFieldArray<InvoiceFormData, "items">({
    control,
    name: "items",
  });

  async function onSubmit(data: InvoiceFormData) {
    console.log("Invoice:", data);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    handleDownloadInvoice(data);
    openModal("invoice-created");
    reset();
  }

  const items = watch("items");

  useEffect(() => {
    if (!items) return;

    const subtotal = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );

    const totalTax = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity * (item.tax / 100),
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
      className="mt-4 space-y-8 border p-8 rounded-lg"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Input
          startIcon="FileDigit"
          placeholder="INV2025"
          label="Número da fatura"
          {...register("documentNumber")}
          error={errors.documentNumber?.message}
        />
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

        <Input
          startIcon="User"
          label="Cliente"
          placeholder="Mauro Dinis Raimundo"
          {...register("customer.name")}
          error={errors.customer?.name?.message}
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
          className="md:col-span-3"
          {...register("customer.address")}
          error={errors.customer?.address?.message}
        />
      </div>

      <InvoiceItems fieldArray={fieldArray} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard label="Subtotal" value={watch("totals.subtotal")} />
        <SummaryCard label="Taxa Total" value={watch("totals.totalTax")} />
        <SummaryCard
          label="Total a Pagar"
          value={watch("totals.totalDue")}
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
        <ButtonSubmit isLoading={isSubmitting}>Criar Fatura</ButtonSubmit>
      </div>
    </form>
  );
}
