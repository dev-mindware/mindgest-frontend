"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ItemsFilters, ItemStatus } from "@/types";

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
    maxPrice: query.get(getKey("maxPrice")) || undefined,
    minPrice: query.get(getKey("minPrice")) || undefined,
  };

  const page = Number(query.get(getKey("page"))) || 1;

  function updateParam(
    searchParams: URLSearchParams,
    key: string,
    value?: string | null
  ) {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
  }

  function setFilters(newFilters: Partial<ItemsFilters>) {
    const searchParams = new URLSearchParams(query.toString());
    let shouldResetPage = false;

    if ("status" in newFilters) {
      updateParam(searchParams, getKey("status"), newFilters.status);
      shouldResetPage = true;
    }

    if ("categoryId" in newFilters) {
      updateParam(searchParams, getKey("categoryId"), newFilters.categoryId);
      shouldResetPage = true;
    }

    if ("sortBy" in newFilters) {
      updateParam(searchParams, getKey("sortBy"), newFilters.sortBy);
      shouldResetPage = true;
    }

    if ("sortOrder" in newFilters) {
      updateParam(searchParams, getKey("sortOrder"), newFilters.sortOrder);
      shouldResetPage = true;
    }

    if ("minPrice" in newFilters) {
      updateParam(searchParams, getKey("minPrice"), newFilters.minPrice);
      shouldResetPage = true;
    }

    if ("maxPrice" in newFilters) {
      updateParam(searchParams, getKey("maxPrice"), newFilters.maxPrice);
      shouldResetPage = true;
    }

    if (shouldResetPage) {
      searchParams.set(getKey("page"), "1");
    }

    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  function setPage(newPage: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set(getKey("page"), String(newPage));
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  return {
    filters,
    setFilters,
    page,
    setPage,
    viewMode,
    setViewMode,
  };
}
