"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useURLSearchParams } from "@/hooks/common/use-url-search-params";
import { Icon, SearchHandlerWrapper } from "../common";
import { useGetCategories } from "@/hooks";
import { FilterPopover } from "./filter-popover";
import { ItemsFilters, ItemStatus } from "@/types/items";

export const statusOptions = [
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "OUT_OF_STOCK", label: "Fora do Stock" },
];

export const sortByOption = [
  { value: "name", label: "Nome" },
  { value: "sku", label: "SKU" },
  { value: "price", label: "Preço" },
  { value: "createdAt", label: "Mais Recente" },
  { value: "updatedAt", label: "Mais Antigo" },
];

export const sortOrderOption = [
  { value: "asc", label: "A-Z" },
  { value: "desc", label: "Z-A" },
];

type Props = {
  filters: ItemsFilters;
  setFilters: (filters: ItemsFilters) => void;
};

export function ProductsFilters({ filters, setFilters }: Props) {
  const router = useRouter();
  const { search, setSearch } = useURLSearchParams("search-items");
  const { categories, isLoading, error, refetch } = useGetCategories();

  const handleChange = (newFilters: Partial<ItemsFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const query = new URLSearchParams();
    if (updated.status) query.set("status", updated.status);
    if (updated.category) query.set("category", updated.category);
    if (updated.sortBy) query.set("sortBy", updated.sortBy);
    if (updated.sortOrder) query.set("sortOrder", updated.sortOrder);

    router.push(`/client/items?${query.toString()}`);
  };

  function clearFilters() {
    handleChange({
      sortBy: undefined,
      status: undefined,
      category: undefined,
      sortOrder: undefined,
    });
  }

  const hasFilter =
    filters.status ||
    filters.category ||
    filters.sortBy ||
    filters.sortOrder ||
    search.length > 0;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  return (
    <SearchHandlerWrapper
      search={search}
      setSearch={setSearch}
      className="flex flex-col sm:flex-row"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
        <FilterPopover
          label="Categoria"
          icon="ChartBarStacked"
          options={categories}
          value={filters.category}
          onChange={(category) => handleChange({ category })}
        />

        <FilterPopover
          icon="Tag"
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(status) => handleChange({ status: status as ItemStatus })}
        />

        <FilterPopover
          icon="List"
          label="Ordenar por"
          options={sortByOption}
          value={filters.sortBy}
          onChange={(sortBy) => handleChange({ sortBy })}
        />

        <FilterPopover
          label="Ordem"
          icon="ListOrdered"
          options={sortOrderOption}
          value={filters.sortOrder}
          onChange={(sortOrder) => handleChange({ sortOrder })}
        />

        {hasFilter && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearFilters}
            className="h-10 text-destructive bg-white hover:text-destructive"
          >
            <Icon name="X" className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </SearchHandlerWrapper>
  );
}
