import { create } from "zustand";
import { Cashier } from "@/components/clients/management/pos/data";

interface CurrentCashierState {
  currentCashier: Cashier | null;
  setCurrentCashier: (cashier: Cashier | null) => void;
}

export const useCurrentCashierStore = create<CurrentCashierState>((set) => ({
  currentCashier: null,
  setCurrentCashier: (cashier) => set({ currentCashier: cashier }),
}));
