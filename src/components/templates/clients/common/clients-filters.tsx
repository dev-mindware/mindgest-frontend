"use client";
import { Button, DatePicker } from "@/components/ui";
import { ItemStatus } from "@/types/items";
import { itemsStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { useClientsFilters } from "@/hooks/entities";

export function ClientsFiltersTSX({ children }: { children?: React.ReactNode }) {
  const { filters, setFilters, clearAllFilters } = useClientsFilters();
  const { search, setSearch } = useURLSearchParams("search-client");

  const hasFilter =
    filters.status ||
    filters.sortBy ||
    filters.sortOrder ||
    filters.createdAfter ||
    filters.createdBefore ||
    search.length > 0;

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <SearchHandlerWrapper
          search={search}
          setSearch={setSearch}
          className="w-full flex-1 flex flex-col md:flex-row gap-4"
        >
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar pb-2 sm:pb-0">
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
              value={filters.sortBy}
              options={[
                { value: "name", label: "Nome" },
                { value: "createdAt", label: "Mais Recente" },
                { value: "updatedAt", label: "Mais Antigo" },
              ]}
              onChange={(sortBy) => setFilters({ sortBy })}
            />

            <FilterPopover
              label="Sortear por"
              icon="ArrowDownUp"
              options={[
                { value: "asc", label: "ASC" },
                { value: "desc", label: "DESC" },
              ]}
              value={filters.sortOrder}
              onChange={(sortOrder) => setFilters({ sortOrder })}
            />
          </div>
        </SearchHandlerWrapper>

        {children && <div className="hidden lg:block whitespace-nowrap">{children}</div>}
      </div>

      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center">
            <DatePicker
              value={
                filters.createdBefore
                  ? new Date(filters.createdBefore)
                  : undefined
              }
              onChange={(_, formatted) =>
                setFilters({ createdBefore: formatted })
              }
              placeholder="Cadastrado antes de.."
            />
            <DatePicker
              value={
                filters.createdAfter ? new Date(filters.createdAfter) : undefined
              }
              onChange={(_, formatted) => setFilters({ createdAfter: formatted })}
              placeholder="Cadastrado depois de.."
            />
          </div>

          {hasFilter && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearAllFilters}
              className="h-10 text-destructive hover:text-destructive w-full md:w-auto"
            >
              <Icon name="X" className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>

        {children && <div className="w-full lg:hidden">{children}</div>}
      </div>
    </div>
  );
}
