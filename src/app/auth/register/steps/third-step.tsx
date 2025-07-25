"use client"
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { ReceiptText, ShoppingCart, Brain, Monitor, Users } from "lucide-react";
import {
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { RegisterFormData } from "@/schemas";
import { AlertError } from "@/components/layout";

interface Option {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const serviceOptions: Option[] = [
  { value: "fatura", label: "Faturação", icon: ReceiptText },
  { value: "produtos", label: "Gestão de Stock", icon: ShoppingCart },
  { value: "relatorios", label: "Relatórios Inteligentes", icon: Brain },
  { value: "tecnologia", label: "POS", icon: Monitor },
  { value: "entidades", label: "Multiplas Entidades", icon: Users },
];

export function ThirdStep() {
  const form = useFormContext<RegisterFormData>();
  const selectedServices = form.watch("step3.services") ?? [];
  const fieldArray = useFieldArray<RegisterFormData, "step3.services">({
    control: form.control,
    name: "step3.services",
  });

  const handleSelect = useCallback(
    (val: string) => {
      const isSelected = selectedServices.some((s) => s.val === val);

      if (isSelected) {
        const index = fieldArray.fields.findIndex((field) => field.val === val);
        if (index !== -1) fieldArray.remove(index);
      } else {
        fieldArray.append({ val });
      }
    },
    [fieldArray.append, fieldArray.remove, selectedServices, fieldArray.fields]
  );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-center">
        Escolha os Recursos
      </h1>

      <div className={cn("flex flex-col gap-3")}>
        {serviceOptions.map((opt) => {
          const isSelected = selectedServices.some((s) => s.val === opt.value);
          const Icon = opt.icon;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              type="button"
              aria-pressed={isSelected}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-3 text-left transition-all border",
                isSelected
                  ? "border-primary bg-background ring-2 ring-primary/50"
                  : "bg-sidebar border-transparent hover:border-muted-foreground/20 text-muted-foreground"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "w-5 h-5",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-sm font-normal",
                  isSelected ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
      {form.formState.errors?.step3?.services && (
        <AlertError
          errorMessage={form.formState.errors?.step3?.services?.message}
        />
      )}
    </div>
  );
}
