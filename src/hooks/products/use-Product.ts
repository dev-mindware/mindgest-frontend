import { useCustomMutation } from '@/hooks/common';
import { ProductCard } from '@/types/product';

export const useAddProduct = () =>
  useCustomMutation<ProductCard, Partial<ProductCard>>("post", "/products", "products");

export const useEditProduct = (id: string) =>
  useCustomMutation<ProductCard, Partial<ProductCard>>("put", `/products/${id}`, "products");

export const useDeleteProduct = (id: string) =>
  useCustomMutation<void, void>("delete", `/products/${id}`, "products");
