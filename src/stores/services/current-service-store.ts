import { ServiceCard } from "@/types";
import { create } from "zustand";

interface ServiceStore {
  currentService: ServiceCard | undefined,
  setCurrentService: (service: ServiceCard) => void
}

export const currentServiceStore = create<ServiceStore>((set) => ({
  currentService: undefined,
  setCurrentService: (service) => set({ currentService: service})
}))

