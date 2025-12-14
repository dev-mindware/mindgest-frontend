"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
  Badge,
} from "@/components";
import { InvoiceResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { DocumentStatusBadge, InvoiceFiltersTSX } from "../common";
import { useInvoiceActions, useInvoiceFilters } from "@/hooks/invoice";
import { InvoicePreviewDrawer } from "@/components/common/dynamic-drawer/invoice-preview-drawer";


export function InvoiceReceiptList() {
  const { search } = useURLSearchParams("search-invoice-receipt");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters();
  const { handlerGenerateReceipt, handlerCancelInvoice, handlerDetailsInvoice } =
    useInvoiceActions();
  const {
    data: invoices,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<InvoiceResponse>({
    endpoint: "/invoice/invoice-receipt",
    queryKey: ["invoice-receipt"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<InvoiceResponse>[] = [
    { key: "number", header: "Número da Fatura" },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => {
        return item.client.name;
      },
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => formatCurrency(item.total)
    },
    {
      key: "createdAt",
      header: "Criado em",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {formatDateTime(item.createdAt)}
        </div>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (_, item) => <DocumentStatusBadge status={item.status} />
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            {
              label: "Ver Factura",
              onClick: handlerDetailsInvoice,
            },
            {
              label: "Emitir Nota",
              onClick: handlerCancelInvoice,
            },

          ]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os documentos" />
    );
  }

  if (invoices?.length == 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <EmptyState
          description="Adicione novos documentos"
          title="Sem Documentos"
          icon="Users"
        />
      </div>
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <InvoiceFiltersTSX searchText="search-invoice-receipt" />
        </div>
      </div>

      <GenericTable<InvoiceResponse>
        page={page}
        data={invoices}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhum documento encontrado"
      />
      <InvoicePreviewDrawer />
    </div>
  );
}
