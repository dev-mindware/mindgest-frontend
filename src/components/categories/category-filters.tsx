"use client";
import { Button } from "@/components/ui";
import { CategoryFilters } from "@/types";
import { useRouter } from "next/navigation";
import { FilterPopover } from "../shared";
import { Icon, SearchHandlerWrapper } from "../common";
import { categorySortByOption, categorySortOrderOption, categoryStatusOptions } from "@/constants";
import { useURLSearchParams } from "@/hooks/common";

type Props = {
  filters: CategoryFilters;
  setFilters: (filters: CategoryFilters) => void;
}

export function CategoriesFilters({ filters, setFilters }: Props) {
  const router = useRouter();
  const { search, setSearch } = useURLSearchParams("search-category");

  const handleChange = (newFilters: Partial<CategoryFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const query = new URLSearchParams();
    if (updated.isActive) query.set("isActive", updated.isActive);
    if (updated.sortBy) query.set("sortBy", updated.sortBy);
    if (updated.sortOrder) query.set("sortOrder", updated.sortOrder);

    router.push(`/client/categories?${query.toString()}`);
  };

  function clearFilters() {
    handleChange({
      sortBy: undefined,
      isActive: undefined,
      sortOrder: undefined,
    });
  }

  const hasFilter =
    filters.isActive ||
    filters.sortBy ||
    filters.sortOrder ||
    search.length > 0;

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
          options={categoryStatusOptions}
          value={filters.isActive}
          onChange={(isActive) => handleChange({ isActive })}
        />

        <FilterPopover
          icon="List"
          label="Ordenar por"
          options={categorySortByOption}
          value={filters.sortBy}
          onChange={(sortBy) => handleChange({ sortBy })}
        />

        <FilterPopover
          label="Ordem"
          icon="ListOrdered"
          options={categorySortOrderOption}
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
}/*  */