export type CategoryData = {
  name: string,
  description: string,
}

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryResponse = {
  data: Category[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}

export type CategoryFilters = {
  sortBy: string | null;
  isActive: string | null;
  sortOrder: string | null;
};