"use client";
import { CollaboratorFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useCollaboratorFilters() {
  const router = useRouter();
  const query = useSearchParams();

  const filters: CollaboratorFilters = {
    status: query.get("status") || undefined,
    sortBy: query.get("sortBy") || undefined,
    sortOrder: query.get("sortOrder") || undefined,
  };

  function setFilters(newFilters: Partial<CollaboratorFilters>) {
    const updated = { ...filters, ...newFilters };
    const searchParams = new URLSearchParams();

    if (updated.status) searchParams.set("status", updated.status);
    if (updated.sortBy) searchParams.set("sortBy", updated.sortBy);
    if (updated.sortOrder) searchParams.set("sortOrder", updated.sortOrder);
    searchParams.set("page", "1");

    router.push(`?${searchParams.toString()}`);
  }

  function setPage(page: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("page", String(page));
    router.push(`?${searchParams.toString()}`);
  }

  function clearAllFilters() {
    const searchParams = new URLSearchParams(query.toString());

    searchParams.delete("status");
    searchParams.delete("sortBy");
    searchParams.delete("sortOrder");
    searchParams.delete("page");
    searchParams.delete("search_collaborator");

    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  const page = Number(query.get("page")) || 1;

  return { filters, setFilters, clearAllFilters, page, setPage };
}
