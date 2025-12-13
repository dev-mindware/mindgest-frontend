"use client";
import { useState } from "react";
import { ItemsFilters, ItemStatus } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useItemsFilters(prefix: string) {
  const router = useRouter();
  const query = useSearchParams();
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  const getKey = (key: string) => `${prefix}_${key}`;

  const filters: ItemsFilters = {
    status: (query.get(getKey("status")) as ItemStatus) || undefined,
    categoryId: query.get(getKey("categoryId")) || undefined,
    sortBy: query.get(getKey("sortBy")) || undefined,
    sortOrder: query.get(getKey("sortOrder")) || undefined,
  };

  const page = Number(query.get(getKey("page"))) || 1;

  function setFilters(newFilters: Partial<ItemsFilters>) {
    const searchParams = new URLSearchParams(query.toString());

    // Você passa { status: 'ACTIVE' }, o código converte para "product_status=ACTIVE" na URL
    if (newFilters.status !== undefined) {
      if (newFilters.status) searchParams.set(getKey("status"), newFilters.status);
      else searchParams.delete(getKey("status"));
    }
    
    if (newFilters.categoryId !== undefined) {
      if (newFilters.categoryId) searchParams.set(getKey("categoryId"), newFilters.categoryId);
      else searchParams.delete(getKey("categoryId"));
    }

    if (newFilters.sortBy) searchParams.set(getKey("sortBy"), newFilters.sortBy);
    if (newFilters.sortOrder) searchParams.set(getKey("sortOrder"), newFilters.sortOrder);
    
    // Reseta a página específica deste prefixo
    searchParams.set(getKey("page"), "1"); 

    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  function setPage(newPage: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set(getKey("page"), String(newPage));
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  return { filters, setFilters, viewMode, setViewMode, page, setPage };
}
