"use client";

import { Button, GlobalModal, Input } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoreFormData, storeSchema } from "@/schemas/add-store";
import { useAuthStore } from "@/stores";

export function AddStoreModal() {
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      companyId: user?.company?.id!,
    },
  });

  function onSubmit(data: StoreFormData) {
    console.log("✅ Store:", data);
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <GlobalModal
      canClose
      id="add-store"
      title="Nova Loja"
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Input
            label="Nome"
            placeholder="Ex: Ceara Coveney"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Ex: ceaa@gmail.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Telefone"
            type="number"
            placeholder="Ex: 944072491"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <Input
            label="Endereço"
            type="text"
            placeholder="Ex: Av. Pedro Castro"
            {...register("address")}
            error={errors.address?.message}
          />
          
        </div>

        <div className="flex  justify-end">
          <Button type="submit">Salvar Loja</Button>
          <Button variant="outline" type="button">
            Cancelar
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}