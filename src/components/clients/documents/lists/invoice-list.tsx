"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
} from "@/components";
import { InvoiceResponse } from "@/types";
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { DocumentStatusBadge, InvoiceFiltersTSX } from "../common";
import { useInvoiceActions, useInvoiceFilters } from "@/hooks/invoice";
import { GenerateReceiptModal } from "../modals/generate-receipt-modal";
import { CancelInvoiceModal } from "../modals/cancel-invoice-modal";
import { useRouter } from "next/navigation";

export function InvoiceList() {
  const router = useRouter();
  const { search } = useURLSearchParams("search-invoice");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters();
  const {
    handlerGenerateReceipt,
    handlerCancelInvoice,
    handlerDetailsInvoice,
  } = useInvoiceActions();
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
    endpoint: "/invoice/normal",
    queryKey: ["invoice-normal"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<InvoiceResponse>[] = [
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => {
        return item.clientId;
      },
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => `${formatCurrency(item.total)}`,
    },
    {
      key: "items",
      header: "Total de Itens",
      render: (_, item) => item.items.length,
    },
    {
      key: "status",
      header: "Estado",
      render: (_, item) => <DocumentStatusBadge status={item.status} />,
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
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            ...(item.status !== "CANCELLED" || item.status !== "PAID"
              ? [
                  {
                    label: "Cancelar Fatura",
                    onClick: handlerCancelInvoice,
                  },
                ]
              : []),

            ...(item.status !== "PAID"
              ? [
                  {
                    label: "Gerar Recibo",
                    onClick: handlerGenerateReceipt,
                  },
                ]
              : []),
            {
              label: "Ver Fatura",
              onClick: handlerDetailsInvoice,
            },
            {
              label: "Emitir Nota",
              onClick: () => {
                router.push(`/client/documents/notes/${item.id}`);
              },
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar as faturas" />
    );
  }

  if (invoices?.length == 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <EmptyState
          description="Adicione novas facturas"
          title="Sem Facturas"
          icon="FileText"
        />
      </div>
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <InvoiceFiltersTSX type="invoice" searchText="search-invoice" />
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
        emptyMessage="Nenhum gerente encontrado"
      />
      <GenerateReceiptModal />
      <CancelInvoiceModal />
    </div>
  );
}
