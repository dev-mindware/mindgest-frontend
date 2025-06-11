"use client"

import { forwardRef, useId } from "react"
import { Input } from "@/components"
import { Icon } from "@/components"

import type { InputHTMLAttributes } from "react"

export const InputEmail = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, placeholder = "Email", ...props }, ref) => {
  const id = useId()

  return (
    <div className="*:not-first:mt-2">
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          className={`peer ps-9 ${className ?? ""}`}
          placeholder={placeholder}
          type="email"
          {...props}
        />
        <div className="absolute inset-y-0 flex items-center justify-center pointer-events-none text-muted-foreground/80 start-0 ps-3 peer-disabled:opacity-50">
          <Icon name="AtSign" size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
})

InputEmail.displayName = "InputEmail"
