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
import { formatCurrency, formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { paymentMethodMap } from "@/constants";
import { useInvoiceFilters } from "@/hooks/invoice-receipt";
import { InvoiceFiltersTSX } from "../common";
import { useReceiptActions } from "@/hooks";
import { ReceiptPreviewDrawer } from "@/components/common/dynamic-drawer/receipt-preview-drawer";
import { ReceiptResponse } from "@/types/receipt";

export function ReceiptList() {
  const { search } = useURLSearchParams("search-receipt");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters();
  const {
    data: receipts,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<ReceiptResponse>({
    endpoint: "/invoice/receipt",
    queryKey: ["receipt"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const { handlerDetailsReceipt } = useReceiptActions();

  const handleViewReceipt = (receipt: ReceiptResponse) => {
    handlerDetailsReceipt(receipt);
  };

  const columns: Column<ReceiptResponse>[] = [
    {
      key: "originalInvoiceId",
      header: "Referência",
      render: (_, item) => item.number || "N/A",
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => formatCurrency(item.total),
    },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => item.client.name || "N/A",
    },
    {
      key: "paymentMethodStr",
      header: "Método de Pagamento",
      render: (_, item) => (
        <Badge>
          {paymentMethodMap[item.paymentMethodStr] || item.paymentMethodStr}
        </Badge>
      ),
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
          actions={[{ label: "Ver Recibo", onClick: handleViewReceipt }]}
        />
      ),
    }, 
  ];

  if (isLoading) return <ListSkeleton />

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os recibos" />
    );
  }

  if (receipts?.length == 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <EmptyState
          description="Nenhum recibo encontrado"
          title="Sem Recibos"
          icon="FileText"
        />
      </div>
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <InvoiceFiltersTSX type="receipt" searchText="search-receipt" />
        </div>
      </div>

      <GenericTable<ReceiptResponse>
        page={page}
        data={receipts}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhum recibo encontrado"
      />
      <ReceiptPreviewDrawer />
    </div>
  );
}
