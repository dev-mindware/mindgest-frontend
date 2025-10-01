"use client";
import { useState } from "react";
import { ItemsFilters, ItemStatus } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useItemsFilters() {
  const router = useRouter();
  const query = useSearchParams();
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  const filters: ItemsFilters = {
    status: (query.get("status") as ItemStatus) || undefined,
    categoryId: query.get("categoryId") || undefined,
    sortBy: query.get("sortBy") || undefined,
    sortOrder: query.get("sortOrder") || undefined,
  };

  function setFilters(newFilters: Partial<ItemsFilters>) {
    const updated = { ...filters, ...newFilters };
    const searchParams = new URLSearchParams();

    if (updated.status) searchParams.set("status", updated.status);
    if (updated.categoryId) searchParams.set("categoryId", updated.categoryId);
    if (updated.sortBy) searchParams.set("sortBy", updated.sortBy);
    if (updated.sortOrder) searchParams.set("sortOrder", updated.sortOrder);
    searchParams.set("page", "1"); // reset page ao trocar filtro

    router.push(`?${searchParams.toString()}`);
  }

  function setPage(page: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("page", String(page));
    router.push(`?${searchParams.toString()}`);
  }

  const page = Number(query.get("page")) || 1;

  return { filters, setFilters, viewMode, setViewMode, page, setPage };
}