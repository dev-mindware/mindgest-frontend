import { useFetch } from "../common/use-fetch";

export function useGetItems() {
  const { data, error, isLoading, refetch } = useFetch<any>(
    "items-for-select",
    "/items?page=1&limit=100"
  );

  const items =
    data?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [];

  return { items, error, isLoading, refetch };
}
