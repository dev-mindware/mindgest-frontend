import { CategoryData, CategoryResponse } from "@/types";
import { useFetch } from "../common/use-fetch";
import { categoryService } from "@/services/category-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SucessMessage } from "@/utils/messages";

export function useCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CategoryData) => categoryService.addCategory(data),
    onSuccess: () => {
      SucessMessage("Categoria adicionada com sucesso!");
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
