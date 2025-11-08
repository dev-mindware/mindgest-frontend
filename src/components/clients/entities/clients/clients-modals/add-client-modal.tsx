"use client";
import { useAuthStore, useModal } from "@/stores";
import { useForm } from "react-hook-form";
import { useAddClient } from "@/hooks/entities";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientFormData, clientSchema } from "@/schemas";
import { Button, Input, GlobalModal, ButtonSubmit } from "@/components";

export function AddClientModal() {
  const { closeModal } = useModal();
  const { mutateAsync: addClientMutate, isPending } = useAddClient();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
  });

  async function onSubmit(data: ClientFormData) {
    try {
      const { iban, ...finalData } = data;
      await addClientMutate(finalData);
    } catch (error: any) {
      if (error?.response?.data) {
        ErrorMessage(
          error?.response?.data?.message || "Ocorreu um erro inesperado"
        );
      } else {
        ErrorMessage("Ocorreu um erro inesperado. Tente Novamente");
      }
    }
  }

  function handleCancel() {
    reset();
    closeModal("add-client");
  }

  return (
    <GlobalModal
      canClose
      id="add-client"
      title="Novo Cliente"
      className="!max-h-[85vh] !w-max"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            startIcon="User"
            placeholder="Ex: Ceara Coveney"
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
            placeholder="Ex: cea.co@gmail.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="IBAN"
            startIcon="FileDigit"
            placeholder="Ex: AO06004000005603309410251"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("iban")}
            error={errors.iban?.message}
          />

          <Input
            label="Endereço"
            placeholder="Ex: Av. Pedro Castro"
            startIcon="MapPin"
            {...register("address")}
            error={errors.address?.message}
          />
        </div>
        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit className="w-max" isLoading={isPending || isSubmitting}>
            Salvar
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
