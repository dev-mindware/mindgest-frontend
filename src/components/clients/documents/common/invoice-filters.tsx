"use client";
import { Button, DatePicker, Input } from "@/components/ui";
import { invoiceByOption, invoiceStatusOptions } from "@/constants";
import { Icon, SearchHandlerWrapper } from "@/components/common";
import { FilterPopover } from "@/components/shared";
import { useInvoiceFilters } from "@/hooks";
import { InvoiceStatus } from "@/types";

type InvoiceType = "proforma" | "receipt" | "invoice-receipt" | "invoice";

type Props = {
  type?: InvoiceType;
  searchText: string;
};

export function InvoiceFiltersTSX({ searchText, type }: Props) {
  const { filters, setFilters } = useInvoiceFilters();

  function clearFilters() {
    setFilters({
      sortBy: undefined,
      status: undefined,
      sortOrder: undefined,
      search: undefined,
      invoiceNumber: undefined,
      clientName: undefined,
      startDate: undefined,
      endDate: undefined,
      storeId: undefined,
      minAmount: undefined,
      maxAmount: undefined,
    });
  }

  const hasFilter =
    filters.status ||
    filters.sortBy ||
    filters.sortOrder ||
    filters.search ||
    filters.invoiceNumber ||
    filters.clientName ||
    filters.startDate ||
    filters.endDate ||
    filters.storeId ||
    filters.minAmount ||
    filters.maxAmount;

  const showStatusFilter = type === "invoice";

  return (
    <SearchHandlerWrapper
      search={filters.search || ""}
      setSearch={(val) => setFilters({ search: val })}
      className="w-full flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Nº Fatura"
            value={filters.invoiceNumber || ""}
            onChange={(e) => setFilters({ invoiceNumber: e.target.value })}
            className="w-[150px]"
          />
          <Input
            placeholder="Cliente"
            value={filters.clientName || ""}
            onChange={(e) => setFilters({ clientName: e.target.value })}
            className="w-[150px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <DatePicker
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(_, formatted) => setFilters({ startDate: formatted })}
            placeholder="Data Início"
          />
          <DatePicker
            value={filters.endDate ? new Date(filters.endDate) : undefined}
            onChange={(_, formatted) => setFilters({ endDate: formatted })}
            placeholder="Data Fim"
          />
        </div>

        {showStatusFilter && (
          <FilterPopover
            icon="Tag"
            label="Status"
            value={filters.status}
            options={invoiceStatusOptions}
            onChange={(status) => setFilters({ status: status as InvoiceStatus })}
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

        {/*   <Input
          placeholder="Loja ID"
          value={filters.storeId || ""}
          onChange={(e) => setFilters({ storeId: e.target.value })}
          className="w-24"
        /> */}

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

/*
 <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min €"
            value={filters.minAmount || ""}
            onChange={(e) => setFilters({ minAmount: Number(e.target.value) })}
            className="w-20"
          />
          <Input
            type="number"
            placeholder="Max €"
            value={filters.maxAmount || ""}
            onChange={(e) => setFilters({ maxAmount: Number(e.target.value) })}
            className="w-20"
          />
        </div>
*/