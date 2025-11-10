"use client";
import { Button } from "@/components/ui";
import { ItemStatus } from "@/types/items";
import {
  itemsByOption,
  itemsStatusOptions,
} from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { useManagerFilters } from "@/hooks/collaborators";

export function ManagerFiltersTSX() {
  const { filters, setFilters } = useManagerFilters();
  const { search, setSearch } = useURLSearchParams("search-managers");

  function clearFilters() {
    setFilters({
      sortBy: undefined,
      status: undefined,
      sortOrder: undefined,
    });
  }

  const hasFilter =
    filters.status || filters.sortBy || filters.sortOrder || search.length > 0;

  return (
    <SearchHandlerWrapper
      search={search}
      setSearch={setSearch}
      className="flex flex-col sm:flex-row"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
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
          options={[
            { value: "name", label: "Nome" },
            { value: "createdAt", label: "Mais Recente" },
            { value: "updatedAt", label: "Mais Antigo" },
          ]}
          value={filters.sortOrder}
          onChange={(sortOrder) => setFilters({ sortOrder })}
        />

        {hasFilter && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearFilters}
            className="h-10 text-destructive hover:text-destructive"
          >
            <Icon name="X" className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </SearchHandlerWrapper>
  );
}
