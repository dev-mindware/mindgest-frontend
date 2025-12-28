"use client";
import { clientsFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useClientsFilters() {
  const router = useRouter();
  const query = useSearchParams();

  const filters: clientsFilters = {
    status: query.get("status") || undefined,
    sortBy: query.get("sortBy") || undefined,
    sortOrder: query.get("sortOrder") || undefined,
    createdAfter: query.get("createdAfter") || undefined,
    createdBefore: query.get("createdBefore") || undefined,
  };

  function setFilters(newFilters: Partial<clientsFilters>) {
    const updated = { ...filters, ...newFilters };
    const searchParams = new URLSearchParams();

    if (updated.status) searchParams.set("status", updated.status);
    if (updated.sortBy) searchParams.set("sortBy", updated.sortBy);
    if (updated.sortOrder) searchParams.set("sortOrder", updated.sortOrder);
    if (updated.createdAfter)
      searchParams.set("createdAfter", updated.createdAfter);
    if (updated.createdBefore)
      searchParams.set("createdBefore", updated.createdBefore);
    searchParams.set("page", "1");

    router.push(`?${searchParams.toString()}`);
  }

  function setPage(page: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("page", String(page));
    router.push(`?${searchParams.toString()}`);
  }

  const page = Number(query.get("page")) || 1;

  return { filters, setFilters, page, setPage };
}
