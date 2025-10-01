import { CategoryData, CategoryResponse } from "@/types";
import { useFetch } from "../common/use-fetch";
import { categoryService } from "@/services/category-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";

export function useAddCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryData) => categoryService.addCategory(data),
    onSuccess: () => {
      SucessMessage("Categoria adicionada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryData }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      SucessMessage("Categoria atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      SucessMessage("Categoria removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useToggleStatusCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.toggleStatusCategory(id),
    onSuccess: () => {
      SucessMessage("Status da categoria alterado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useGetCategories() {
  const { data, error, isLoading, refetch } = useFetch<CategoryResponse>(
    "categories",
    "/categories?page=1&limit=10"
  );

  const categories =
    data?.data.map((category) => ({
      label: `${category.name}`,
      value: category.id,
    })) || [];

  return { categories, error, isLoading, refetch };
}