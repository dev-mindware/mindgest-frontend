import type { CategoryData, CategoryResponse } from "@/types";
import { api } from "./api";

export const categoryService = {
  addCategory: async (data: CategoryData) => {
    return api.post<CategoryResponse>("/categories", data);
  },
};
