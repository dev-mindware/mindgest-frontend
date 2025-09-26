"use client";
import { useMemo, useState } from "react";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { useSearchParams } from "next/navigation";
import {
  Column,
  GenericTable,
  RequestError,
  ListSkeleton,
  ButtonOnlyAction,
  Button,
  ViewMode,
  ProductCardSkeletonGrid,
} from "@/components";
import { CategoryFilters, Category } from "@/types";
import { formatDateTime } from "@/utils";
import { normalize } from "@/utils/normalize-string";
import { CategoriesFilters } from "./category-filters";
import { CategoryCardView } from "./category-card-view";

interface ProductListProps {
  className?: string;
}

export function CategoriesList({ className }: ProductListProps) {
  const query = useSearchParams();
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const { search } = useURLSearchParams("search-category");

  const [filters, setFilters] = useState<CategoryFilters>({
    isActive: query.get("isActive") || undefined,
    sortBy: query.get("sortBy") || undefined,
    sortOrder: query.get("sortOrder") || undefined,
  });

  const {
    data: categories,
    total,
    page,
    totalPages,
    setPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<Category>({
    endpoint: "/categories",
    queryKey: ["categories"],
    queryParams: filters,
  });

  const filteredData = useMemo(() => {
    return categories.filter((item) => {
      const term = normalize(search);
      const name = item.name?.toString() || "";
      const desc = item.description?.toLowerCase() || "";
      return normalize(name).includes(term) || normalize(desc).includes(term);
    });
  }, [categories, search]);

  const columns: Column<Category>[] = [
    { key: "name", header: "Nome" },
    {
      key: "status",
      header: "Status",
      render: (_, item) => (
        <p className="text-xs">
          <span
            className={`font-medium text-sm ${
              item.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.isActive ? "Ativo" : "Inativa"}
          </span>
        </p>
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
          handleDelete={() => {}}
          handleEdit={() => {}}
          handleSee={() => {}}
        />
      ),
    },
  ];

  if (isLoading)
    return viewMode === "card" ? (
      <ProductCardSkeletonGrid />
    ) : (
      <ListSkeleton cols={4} rows={6} />
    );

  if (isError) {
    return (
      <RequestError
        refetch={refetch}
        message="Erro ao carregar as categorias"
      />
    );
  }

  return (
    <div className="justify-start mt-8 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <CategoriesFilters filters={filters} setFilters={setFilters} />
          <ViewMode setViewMode={setViewMode} viewMode={viewMode} />
        </div>
      </div>

      {viewMode === "card" ? (
        <div
          className={`w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            className ?? ""
          }`}
        >
          {filteredData.map((category) => (
            <CategoryCardView key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <GenericTable<Category>
          data={filteredData}
          columns={columns}
          page={page}
          total={total}
          totalPages={totalPages}
          setPage={setPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      )}

      {viewMode === "card" && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                size="sm"
                variant={pageNum === page ? "default" : "outline"}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}
        </div>
      )}

      {/* <DeleteProductModal />
      <DetailsProductModal />
      <EditProductModal /> */}
    </div>
  );
}
