"use client";

import { Button, GlobalModal, Input } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupplierFormData, supplierSchema } from "@/schemas";
import { useAddSupplier } from "@/hooks/entities/use-suppliers";
import { useModal } from "@/stores";


export function AddSupplierModal() {
  const { closeModal } = useModal();
  const { mutateAsync: addSupplier, isPending } = useAddSupplier();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  async function onSubmit(data: SupplierFormData) {
    try {
      await addSupplier(data);
      closeModal("add-supplier");
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
    }
  }

  return (
    <GlobalModal
      canClose
      id="add-supplier"
      title="Novo Fornecedor"
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Input
            label="Nome"
            type="text"
            placeholder="Ex: Ceara Coveney"
            {...register("name")}
            error={errors.name?.message}
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
            {...register("taxNumber")}
            error={errors.taxNumber?.message}
          />

          <Input
            label="Endereço"
            placeholder="Ex: Av. Pedro Castro"
            {...register("address")}
            error={errors.address?.message}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" loading={isPending} disabled={isPending}>Salvar Fornecedor</Button>
        </div>
      </form>
    </GlobalModal>
  );
}
