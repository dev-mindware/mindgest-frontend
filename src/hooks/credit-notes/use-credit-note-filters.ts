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

  const page = Number(query.get("page")) || 1;

  function updateParam(
    searchParams: URLSearchParams,
    key: string,
    value: string | undefined
  ) {
    if (value === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
  }

  function setFilters(newFilters: Partial<CreditNoteFilters>) {
    const searchParams = new URLSearchParams(query.toString());

    alert("setando filtros...")
    updateParam(searchParams, "creditNoteNumber", newFilters.creditNoteNumber);
    updateParam(searchParams, "reason", newFilters.reason);
    updateParam(searchParams, "status", newFilters.status);
    updateParam(searchParams, "sortBy", newFilters.sortBy);
    updateParam(searchParams, "sortOrder", newFilters.sortOrder);
    updateParam(searchParams, "startDate", newFilters.startDate);
    updateParam(searchParams, "endDate", newFilters.endDate);

    if (Object.keys(newFilters).length > 0) {
      searchParams.set("page", "1");
    }

    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  function setPage(newPage: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("page", String(newPage));
    router.push(`?${searchParams.toString()}`, { scroll: false });
  }

  return {
    filters,
    setFilters,
    page,
    setPage,
  };
}
