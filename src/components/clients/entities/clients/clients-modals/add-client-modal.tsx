"use client";
import { RHFSelect, Button, Input, GlobalModal, ButtonSubmit } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { categoryOptions, options } from "./constant-data";
import { ClientFormData, clientSchema } from "@/schemas";
import { useModal } from "@/stores";

export function AddClientModal() {
  const { closeModal } = useModal();
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      registerDate: new Date().toString(),
    },
  });

  function onSubmit(data: ClientFormData) {
    console.log("✅ Cliente:", data);
    alert(JSON.stringify(data, null, 2));
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
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
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
            type="number"
            placeholder="Ex: 546829403"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("nif")}
            error={errors.nif?.message}
          />

       {/*    <RHFSelect
            name="typeCompany"
            options={options}
            control={control}
            label="Tipo de Empresa"
          /> */}

          <Input
            label="Telefone"
            placeholder="Ex: 944072491"
            startIcon="Phone"
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
            label="Endereço"
            placeholder="Ex: Av. Pedro Castro"
            startIcon="MapPin"
            {...register("address")}
            error={errors.address?.message}
          />

          <Input
            label="IBAN"
            startIcon="FileDigit"
            placeholder="Ex: AO06004000005603309410251"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("iban")}
            error={errors.iban?.message}
          />

          <RHFSelect
            name="category"
            control={control}
            options={[
              { label: "cat1", value: "Loja" },
              { label: "cat2", value: "Fornecedor" },
              { label: "cat3", value: "Cliente" },
            ]}
            label="Categoria"
          />

          <Input
            type="date"
            label="Data de Registo"
            placeholder="Ex: 0040.0000.5660.0824.1017.4"
            className="appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register("registerDate")}
            error={errors.registerDate?.message}
          />
        </div>
        <div className="flex justify-end gap-4 mt-5">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <ButtonSubmit
            className="w-max"
            isLoading
            // ={isPending || isSubmitting}
          >
            Salvar
          </ButtonSubmit>
        </div>
      </form>
    </GlobalModal>
  );
}
