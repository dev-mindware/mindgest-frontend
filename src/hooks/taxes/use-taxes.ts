"use client";
import { usePagination } from "../common/use-pagination";
import { useLocalPagination } from "../common/use-local-pagination";
import { Tax } from "@/types";

export function useGetTaxes() {
  const pagination = usePagination<Tax>({
    endpoint: "/taxes",
    queryKey: "taxes",
  });

  const taxOptions = pagination.data.map((tax) => ({
    label: `${tax.name} (${tax.rate}%)`,
    value: tax.id,
  }));

  return {
    ...pagination,
    taxes: pagination.data,
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
  });

  const taxOptions = pagination.data.map((tax) => ({
    label: `${tax.name} (${tax.rate}%)`,
    value: tax.id,
  }));

  return {
    ...pagination,
    taxes: pagination.data,
    taxOptions,
    pagination: {
      page: pagination.page,
      totalPages: pagination.totalPages,
    },
  };
}
