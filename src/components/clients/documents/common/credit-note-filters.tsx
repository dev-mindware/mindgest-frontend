"use client";

import { Button, DatePicker } from "@/components/ui";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { useCreditNotesFilters } from "@/hooks/credit-notes";
import { invoiceStatusOptions, usersByOption } from "@/constants";

export function CreditNotesFiltersTSX() {
  const { filters, setFilters } = useCreditNotesFilters();
  const { search, setSearch } = useURLSearchParams("search-credit-notes");

  function clearFilters() {
    setFilters({
      reason: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      search: undefined,
    });
    setSearch("");
  }

  const hasFilter =
    !!filters.reason ||
    !!filters.status ||
    !!filters.sortBy ||
    !!filters.sortOrder ||
    search.length > 0;

  return (
    <SearchHandlerWrapper
      search={search}
      setSearch={setSearch}
      className="flex flex-col sm:flex-row"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
        {/* Motivo da Nota de Crédito */}
        <FilterPopover
          icon="FileMinus"
          label="Motivo"
          value={filters.reason}
          options={[
            { label: "Anulação", value: "ANNULATION" },
            { label: "Correção", value: "CORRETION" },
          ]}
          onChange={(reason) => setFilters({ reason })}
        />

        {/* Status */}
        <FilterPopover
          icon="Tag"
          label="Status"
          value={filters.status}
          options={invoiceStatusOptions}
          onChange={(status) => setFilters({ status: status as any })}
        />

        <DatePicker
          value={filters.endDate ? new Date(filters.endDate) : undefined}
          onChange={(date) => setFilters({ endDate: date?.toISOString() })}
          placeholder="Data de inicio"
        />
        <DatePicker
          value={filters.startDate ? new Date(filters.startDate) : undefined}
          onChange={(date) => setFilters({ startDate: date?.toISOString() })}
          placeholder="Data de fim"
        />


        {/* Ordenar por */}
        <FilterPopover
          icon="List"
          label="Ordenar por"
          options={usersByOption}
          value={filters.sortBy}
          onChange={(sortBy) => setFilters({ sortBy })}
        />

        {/* Ordem */}
        <FilterPopover
          label="Ordem"
          icon="ArrowDownUp"
          options={[
            { value: "asc", label: "ASC" },
            { value: "desc", label: "DESC" },
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
