import { create } from "zustand";
import { Cashier } from "@/types/cashier";

interface CurrentCashierState {
  currentCashier: Cashier | null;
  setCurrentCashier: (cashier: Cashier | null) => void;
}

export const useCurrentCashierStore = create<CurrentCashierState>((set) => ({
  currentCashier: null,
  setCurrentCashier: (cashier) => set({ currentCashier: cashier }),
}));
