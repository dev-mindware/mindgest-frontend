import { cn } from "@/lib/utils";
import { Input } from "@/components";
import Link from "next/link";
import { RegisterFormData } from "@/schemas";
import { useFormContext } from "react-hook-form";

export function FirstStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Crie sua conta</h1>
      </div>
      <div className="grid gap-6">
        <Input
          startIcon="IdCard"
          label="Nº de Contribuente"
          placeholder="558442018"
          {...register("step1.nif")}
          error={errors?.step1?.nif && errors?.step1?.nif?.message}
        />
        <Input
          label="Empresa"
          startIcon="Building2"
          placeholder="Mindware"
          {...register("step1.company")}
          error={errors?.step1?.company && errors?.step1?.company?.message}
        />
        <Input
          label="Seu nome"
          startIcon="User"
          placeholder="Insira seu nome"
          {...register("step1.name")}
          error={errors?.step1?.name && errors?.step1?.name?.message}
        />
        <Input
          label="Telefone"
          startIcon="Phone"
          placeholder="Insira seu telefone"
          {...register("step1.phone")}
          error={errors?.step1?.phone && errors?.step1?.phone?.message}
        />
        <Input
          label="Email"
          startIcon="Mail"
          placeholder="Insira seu email"
          {...register("step1.email")}
          error={errors?.step1?.email && errors?.step1?.email?.message}
        />
      </div>
      <div className="text-sm text-center">
        Já tens uma conta?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Entre
        </Link>
      </div>
    </div>
  );
}
