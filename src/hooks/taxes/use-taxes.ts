"use client";
import { usePagination } from "../common/use-pagination";
import { useLocalPagination } from "../common/use-local-pagination";
import { Tax } from "@/types";
import { createTaxOptions, sortTaxesNewestFirst } from "@/utils";

export function useGetTaxes() {
  const pagination = usePagination<Tax>({
    endpoint: "/taxes",
    queryKey: "taxes",
    queryParams: { sortBy: "createdAt", sortOrder: "desc" },
  });

  const taxes = sortTaxesNewestFirst(pagination.data);
  const taxOptions = createTaxOptions(pagination.data);

  return {
    ...pagination,
    taxes,
    taxOptions,
    // Backward compatibility match for existing usage
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
    },
  };
}

export function useTaxesSelect() {
  const pagination = useLocalPagination<Tax>({
    endpoint: "/taxes",
    queryKey: "taxes_select",
    queryParams: { sortBy: "createdAt", sortOrder: "desc" },
  });

  const taxes = sortTaxesNewestFirst(pagination.data);
  const taxOptions = createTaxOptions(pagination.data);

  return {
    ...pagination,
    taxes,
    taxOptions,
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
    },
  };
}
