"use client";
import { InvoiceFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useInvoiceFilters() {
  const router = useRouter();
  const query = useSearchParams();

  const filters: InvoiceFilters = {
    status: (query.get("status") as InvoiceFilters["status"]) || undefined,
    sortBy: query.get("sortBy") || undefined,
    sortOrder: query.get("sortOrder") || undefined,
    search: query.get("search") || undefined,
    invoiceNumber: query.get("invoiceNumber") || undefined,
    clientName: query.get("clientName") || undefined,
    startDate: query.get("startDate") || undefined,
    endDate: query.get("endDate") || undefined,
    storeId: query.get("storeId") || undefined,
    minAmount: query.get("minAmount")
      ? Number(query.get("minAmount"))
      : undefined,
    maxAmount: query.get("maxAmount")
      ? Number(query.get("maxAmount"))
      : undefined,
  };

  function setFilters(newFilters: Partial<InvoiceFilters>) {
    const updated = { ...filters, ...newFilters };
    const searchParams = new URLSearchParams(query.toString()); // Start with existing params

    // Helper to set or delete param
    const setOrDelete = (key: string, value: string | number | undefined) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, String(value));
      } else {
        searchParams.delete(key);
      }
    };

    setOrDelete("status", updated.status);
    setOrDelete("sortBy", updated.sortBy);
    setOrDelete("sortOrder", updated.sortOrder);
    setOrDelete("search", updated.search);
    setOrDelete("invoiceNumber", updated.invoiceNumber);
    setOrDelete("clientName", updated.clientName);
    setOrDelete("startDate", updated.startDate);
    setOrDelete("endDate", updated.endDate);
    setOrDelete("storeId", updated.storeId);
    setOrDelete("minAmount", updated.minAmount);
    setOrDelete("maxAmount", updated.maxAmount);

    searchParams.set("page", "1"); // reset page ao trocar filtro

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
