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
import { useState } from "react";
import { useInvoiceFilters, useProformaActions } from "@/hooks";
import { ProformaPreviewDrawer } from "@/components/common/dynamic-drawer/proforma-preview-drawer";

// colocar filtros menos o estado

export function ProformaList() {
  const { search } = useURLSearchParams("search-proforma");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useInvoiceFilters();
  const { handlerDeleteProforma, handlerDetailsProforma, hanlderEditProforma } =
    useProformaActions();
  const {
    data: proformas,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<InvoiceResponse>({
    endpoint: "/invoice/proforma",
    queryKey: ["proforma"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<InvoiceResponse>[] = [
    { key: "number", header: "Número da Proforma" },
    {
      key: "client",
      header: "Cliente",
      render: (_, item) => {
        return item.client?.name || item.clientId;
      },
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => `${formatCurrency(item.total)}`,
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
      render: (_, item) => <DocumentStatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            { label: "Ver Proforma", onClick: handlerDetailsProforma },
            { label: "Editar", onClick: hanlderEditProforma },
            { label: "Cancelar Proforma", onClick: handlerDeleteProforma },
          ]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar as proformas" />
    );
  }

  if (proformas?.length == 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <EmptyState
          description="Nenhuma proforma encontrada"
          title="Sem Proformas"
          icon="FileText"
        />
      </div>
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <InvoiceFiltersTSX type="proforma" searchText="search-proforma" />
        </div>
      </div>

      <GenericTable<InvoiceResponse>
        page={page}
        data={proformas}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhuma proforma encontrada"
      />
      <ProformaPreviewDrawer />
    </div>
  );
}
