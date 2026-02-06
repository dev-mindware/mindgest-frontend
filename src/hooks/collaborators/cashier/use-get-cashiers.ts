import { usePagination } from "@/hooks/common";
import { CashierResponse } from "@/types/collaborators";

export function useGetCashiersPaginated(
  page: number = 1,
  limit: number = 10,
  search: string = "",
) {
  return usePagination<CashierResponse>({
    endpoint: "/users",
    queryKey: ["cashiers-paginated"],
    queryParams: {
      role: "CASHIER",
      page,
      limit,
      search,
    },
  });
}
