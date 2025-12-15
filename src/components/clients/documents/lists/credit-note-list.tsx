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
} from "@/components";
import { formatCurrency, formatDateTime } from "@/utils";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { CreditNotesFiltersTSX, DocumentStatusBadge } from "../common";
import { CreditNoteData } from "@/types/documents";
import { useCreditNotesFilters } from "@/hooks";

export function CreditNotesList() {
  const { search } = useURLSearchParams("search-credit-notes");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useCreditNotesFilters();

  const {
    data: creditNotes,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<CreditNoteData>({
    endpoint: "/credit-note",
    queryKey: ["credit-notes"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const handleViewCreditNote = (note: CreditNoteData) => {
    // aqui podes abrir drawer, modal ou navegar
    console.log("Ver nota de crédito:", note);
  };

  const columns: Column<CreditNoteData>[] = [
    {
      key: "number",
      header: "Nota de Crédito",
      render: (_, item) => item.number,
    },
    {
      key: "invoiceNumber",
      header: "Fatura",
      render: (_, item) => item.invoiceNumber,
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
        <span className="text-destructive">{formatCurrency(item.total)}</span>
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
          actions={[{ label: "Ver Nota", onClick: handleViewCreditNote }]}
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

  if (!creditNotes || creditNotes.length === 0) {
    return (
      <div className="mt-6">
        <EmptyState
          title="Sem Notas de Crédito"
          description="Nenhuma nota de crédito encontrada"
          icon="FileMinus"
        />
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-8">
      <CreditNotesFiltersTSX />
      <GenericTable<CreditNoteData>
        page={page}
        data={creditNotes}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhuma nota de crédito encontrada"
      />
    </div>
  );
}
