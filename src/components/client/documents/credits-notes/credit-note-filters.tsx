"use client";

import { Button, DatePicker, Input } from "@/components/ui";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useURLSearchParams } from "@/hooks/common";
import { useCreditNotesFilters } from "@/hooks/credit-notes";
import { invoiceStatusOptions } from "@/constants";

export function CreditNotesFiltersTSX() {
  const { filters, setFilters } = useCreditNotesFilters();
  const { search, setSearch } = useURLSearchParams("search-credit-note");

  function clearFilters() {
    alert("ola limpando");
    setFilters({
      reason: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      creditNoteNumber: undefined,
      endDate: undefined,
      startDate: undefined,
    });
    setSearch("");

    alert(JSON.stringify(filters, null, 2))
    setFilters({})
  }

  const hasFilter =
    !!filters.reason ||
    !!filters.status ||
    search.length > 0 ||
    !!filters.sortBy ||
    !!filters.sortOrder ||
    !!filters.creditNoteNumber ||
    !!filters.endDate ||
    !!filters.startDate;

  return (
    <div className="w-full flex flex-col gap-4">
      <SearchHandlerWrapper
        search={search}
        setSearch={setSearch}
        className="flex flex-col sm:flex-row"
      >
        <Input
          placeholder="Nº da Nota"
          value={filters.creditNoteNumber || ""}
          onChange={(e) => setFilters({ creditNoteNumber: e.target.value })}
        />
      </SearchHandlerWrapper>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-2">
        <DatePicker
          value={filters.startDate ? new Date(filters.startDate) : undefined}
          onChange={(date) => setFilters({ startDate: date?.toISOString() })}
          placeholder="Data de fim"
        />
        <DatePicker
          value={filters.endDate ? new Date(filters.endDate) : undefined}
          onChange={(date) => setFilters({ endDate: date?.toISOString() })}
          placeholder="Data de inicio"
        />

        <FilterPopover
          icon="FileMinus"
          label="Motivo"
          value={filters.reason}
          options={[
            { label: "Anulação", value: "ANNULATION" },
            { label: "Correção", value: "CORRECTION" },
            { label: "Desconto", value: "DISCOUNT" },
          ]}
          onChange={(reason) => setFilters({ reason })}
        />

        <FilterPopover
          icon="Tag"
          label="Status"
          value={filters.status}
          options={invoiceStatusOptions}
          onChange={(status) => setFilters({ status: status as any })}
        />

        <FilterPopover
          icon="List"
          label="Ordenar por"
          value={filters.sortBy}
          onChange={(sortBy) => setFilters({ sortBy })}
          options={[
            { value: "createdAt", label: "Mais Recente" },
            { value: "updatedAt", label: "Mais Antigo" },
          ]}
        />

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
    </div>
  );
}
