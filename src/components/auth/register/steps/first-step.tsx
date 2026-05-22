"use client";
import { cn } from "@/lib/utils";
import { Input, Button } from "@/components";
import { RegisterFormData } from "@/schemas";
import { useFormContext } from "react-hook-form";
import { StepsHeader } from "./steps-header";
import { Wand2 } from "lucide-react";

type StrengthLevel = 0 | 1 | 2 | 3;

interface StrengthConfig {
  level: StrengthLevel;
  label: string;
  color: string;
  textColor: string;
}

function getStrength(pass: string): StrengthConfig {
  if (!pass) return { level: 0, label: "", color: "", textColor: "" };

  let score = 0;
  if (pass.length >= 8) score++;
  if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 1) return { level: 1, label: "Fraca",  color: "bg-red-500",    textColor: "text-red-500" };
  if (score <= 2) return { level: 2, label: "Média",  color: "bg-yellow-400", textColor: "text-yellow-500" };
  return             { level: 3, label: "Forte",  color: "bg-green-500",  textColor: "text-green-600" };
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;

  const { level, label, color, textColor } = getStrength(password);

  return (
    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex gap-1.5">
        {([1, 2, 3] as const).map((seg) => (
          <div
            key={seg}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              level >= seg ? color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium", textColor)}>{label}</p>
    </div>
  );
}

export function FirstStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  const password = watch("step1.password") || "";

  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("step1.password", pass, { shouldValidate: true });
    setValue("step1.passwordConfirmation", pass, { shouldValidate: true });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 mt text-center">
        <StepsHeader title="Insira os dados do proprietário" />
      </div>
      <div className="grid gap-6">
        <Input
          label="Seu nome"
          startIcon="User"
          placeholder="Insira seu nome"
          {...register("step1.name")}
          error={errors?.step1?.name?.message}
        />
        <Input
          label="Email"
          startIcon="Mail"
          placeholder="Insira seu email"
          {...register("step1.email")}
          error={errors?.step1?.email?.message}
        />
        <Input
          label="Telefone"
          maxLength={9}
          startIcon="Phone"
          placeholder="Insira seu telefone"
          {...register("step1.phone")}
          error={errors?.step1?.phone?.message}
        />

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                type="password"
                startIcon="Lock"
                label="Palavra-passe"
                placeholder="********"
                {...register("step1.password")}
                error={errors?.step1?.password?.message}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="mb-1 shrink-0"
              title="Gerar senha forte"
              onClick={generateStrongPassword}
            >
              <Wand2 className="size-4" />
            </Button>
          </div>

          <PasswordStrengthBar password={password} />
        </div>

        <Input
          type="password"
          startIcon="Lock"
          placeholder="********"
          label="Confirmar palavra-passe"
          {...register("step1.passwordConfirmation")}
          error={errors?.step1?.passwordConfirmation?.message}
        />
      </div>
    </div>
  );
}
