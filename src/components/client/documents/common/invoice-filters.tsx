"use client";

import { Button, DatePicker, Input } from "@/components/ui";
import { invoiceByOption, invoiceStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useInvoiceFilters, useURLSearchParams } from "@/hooks";
import { InvoiceStatus } from "@/types";

type InvoiceType = "invoice" | "proforma" | "invoice-receipt" | "receipt";

type Props = {
  type: InvoiceType;
};

export function InvoiceFiltersTSX({ type }: Props) {
  const prefix = type;
  const { filters, setFilters, clearAllFilters } = useInvoiceFilters(prefix);
  const { search, setSearch } = useURLSearchParams(`search_${prefix}`);

  const hasFilter =
    !!filters.status ||
    !!filters.sortBy ||
    !!filters.sortOrder ||
    !!filters.invoiceNumber ||
    !!filters.clientName ||
    !!filters.startDate ||
    !!filters.endDate ||
    search.length > 0;

  const showStatusFilter = type === "invoice";

  return (
    <div className="w-full flex flex-col gap-4 px-2 sm:px-0" data-tour="documents-filters">
      {/* Search Input and Filter Popovers */}
      <div className="w-full flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div data-tour="documents-filter-search">
          <SearchHandlerWrapper
            search={search}
            setSearch={setSearch}
            className="w-full"
            placeholder="Pesquise por cliente ou nº da Factura"
          />
          </div>
          <div data-tour="documents-filter-client">
          <Input
            type="search"
            placeholder="Cliente"
            value={filters.clientName ?? ""}
            onChange={(e) => setFilters({ clientName: e.target.value })}
            className="w-full"
          />
          </div>
        </div>

        {/* Filter Popovers - Full width on mobile, auto width on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {showStatusFilter && (
            <div data-tour="documents-filter-status">
            <FilterPopover
              icon="Tag"
              label="Status"
              value={filters.status}
              options={invoiceStatusOptions}
              onChange={(status) =>
                setFilters({ status: status as InvoiceStatus })
              }
            />
            </div>
          )}

          <div data-tour="documents-filter-sort-by">
          <FilterPopover
            icon="List"
            label="Ordenar por"
            options={invoiceByOption}
            value={filters.sortBy}
            onChange={(sortBy) => setFilters({ sortBy })}
          />
          </div>

          <div data-tour="documents-filter-sort-order">
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
          </div>
          <div data-tour="documents-filter-number">
          <Input
            type="search"
            placeholder="Nº Fatura"
            value={filters.invoiceNumber ?? ""}
            onChange={(e) => setFilters({ invoiceNumber: e.target.value })}
            className="w-full"
          />
          </div>
        </div>
      </div>

      {/* Date Pickers and Clear Button - 3 columns on desktop */}
      <div className="flex justify-center sm:justify-start">
        <div className="grid grid-cols-2 gap-3">
          <div data-tour="documents-filter-start-date">
          <DatePicker
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(_, formatted) => setFilters({ startDate: formatted })}
            placeholder="Data Início"
          />
          </div>

          <div data-tour="documents-filter-end-date">
          <DatePicker
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={(_, formatted) => setFilters({ endDate: formatted })}
            placeholder="Data Fim"
          />
          </div>
        </div>

        {/* Clear Button */}
        {hasFilter && (
          <Button
            data-tour="documents-filter-clear"
            size="sm"
            variant="outline"
            onClick={clearAllFilters}
            className="h-10 text-destructive hover:text-destructive w-full whitespace-nowrap"
          >
            <Icon name="X" className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
