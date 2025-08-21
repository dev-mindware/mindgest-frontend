import { useCustomMutation } from '@/hooks/common';
import { Product } from '@/types';

export const useAddProduct = () =>
  useCustomMutation<Product, Partial<Product>>("post", "/products", "products");

export const useEditProduct = (id: string) =>
  useCustomMutation<Product, Partial<Product>>("put", `/products/${id}`, "products");

export const useDeleteProduct = (id: string) =>
  useCustomMutation<void, void>("delete", `/products/${id}`, "products");
