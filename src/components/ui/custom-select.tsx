"use client";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Label,
} from "@/components/ui/";
import { AlertError } from "../layout";

type Option = {
  label: string;
  value: string;
};

interface RHFSelectProps<T extends FieldValues> {
  label?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  name: Path<T>;
  control?: Control<T>;
}

export function RHFSelect<T extends FieldValues>({
  name,
  label,
  control,
  options,
  placeholder = "Escolhe uma opção",
  disabled = false,
}: RHFSelectProps<T>) {
  return (
    <div className="">
      {label && <Label className="mb-1" htmlFor={name}>{label}</Label>}

      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Select
              value={field.value || ""}
              onValueChange={(value) => field.onChange(value)}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.error && (
              <AlertError errorMessage={fieldState.error.message} />
            )}
          </>
        )}
      />
    </div>
  );
}
