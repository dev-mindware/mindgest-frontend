"use client";
import { useModal } from "@/stores";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { SupplierFormData, supplierSchema } from "@/schemas";
import { Button, Input, GlobalModal, ButtonSubmit } from "@/components";
import { useAddSupplier } from "@/hooks/entities/use-suppliers";

export function SupplierModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["add-supplier"];
  const { mutateAsync: addSupplier, isPending: isAdding } = useAddSupplier();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    mode: "onChange",
  });

  async function onSubmit(data: SupplierFormData) {
    try {
      await addSupplier(data);

      handleCancel();
    } catch (error: any) {
      ErrorMessage(
        error?.response?.data?.message ||
          "Ocorreu um erro ao salvar o fornecedor.",
      );
    }
  }

  const handleCancel = () => {
    reset();
    closeModal("add-supplier");
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="add-supplier"
      title="Adicionar Fornecedor"
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            startIcon="User"
            placeholder="Ex: Tech Solutions Ltd"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="NIF"
            startIcon="IdCard"
            placeholder="Ex: 546829403"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("taxNumber")}
            error={errors.taxNumber?.message}
          />

          <Input
            label="Telefone"
            startIcon="Phone"
            maxLength={9}
            placeholder="9xxxxxxxx"
            {...register("phone")}
            error={errors.phone?.message}
          />

          <Input
            type="email"
            label="Email"
            startIcon="Mail"
            {...register("email")}
            placeholder="Ex: contact@techsolutions.com"
            error={errors.email?.message}
          />

          <Input
            label="Endereço"
            startIcon="MapPin"
            {...register("address")}
            placeholder="Ex: Av. da Liberdade, 456"
            error={errors.address?.message}
          />
        </div>

        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isSubmitting || isAdding}>
            Adicionar
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
