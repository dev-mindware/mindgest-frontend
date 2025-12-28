"use client";
import { useDebounce } from "use-debounce";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  EmptyState,
  ButtonOnlyAction,
  Badge,
  CreditNotesFiltersTSX,
  CreditNotePreviewDrawer,
} from "@/components";
import { formatCurrency, formatDateTime } from "@/utils";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { DocumentStatusBadge } from "../common";
import { CreditNotesResponse } from "@/types/credit-note";
import { useCreditNotesActions, useCreditNotesFilters } from "@/hooks";

export function CreditNotesList() {
  const { search } = useURLSearchParams("search-credit-notes");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useCreditNotesFilters();
  const { handlerDetailsCreditNote } = useCreditNotesActions();
  const {
    data: creditNotes,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<CreditNotesResponse>({
    endpoint: "/credit-note",
    queryKey: ["credit-notes"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<CreditNotesResponse>[] = [
    {
      key: "number",
      header: "N° da Nota",
      render: (_, item) => item.number,
    },
    {
      key: "invoiceNumber",
      header: "Fatura",
      render: (_, item) => item.invoice.number || "N/A",
    },
    {
      key: "reason",
      header: "Motivo",
      render: (_, item) => (
        <Badge variant="outline">
          {item.reason === "CORRECTION" ? "Correção" : "Anulação"}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (_, item) => <DocumentStatusBadge status={item.status} />,
    },
    {
      key: "total",
      header: "Valor",
      render: (_, item) => (
        <span className="text-destructive">
          {formatCurrency(item.invoice.total)}
        </span>
      ),
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
          actions={[{ label: "Ver Nota", onClick: handlerDetailsCreditNote }]}
        />
      ),
    },
  ];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar notas de crédito"
      />
    );
  }

  return (
    <div className="mt-6 space-y-8">
      <CreditNotesFiltersTSX />

      {creditNotes.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Sem Notas de Crédito"
            description="Nenhuma nota de crédito encontrada"
            icon="FileMinus"
          />
        </div>
      ) : (
        <GenericTable<CreditNotesResponse>
          page={page}
          total={total}
          columns={columns}
          setPage={setPage}
          data={creditNotes}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          emptyMessage="Nenhuma nota de crédito encontrada"
        />
      )}
      <CreditNotePreviewDrawer />
    </div>
  );
}
