"use client";
import { Button, Input, RHFSelect } from "@/components";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProformaFormData, ProformaSchema } from "@/schemas";
import { useEffect } from "react";
import { SummaryCard } from "../sumary-card";
import { ProformItems } from "./proform-items";
import { paymentOptions } from "./invoice-form";

export function ProformaForm() {
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProformaFormData>({
    resolver: zodResolver(ProformaSchema),
  });

  const fieldArray = useFieldArray<ProformaFormData, "items">({
    control,
    name: "items",
  });

  function onSubmit(data: ProformaFormData) {
    console.log("Proforma:", data);
    alert(JSON.stringify(data, null, 2));
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
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            startIcon="FileDigit"
            placeholder="PROF2025"
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
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            startIcon="User"
            label="Cliente"
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
        </div>
      </div>
      <ProformItems fieldArray={fieldArray} />
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
      <div className="flex justify-end col-span-3">
        <Button variant="default" type="submit">
          Criar Proforma
        </Button>
      </div>
    </form>
  );
}
