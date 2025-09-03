"use client";
// import { api } from "@/services";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

const api = axios.create({
  baseURL: "https://mamexpress.onrender.com",
});


const TOKEN_TEST = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwN2RhNDA1LTFhYmYtNDIxZi1hM2U3LWY0NGI0ZTdmOTA0MCIsImlhdCI6MTc1NjU2MjI0NSwiZXhwIjoxNzU2NTkxMDQ1fQ.SkAWkcNC3RTGB0miz_1IYg0cDpH00UcCPYuG4PFgkzE"

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageCount: number;
}

interface UsePaginatedFetchOptions {
  endpoint: string;
  queryKey: string[] | string;
  queryParams?: Record<string, any>;
  enabled?: boolean;
}

export function usePagination<T>({
  endpoint,
  queryKey,
  queryParams = {},
  enabled = true,
}: UsePaginatedFetchOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const page = Number(searchParams.get("page")) || 1;

  const query = useQuery<PaginationResponse<T>>({
    queryKey: Array.isArray(queryKey)
      ? [...queryKey, page, queryParams]
      : [queryKey, page, queryParams],
    queryFn: async () => {
      const response = await api.get<PaginationResponse<T>>(endpoint, {
        params: { page, ...queryParams },
        headers: {
          Authorization: `Bearer ${TOKEN_TEST}`
        }
      });
      return response.data;
    },
    enabled,
    gcTime: 300_000, // tempo de cache: 5min
    retry: 1,
    placeholderData: (prev) => prev,
  });

  const updatePageInUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const goToNextPage = () => {
    if (query.data && page < query.data.pageCount) {
      updatePageInUrl(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      updatePageInUrl(page - 1);
    }
  };

  return {
    data: query.data?.data || [],
    total: query.data?.total || 0,
    page,
    lastPage: query.data?.pageCount || 1,
    isLoading: query.isLoading || isPending,
    isError: query.isError,
    goToNextPage,
    goToPreviousPage,
    setPage: updatePageInUrl,
    refetch: query.refetch,
  };
}
