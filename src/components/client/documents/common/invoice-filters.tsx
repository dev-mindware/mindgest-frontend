"use client";

import { Button, DatePicker, Input } from "@/components/ui";
import { invoiceByOption, invoiceStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useInvoiceFilters, useURLSearchParams } from "@/hooks";
import { InvoiceStatus } from "@/types";

type InvoiceType =
  | "invoice"
  | "proforma"
  | "invoice-receipt"
  | "receipt";

type Props = {
  type: InvoiceType;
};

export function InvoiceFiltersTSX({ type }: Props) {
  const prefix = type;
  const { filters, setFilters } = useInvoiceFilters(prefix);
  const { search, setSearch } = useURLSearchParams(`search_${prefix}`);

  function clearFilters() {
    setFilters({
      sortBy: undefined,
      status: undefined,
      sortOrder: undefined,
      invoiceNumber: undefined,
      clientName: undefined,
      startDate: undefined,
      endDate: undefined,
    });

    setSearch("");
  }

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
    <div className="w-full flex flex-col gap-4">
      <SearchHandlerWrapper
        search={search}
        setSearch={setSearch}
        className="w-full flex gap-4"
      >
        <div className="flex items-center gap-2">
          {showStatusFilter && (
            <FilterPopover
              icon="Tag"
              label="Status"
              value={filters.status}
              options={invoiceStatusOptions}
              onChange={(status) =>
                setFilters({ status: status as InvoiceStatus })
              }
            />
          )}

          <FilterPopover
            icon="List"
            label="Ordenar por"
            options={invoiceByOption}
            value={filters.sortBy}
            onChange={(sortBy) => setFilters({ sortBy })}
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
        </div>
      </SearchHandlerWrapper>

      <div className="w-full flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Nº Fatura"
            value={filters.invoiceNumber ?? ""}
            onChange={(e) =>
              setFilters({ invoiceNumber: e.target.value })
            }
          />

          <Input
            type="search"
            placeholder="Cliente"
            value={filters.clientName ?? ""}
            onChange={(e) =>
              setFilters({ clientName: e.target.value })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <DatePicker
            value={
              filters.startDate
                ? new Date(filters.startDate)
                : undefined
            }
            onChange={(_, formatted) =>
              setFilters({ startDate: formatted })
            }
            placeholder="Data Início"
          />

          <DatePicker
            value={
              filters.endDate
                ? new Date(filters.endDate)
                : undefined
            }
            onChange={(_, formatted) =>
              setFilters({ endDate: formatted })
            }
            placeholder="Data Fim"
          />
        </div>

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
