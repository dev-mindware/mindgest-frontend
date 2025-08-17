"use client";
import { RHFSelect, Button, Input } from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryOptions, options } from "./constant-data";
import { ClientFormData, clientSchema } from "@/schemas";

export function ClientForm() {
  const {
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
    alert(JSON.stringify(data, null, 2))
  }

  return (
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

        <RHFSelect
          name="typeCompany"
          options={options}
          control={control}
          label="Tipo de Empresa"
        />

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
          options={categoryOptions}
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
      <div className="flex justify-end col-span-3">
        <Button variant="default" type="submit">
          Adicionar Cliente
        </Button>
      </div>
    </form>
  );
}
