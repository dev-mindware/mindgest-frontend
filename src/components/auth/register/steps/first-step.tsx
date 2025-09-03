"use client"
import { cn } from "@/lib/utils";
import { Input } from "@/components";
import Link from "next/link";
import { RegisterFormData } from "@/schemas";
import { useFormContext } from "react-hook-form";
import { StepsHeader } from "./steps-header";

export function FirstStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <StepsHeader title="Insira seus dados pessoais" />
      </div>
      <div className="grid gap-6">
        <Input
          label="Seu nome"
          startIcon="User"
          placeholder="Insira seu nome"
          {...register("step1.full_name")}
          error={errors?.step1?.full_name && errors?.step1?.full_name?.message}
        />
        <Input
          label="Email"
          startIcon="Mail"
          placeholder="Insira seu email"
          {...register("step1.email")}
          error={errors?.step1?.email && errors?.step1?.email?.message}
        />
        <Input
          label="Telefone"
          maxLength={9}
          startIcon="Phone"
          placeholder="Insira seu telefone"
          {...register("step1.phone")}
          error={errors?.step1?.phone && errors?.step1?.phone?.message}
        />
        <Input
          type="password"
          startIcon="Lock"
          label="Palavra-passe"
          placeholder="********"
          {...register("step1.password")}
          error={errors?.step1?.password && errors?.step1?.password?.message}
        />
        <Input
          type="password"
          startIcon="Lock"
          placeholder="********"
          label="Confirmar palavra-passe"
          {...register("step1.passwordConfirmation")}
          error={
            errors?.step1?.passwordConfirmation &&
            errors?.step1?.passwordConfirmation?.message
          }
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
