"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  ItemStatusBadge,
  EmptyState,
  ButtonOnlyAction,
} from "@/components";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { CollaboratorFiltersTSX } from "./common";
import {
  CollaboratorModal,
  DeleteCollaboratorModal,
  DetailsCollaboratorModal,
} from "./collaborator-modals";
import { useCollaboratorActions } from "@/hooks/collaborators/use-collaborator-actions";
import { useCollaboratorFilters } from "@/hooks/collaborators/collaborator-filters";
import { CollaboratorResponse } from "@/types/collaborators";

export function CollaboratorList() {
  const { search } = useURLSearchParams("search");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, page, setPage } = useCollaboratorFilters();
  const {
    handlerDeleteCollaborator,
    handlerDetailsCollaborator,
    handlerEditCollaborator,
    toggleStatusCollaborator,
  } = useCollaboratorActions();

  const {
    data: allCollaborators,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<CollaboratorResponse>({
    endpoint: "/users",
    queryKey: ["collaborators"],
    queryParams: {
      ...filters,
      search: debounceSearch,
      page,
    },
  });

  const filteredList =
    allCollaborators?.filter((user) => user.role !== "OWNER") || [];

  const columns: Column<CollaboratorResponse>[] = [
    { key: "name", header: "Nome" },
    {
      key: "role",
      header: "Função",
      render: (_, item) => {
        if (item.role === "MANAGER") return "GERENTE";
        if (item.role === "CASHIER") return "CAIXA";
        return item.role;
      },
    },
    {
      key: "email",
      header: "Email",
    },
    { key: "phone", header: "Telefone" },
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
      header: "Status",
      render: (_, item) => <ItemStatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          actions={[
            {
              label: "Ver detalhes",
              onClick: () => handlerDetailsCollaborator(item),
            },
            { label: "Editar", onClick: () => handlerEditCollaborator(item) },
            {
              label: "Deletar",
              onClick: () => handlerDeleteCollaborator(item),
            },
            {
              label: `${item.status === "ACTIVE" ? "Desativar" : "Ativar"}`,
              onClick: toggleStatusCollaborator,
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
        message="Erro ao carregar os colaboradores"
      />
    );
  }

  if (filteredList.length === 0)
    return (
      <div className="justify-start mt-6 space-y-8">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
            <CollaboratorFiltersTSX />
          </div>
        </div>
        <EmptyState
          description="Adicione novos colaboradores"
          title="Sem Colaboradores"
          icon="Users"
        />
      </div>
    );

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <CollaboratorFiltersTSX />
        </div>
      </div>

      <GenericTable<CollaboratorResponse>
        page={page}
        data={filteredList}
        columns={columns}
        total={total}
        totalPages={totalPages}
        setPage={setPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        emptyMessage="Nenhum colaborador encontrado"
      />

      <DetailsCollaboratorModal />
      <DeleteCollaboratorModal />
      <CollaboratorModal action="edit" />
    </div>
  );
}
