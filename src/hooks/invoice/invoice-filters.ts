"use client";

import { InvoiceFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useInvoiceFilters(prefix: string) {
  const router = useRouter();
  const query = useSearchParams();

  const getKey = (key: string) => `${prefix}_${key}`;

  const filters: InvoiceFilters = {
    status:
      (query.get(getKey("status")) as InvoiceFilters["status"]) || undefined,
    sortBy: query.get(getKey("sortBy")) || undefined,
    sortOrder: query.get(getKey("sortOrder")) || undefined,
    invoiceNumber: query.get(getKey("invoiceNumber")) || undefined,
    clientName: query.get(getKey("clientName")) || undefined,
    startDate: query.get(getKey("startDate")) || undefined,
    endDate: query.get(getKey("endDate")) || undefined,
  };

  const page = Number(query.get(getKey("page"))) || 1;

  function updateParam(
    searchParams: URLSearchParams,
    key: string,
    value: string | number | null | undefined
  ) {
    if (value === undefined) return;

    if (value === null || value === "") {
      searchParams.delete(key);
      return;
    }

    searchParams.set(key, String(value));
  }

  function setFilters(newFilters: Partial<InvoiceFilters>) {
    const searchParams = new URLSearchParams(query.toString());

    updateParam(searchParams, getKey("status"), newFilters.status);
    updateParam(searchParams, getKey("sortBy"), newFilters.sortBy);
    updateParam(searchParams, getKey("sortOrder"), newFilters.sortOrder);
    updateParam(
      searchParams,
      getKey("invoiceNumber"),
      newFilters.invoiceNumber
    );
    updateParam(
      searchParams,
      getKey("clientName"),
      newFilters.clientName
    );
    updateParam(searchParams, getKey("startDate"), newFilters.startDate);
    updateParam(searchParams, getKey("endDate"), newFilters.endDate);

    // reset page apenas se houve mudança de filtro
    if (Object.keys(newFilters).length > 0) {
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
  };
}
