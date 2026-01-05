import { StoreResponse } from "@/types";
import { create } from "zustand";

interface CurrentStoreState {
  currentStore: StoreResponse | undefined;
  setCurrentStore: (store: StoreResponse | undefined) => void;
}

export const currentStoreStore = create<CurrentStoreState>((set) => ({
  currentStore: undefined,
  setCurrentStore: (store) => set({ currentStore: store }),
}));
