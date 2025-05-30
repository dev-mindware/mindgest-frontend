"use client"
import { type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components"

import { Icon } from "../icon"
import { IconCheckSucessfull } from "./icon-sucess"
import { IconWarning } from "./icon-warning"
import { cn } from "@/lib/utils"
import { useModal } from "@/contexts"

interface ModalProps {
  id: string
  title?: string | ReactNode
  description?: string
  canClose?: boolean
  children: ReactNode
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
          <button
            onClick={() => closeModal(id)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
          >
            <Icon name="X" size={20} />
          </button>
        )}

        <DialogHeader className={cn("flex space-x-4 relative")}>
          <div className={cn("flex space-x-4 items-center", {
            "flex-col": sucess
          })}>

            {sucess && <IconCheckSucessfull />}
            {warning && <IconWarning />}

            <div className={cn("space-y-2", {
              "flex flex-col items-center ": sucess
            })}>
              <DialogTitle className="w-max">{title}</DialogTitle>
              {description && <DialogDescription className={cn("", {
                "text-center": sucess
              })}>{description}</DialogDescription>}
            </div>
          </div>
        </DialogHeader>

        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}