import { ProductCard } from "@/types/product";
import { create } from "zustand";

interface ProductStore {
  currentProduct: ProductCard | undefined,
  setCurrentProduct: (product: ProductCard) => void
}

export const currentProductStore = create<ProductStore>((set) => ({
  currentProduct: undefined,
  setCurrentProduct: (product) => set({ currentProduct: product})
}))

