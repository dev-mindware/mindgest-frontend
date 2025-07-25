import { Icon, Option } from "@/components";
import { useFormContext } from "react-hook-form";
import { RegisterFormData } from "@/schemas";
import { cn } from "@/lib/utils";
import { AlertError } from "@/components/layout";

export function SecondStep() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  const selected = watch("step2.businessType");

  const options: Option[] = [
    { value: "cafe", label: "Café", icon: "Coffee" },
    { value: "ecommerce", label: "E-commerce", icon: "ShoppingCart" },
    { value: "loja", label: "Loja", icon: "Store" },
    { value: "tecnologia", label: "Tecnologia", icon: "Monitor" },
  ];

  return (
    <div className="top-0 max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 mb-10 text-center">
        <h1 className="text-2xl font-bold">Tipo de Negócio</h1>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setValue("step2.businessType", option.value)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-md border transition-all text-left",
              selected === option.value
                ? "border-primary bg-background ring-2 ring-primary/30"
                : "border-transparent bg-sidebar",
              "hover:border-muted-foreground/20"
            )}
          >
            {option.icon && (
              <Icon name={option.icon} className="w-5 h-5 text-foreground" />
            )}
            <span
              className={cn(
                "text-sm",
                selected === option.value
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>

      {errors?.step2?.businessType && (
        <AlertError errorMessage={errors?.step2?.businessType?.message} />
      )}
    </div>
  );
}
