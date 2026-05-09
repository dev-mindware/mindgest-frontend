"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input, Button, Progress, Label } from "@/components";
import { RegisterFormData } from "@/schemas";
import { useFormContext } from "react-hook-form";
import { StepsHeader } from "./steps-header";
import { Wand2, Check, X, ShieldAlert, ShieldCheck, Shield } from "lucide-react";

export function FirstStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  const password = watch("step1.password") || "";
  const [strength, setStrength] = useState(0);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 25;
    if (/\d/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("step1.password", pass, { shouldValidate: true });
    setValue("step1.passwordConfirmation", pass, { shouldValidate: true });
  };

  const getStrengthColor = () => {
    if (strength <= 25) return "bg-destructive";
    if (strength <= 50) return "bg-orange-500";
    if (strength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (!password) return "";
    if (strength <= 25) return "Fraca";
    if (strength <= 50) return "Razoável";
    if (strength <= 75) return "Boa";
    return "Muito Forte";
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center gap-2 mt text-center">
        <StepsHeader title="Insira os dados do proprietário" />
      </div>
      <div className="grid gap-6">
        <Input
          label="Seu nome"
          startIcon="User"
          placeholder="Insira seu nome"
          {...register("step1.name")}
          error={errors?.step1?.name && errors?.step1?.name?.message}
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

        <div className="space-y-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                type="password"
                startIcon="Lock"
                label="Palavra-passe"
                placeholder="********"
                {...register("step1.password")}
                error={errors?.step1?.password && errors?.step1?.password?.message}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="mb-1"
              title="Gerar senha forte"
              onClick={generateStrongPassword}
            >
              <Wand2 className="size-4" />
            </Button>
          </div>

          {password && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground flex items-center gap-1">
                  Força da senha: <b className={cn(
                    strength <= 25 ? "text-destructive" :
                    strength <= 50 ? "text-orange-500" :
                    strength <= 75 ? "text-yellow-500" : "text-green-500"
                  )}>{getStrengthText()}</b>
                </span>
                {strength === 100 && <ShieldCheck className="size-4 text-green-500" />}
                {strength < 100 && strength > 50 && <Shield className="size-4 text-yellow-500" />}
                {strength <= 50 && <ShieldAlert className="size-4 text-destructive" />}
              </div>
              <Progress value={strength} className="h-1" indicatorClassName={getStrengthColor()} />
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-muted-foreground mt-2">
                <li className="flex items-center gap-1">
                  {password.length >= 8 ? <Check className="size-3 text-green-500" /> : <X className="size-3 text-destructive" />}
                  Mínimo 8 caracteres
                </li>
                <li className="flex items-center gap-1">
                  {/[A-Z]/.test(password) && /[a-z]/.test(password) ? <Check className="size-3 text-green-500" /> : <X className="size-3 text-destructive" />}
                  Maiúsculas e minúsculas
                </li>
                <li className="flex items-center gap-1">
                  {/\d/.test(password) ? <Check className="size-3 text-green-500" /> : <X className="size-3 text-destructive" />}
                  Pelo menos um número
                </li>
                <li className="flex items-center gap-1">
                  {/[^A-Za-z0-9]/.test(password) ? <Check className="size-3 text-green-500" /> : <X className="size-3 text-destructive" />}
                  Caractere especial
                </li>
              </ul>
            </div>
          )}
        </div>

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
    </div>
  );
}
