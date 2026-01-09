"use client";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { CategoryCardView } from "./category-card-view";
import {
  Column,
  RequestError,
  GenericTable,
  ListSkeleton,
  ButtonOnlyAction,
  ProductCardSkeletonGrid,
  ItemStatusBadge,
  ItemViewToggle,
  ItemPaginationControls,
} from "@/components";
import { Category } from "@/types";
import { formatDateTime } from "@/utils";
import { useDebounce } from "use-debounce";
import { useCategoryActions, useCategoryFilters } from "@/hooks";
import { CategoriesFilters } from "./category-filters";
import {
  CategoryModal,
  DeleteCategoryModal,
  DetailsCategoryModal,
} from "./categories-modals";

export function CategoriesList() {
  const { search } = useURLSearchParams("search-category");
  const [debounceSearch] = useDebounce(search, 400);
  const { filters, setViewMode, viewMode, page, setPage } =
    useCategoryFilters();
  const {
    handlerDeleteCategory,
    toggleStatusCategory,
    handlerEditCategory,
    handlerDetailsCategory,
  } = useCategoryActions();
  const {
    total,
    data: categories,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<Category>({
    endpoint: "/categories",
    queryKey: ["categories"],
    queryParams: { ...filters, search: debounceSearch, page },
  });

  const columns: Column<Category>[] = [
    { key: "name", header: "Nome" },
    {
      key: "status",
      header: "Status",
      render: (_, item) => (
        <ItemStatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} />
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
      key: "updatedAt",
      header: "Actualizado em",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {formatDateTime(item.updatedAt)}
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
            { label: "Editar", onClick: handlerEditCategory },
            { label: "Ver detalhes", onClick: handlerDetailsCategory },
            {
              label: item.isActive ? "Desativar" : "Ativar",
              onClick: toggleStatusCategory,
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading)
    return viewMode === "card" ? <ProductCardSkeletonGrid /> : <ListSkeleton />;

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar as categorias"
      />
    );
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <CategoriesFilters />
          <ItemViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 ? (
            <p className="text-muted-foreground py-12">
              Nenhuma categoria encontrada
            </p>
          ) : (
            categories.map((category) => (
              <CategoryCardView key={category.id} category={category} />
            ))
          )}
        </div>
      ) : (
        <GenericTable<Category>
          page={page}
          total={total}
          setPage={setPage}
          data={categories}
          columns={columns}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      {viewMode === "card" && totalPages > 1 && (
        <ItemPaginationControls
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      <DeleteCategoryModal />
      <DetailsCategoryModal />
      <CategoryModal action="edit" />
    </div>
  );
}
