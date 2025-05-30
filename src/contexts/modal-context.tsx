"use client";
import { createContext, ReactNode, useContext, useState } from "react"

type ModalContextType = {
  open: Record<string, boolean>
  openModal: (id: string) => void
  closeModal: (id: string) => void
  toggleModal: (id: string) => void
}
const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const openModal = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: true }))
  }

  const closeModal = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: false }))
  }

  const toggleModal = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return <ModalContext.Provider value={{ open, openModal, closeModal, toggleModal }}>{children}</ModalContext.Provider>
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider")
  }
  return context
}