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

  // Ensure taxesArray is always an array, even if the API wraps it in data/items
  const taxesArray: any[] = Array.isArray(data)
    ? data
    : data && typeof data === "object"
      ? (data as any).data || (data as any).items || []
      : [];

  const taxOptions = taxesArray.map((tax) => ({
    label: `${tax.name} (${tax.rate}%)`,
    value: tax.id,
  }));

  return {
    ...rest,
    taxes: taxesArray,
    taxOptions,
    // Pagination stub — taxes are loaded all at once (single page)
    pagination: { page, totalPages: 1 },
    setPage,
  };
}
