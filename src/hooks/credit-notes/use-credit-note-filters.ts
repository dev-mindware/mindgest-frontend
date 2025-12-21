"use client";
import { CreditNoteFilters } from "@/types/credit-note";
import { useRouter, useSearchParams } from "next/navigation";

export function useCreditNotesFilters() {
  const router = useRouter();
  const query = useSearchParams();

  const filters: CreditNoteFilters = {
    creditNoteNumber: query.get("creditNoteNumber") || undefined,
    reason: query.get("reason") || undefined,
    status: query.get("status") || undefined,
    sortBy: query.get("sortBy") || undefined,
    sortOrder: query.get("sortOrder") || undefined,
    startDate: query.get("startDate") || undefined,
    endDate: query.get("endDate") || undefined,
  };

  function setFilters(newFilters: Partial<CreditNoteFilters>) {
    const updated = { ...filters, ...newFilters };
    const searchParams = new URLSearchParams();

    if (updated.creditNoteNumber)searchParams.set("creditNoteNumber", updated.creditNoteNumber);
    if (updated.reason) searchParams.set("reason", updated.reason);
    if (updated.status) searchParams.set("status", updated.status);
    if (updated.sortBy) searchParams.set("sortBy", updated.sortBy);
    if (updated.sortOrder) searchParams.set("sortOrder", updated.sortOrder);
    if (updated.startDate) searchParams.set("startDate", updated.startDate);
    if (updated.endDate) searchParams.set("endDate", updated.endDate);

    searchParams.set("page", "1");

    router.push(`?${searchParams.toString()}`);
  }

  function setPage(page: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("page", String(page));
    router.push(`?${searchParams.toString()}`);
  }

  const page = Number(query.get("page")) || 1;

  return {
    filters,
    setFilters,
    page,
    setPage,
  };
}
