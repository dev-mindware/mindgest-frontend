"use client"
import { type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components"

import { IconCheckSucessfull } from "./icon-sucess"
import { IconWarning } from "./icon-warning"
import { cn } from "@/lib/utils"
import { useModal } from "@/contexts"

interface ModalProps {
  id: string
  title?: string | ReactNode
  description?: string
  canClose?: boolean
  children?: ReactNode
  footer?: ReactNode
  className?: string
  sucess?: boolean
  warning?: boolean
}

export function GlobalModal({
  id,
  title,
  sucess,
  warning,
  description,
  canClose,
  children,
  footer,
  className,
}: ModalProps) {
  const { open, closeModal } = useModal()

  return (
    <Dialog
      open={open[id] || false}
      onOpenChange={(isOpen) => {
        if (!isOpen && canClose) {
          closeModal(id)
        }
      }}
    >
      <DialogContent
        className={className}
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
      >
        {canClose && (
          <DialogClose
            onClick={() => closeModal(id)}
          />
        )}

        <DialogHeader className={cn("flex space-x-4 relative")}>
          <div
            className={cn("flex space-x-4 items-center", {
              "flex-col": sucess,
            })}
          >
            {sucess && <IconCheckSucessfull />}
            {warning && <IconWarning />}

            <div
              className={cn("space-y-2", {
                "flex flex-col items-center": sucess,
              })}
            >
              <DialogTitle className="w-max">{title}</DialogTitle>
              {description && (
                <DialogDescription
                  className={cn("", {
                    "text-center": sucess,
                  })}
                >
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {children && <div>{children}</div>}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
