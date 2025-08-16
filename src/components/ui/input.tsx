<<<<<<< Updated upstream
import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground/70 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        " focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        type === "search" &&
          "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
        type === "file" &&
          "text-muted-foreground/70 file:border-input file:text-foreground p-0 pr-3 italic file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic",
        className
      )}
      {...props}
    />
  )
}

export { Input }
=======
"use client";
import * as React from "react";
import { Eye, EyeOff, icons } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon, AlertError } from "../layout";

type InputProps = {
  label?: string;
  error?: string;
  startIcon?: keyof typeof icons;
  endIcon?: keyof typeof icons;
  className?: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, startIcon, endIcon, className, type = "text", ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex items-center rounded-md border px-3 py-2 text-sm transition-colors duration-200",
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
            data-slot="input"
            className={cn(
              "flex-1 bg-transparent placeholder:text-muted-foreground text-foreground outline-none",
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
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
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
        {error && <AlertError errorMessage={error} />}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
>>>>>>> Stashed changes
