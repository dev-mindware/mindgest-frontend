"use client";
import { useQuery } from "@tanstack/react-query";
import { taxesService } from "@/services";
import { useState } from "react";

export function useGetTaxes() {
  const [page, setPage] = useState(1);

  const { data, ...rest } = useQuery({
    queryKey: ["taxes"],
    queryFn: () => taxesService.get(),
  });

  const taxOptions =
    data?.map((tax) => ({
      label: `${tax.name} (${tax.rate}%)`,
      value: tax.id,
    })) || [];

  return {
    ...rest,
    taxes: data || [],
    taxOptions,
    // Pagination stub — taxes are loaded all at once (single page)
    pagination: { page, totalPages: 1 },
    setPage,
  };
}
