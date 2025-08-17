"use client";

import { Button, Input, Label, RHFSelect } from "@/components";
import InnerTagsInput from "@/components/custom/inner-tags-input";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupplierFormData, supplierSchema } from "@/schemas";
import { supplierOptions } from "./constant-data";

export function SupplierForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      products: [],
    },
  });

  function onSubmit(data: SupplierFormData) {
    console.log("✅ Supplier:", data);
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <Input
          label="Nome"
          type="text"
          placeholder="Ex: Ceara Coveney"
          {...register("name")}
          error={errors.name?.message}
        />

        <RHFSelect
          name="type"
          control={control}
          options={supplierOptions}
          label="Tipo de Fornecedor"
        />

        <Input
          label="Telefone"
          placeholder="Ex: 944072491"
          className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Ex: cea.co@gmail.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="NIF"
          placeholder="Ex: 546829403"
          className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          {...register("nif")}
          error={errors.nif?.message}
        />

        <Input
          label="Endereço"
          placeholder="Ex: Av. Pedro Castro"
          {...register("address")}
          error={errors.address?.message}
        />

        <RHFSelect
          name="type"
          control={control}
          options={supplierOptions}
          label="Tipo de Fornecimento"
        />

        <Input
          label="Prazo de Entrega"
          placeholder="Ex: 2 dias"
          {...register("deliveryTime")}
          error={errors.deliveryTime?.message}
        />

        <div className="*:not-first:mt-2">
          <Label>Produtos ou Categorias</Label>
          <Controller
            name="products"
            control={control}
            render={({ field }) => (
              <InnerTagsInput value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.products && (
            <p className="text-sm text-red-500">{errors.products.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Fornecedor</Button>
      </div>
    </form>
  );
}
