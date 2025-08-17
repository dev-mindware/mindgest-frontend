"use client";
import * as React from "react";
import { Eye, EyeOff, icons, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon, AlertError } from "../layout";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "quantity"
  | "file"
  | "search";

type InputProps = {
  label?: string;
  error?: string;
  startIcon?: keyof typeof icons;
  endIcon?: keyof typeof icons;
  className?: string;
  type?: InputType;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, startIcon, endIcon, className, type = "text", ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const isQuantidade = type === "quantity";
    const isFile = type === "file";

    const [quantity, setQuantidade] = React.useState<number>(
      Number(props.defaultValue) || 0
    );

    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : isQuantidade
      ? "number"
      : isFile
      ? "file"
      : type;

    const handleDecrement = () => {
      setQuantidade((prev) => Math.max(0, prev - 1));
    };

    const handleIncrement = () => {
      setQuantidade((prev) => prev + 1);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-1 text-sm font-medium text-foreground">
            {label}
          </label>
        )}

        {isQuantidade ? (
          // Layout especial para quantity
          <div className="flex items-center w-full gap-2">
            <button
              type="button"
              onClick={handleDecrement}
              className="flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80"
            >
              <Minus className="w-5 h-5 text-foreground" />
            </button>

            <div
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-sm transition-colors duration-200",
                error
                  ? "border-red-500 ring-1 ring-red-400"
                  : "border-input focus-within:border-purple-500 focus-within:ring-[3px] focus-within:ring-ring/50",
                className
              )}
            >
              <input
                ref={ref}
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={quantity}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className={cn(
                  "w-full bg-transparent placeholder:text-muted-foreground text-foreground outline-none text-center",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                )}
                {...props}
              />
            </div>

            <button
              type="button"
              onClick={handleIncrement}
              className="flex items-center justify-center w-10 h-10 rounded-md bg-muted hover:bg-muted/80"
            >
              <Plus className="w-5 h-5 text-foreground" />
            </button>
          </div>
        ) : isFile ? (
          // Layout especial para upload de ficheiros
          <div
            className={cn(
              "flex items-center rounded-md border px-3 py-2 text-sm transition-colors duration-200 w-full bg-background",
              error
                ? "border-red-500 ring-1 ring-red-400"
                : "border-input focus-within:border-purple-500 focus-within:ring-[3px] focus-within:ring-ring/50",
              className
            )}
          >
            <input
              ref={ref}
              type="file"
              className={cn(
                "flex-1 text-sm text-foreground outline-none file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/80",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
              {...props}
            />
          </div>
        ) : (
          // Layout normal para os outros tipos
          <div
            className={cn(
              "flex items-center rounded-md border px-3 py-2 text-sm transition-colors duration-200 w-full",
              error
                ? "border-red-500 ring-1 ring-red-400"
                : "border-input focus-within:border-purple-500 focus-within:ring-[3px] focus-within:ring-ring/50",
              className
            )}
          >
            {startIcon && (
              <Icon
                name={startIcon}
                size={18}
                className="mr-2 text-muted-foreground"
              />
            )}
            <input
              ref={ref}
              type={inputType}
              className={cn(
                "flex-1 bg-transparent placeholder:text-muted-foreground text-foreground outline-none text-left",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
              {...props}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-muted-foreground focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}
            {!isPassword && endIcon && (
              <Icon
                name={endIcon}
                size={18}
                className="ml-2 text-muted-foreground"
              />
            )}
          </div>
        )}

        {error && <AlertError errorMessage={error} />}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
