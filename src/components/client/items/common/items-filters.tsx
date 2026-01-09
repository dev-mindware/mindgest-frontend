"use client";
import { Button, Input } from "@/components/ui";
import { useGetCategories, useItemsFilters } from "@/hooks";
import { ItemStatus } from "@/types/items";
import {
  itemsByOption,
  itemsOrderOption,
  itemsStatusOptions,
} from "@/constants";
import { Icon, RequestError, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";

export function ItemsFiltersTSX({ prefix }: { prefix: string }) {
  const { filters, setFilters, clearAllFilters } = useItemsFilters(prefix);
  const { search, setSearch } = useURLSearchParams(`search_${prefix}`);
  const { categories, isLoading, error, refetch } = useGetCategories();

  const hasFilter =
    filters.status ||
    filters.categoryId ||
    filters.sortBy ||
    filters.sortOrder ||
    filters.minPrice ||
    filters.maxPrice ||
    search.length > 0;

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar as categorias"
      />
    );

  return (
    <div className="w-full flex flex-col gap-4 ">
      <SearchHandlerWrapper
        search={search}
        setSearch={setSearch}
        className="flex flex-col sm:flex-row"
      />

      <div className="w-full flex items-center gap-3">
        <div className="flex items-center gap-2">
          <FilterPopover
            label="Categoria"
            icon="ChartBarStacked"
            options={categories}
            value={filters.categoryId}
            onChange={(categoryId) => setFilters({ categoryId })}
          />

          <FilterPopover
            icon="Tag"
            label="Status"
            options={itemsStatusOptions}
            value={filters.status}
            onChange={(status) => setFilters({ status: status as ItemStatus })}
          />
          <FilterPopover
            icon="List"
            label="Ordenar por"
            options={itemsByOption}
            value={filters.sortBy}
            onChange={(sortBy) => setFilters({ sortBy })}
          />

          <FilterPopover
            label="Ordem"
            icon="ListOrdered"
            options={itemsOrderOption}
            value={filters.sortOrder}
            onChange={(sortOrder) => setFilters({ sortOrder })}
          />
          <Input
            placeholder="Preço mínimo"
            value={filters.minPrice as string}
            onChange={(e) => setFilters({ minPrice: e.target.value })}
          />
          <Input
            placeholder="Preço máximo"
            value={filters.maxPrice as string}
            onChange={(e) => setFilters({ maxPrice: e.target.value })}
          />
        </div>

        {hasFilter && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="h-10 text-destructive hover:text-destructive"
          >
            <Icon name="X" className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
