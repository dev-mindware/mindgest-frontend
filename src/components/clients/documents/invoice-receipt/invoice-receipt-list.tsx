"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
  InvoicePreviewDrawer,
} from "@/components";
import { InvoiceResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { DocumentStatusBadge, InvoiceFiltersTSX } from "../common";
import { useInvoiceActions, useInvoiceFilters } from "@/hooks/invoice";

export function InvoiceReceiptList() {
  const { search } = useURLSearchParams("search-invoice-receipt");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters();
  const {
    handlerGenerateReceipt,
    handlerCancelInvoice,
    handlerDetailsInvoice,
  } = useInvoiceActions();
  const {
    data: invoicesReceipts,
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
      render: (_, item) => item.client.name,
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => formatCurrency(item.total),
    },
    {
      key: "status",
      header: "Estado",
      render: (_, item) => <DocumentStatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Criado em",
      render: (_, item) => formatDateTime(item.createdAt),
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
      <RequestError
        refetch={refetch}
        message="Erro ao carregar os documentos"
      />
    );
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <InvoiceFiltersTSX searchText="search-invoice-receipt" />

      {invoicesReceipts.length > 0 ? (
        <GenericTable<InvoiceResponse>
          page={page}
          data={invoicesReceipts}
          columns={columns}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          emptyMessage="Nenhum documento encontrado"
        />
      ) : (
        <div className="justify-start mt-6 space-y-8">
          <EmptyState
            description="Adicione novos documentos"
            title="Sem Documentos"
            icon="Users"
          />
        </div>
      )}
      <InvoicePreviewDrawer />
    </div>
  );
}
