import { create } from "zustand";
import { ReceiptData } from "@/types";

interface ReceiptStore {
  currentReceipt: ReceiptData | undefined;
  setCurrentReceipt: (receipt: ReceiptData) => void;
}

export const currentReceiptStore = create<ReceiptStore>((set) => ({
  currentReceipt: undefined,
  setCurrentReceipt: (receipt) => set({ currentReceipt: receipt }),
}));
