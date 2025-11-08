"use client";
import { useEffect } from "react";
import { Input, ButtonSubmit } from "@/components";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReceiptInvoiceSchema, ReceiptInvoiceFormData } from "@/schemas";
import { ReceiptItems } from "./receipt-items";
import { SummaryCard } from "../sumary-card";
import { handleDownloadReceipt } from "@/utils/pdf";
import { MINDWARE_INFO } from "@/constants";
import { useModal } from "@/stores";

export function ReceiptForm() {
  const { openModal } = useModal();
  const {
    watch,
    setValue,
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReceiptInvoiceFormData>({
    resolver: zodResolver(ReceiptInvoiceSchema),
    mode: "onChange",
    defaultValues: {
      company: MINDWARE_INFO,
    },
  });

  const fieldArray = useFieldArray<ReceiptInvoiceFormData, "items">({
    control,
    name: "items",
  });

  async function onSubmit(data: ReceiptInvoiceFormData) {
    console.log("Receipt:", data);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    handleDownloadReceipt(data);
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

    setValue("totals.totalDue", totalDue);
  }, [items, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 mt-4 space-y-8 border rounded-lg"
    >
      <div className="grid gap-6 md:grid-cols-3">
        <Input
          startIcon="FileDigit"
          placeholder="REC2025"
          label="Número do recibo"
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
          label="Cliente"
          startIcon="User"
          placeholder="Mauro Dinis Raimundo"
          {...register("customer.name")}
          error={errors.customer?.name?.message}
        />
        <Input
          startIcon="MapPin"
          placeholder="Luanda"
          label="Endereço do cliente"
          {...register("customer.address")}
          error={errors.customer?.address?.message}
        />
        <Input
          startIcon="DollarSign"
          placeholder="Insira um valor"
          label="Valor Recebido"
          {...register("totals.totalDue", { valueAsNumber: true })}
        />
      </div>

      <ReceiptItems fieldArray={fieldArray} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard
          label="Total a Pagar"
          value={watch("totals.totalDue")}
          highlight
        />
      </div>

      <div className="flex justify-end col-span-3">
        <ButtonSubmit className="sm:w-max" isLoading={isSubmitting}>Criar Fatura-Recibo</ButtonSubmit>
      </div>
    </form>
  );
}
