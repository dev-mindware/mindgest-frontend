"use client";
import { useMemo, useState } from "react";
import { usePagination, useURLSearchParams } from "@/hooks/common";
import { useSearchParams } from "next/navigation";
import { ProductsFilters } from "./products-filters";
import { ProductCardView } from "./product-card-view";
import {
  Icon,
  Column,
  Button,
  RequestError,
  GenericTable,
  ListSkeleton,
  ButtonOnlyAction,
  ProductCardSkeletonGrid,
} from "@/components";
import { ItemResponse, ItemsFilters, ItemStatus } from "@/types";
import { StatusBadge } from "./product-status-badge";
import { formatCurrency, formatDateTime } from "@/utils";
import { useProductActions } from "@/hooks";
import {
  DeleteProductModal,
  DetailsProductModal,
  EditProductModal,
} from "./product-modals";
import { normalize } from "@/utils/normalize-string";

interface ProductListProps {
  className?: string;
}

export function ProductList({ className }: ProductListProps) {
  const query = useSearchParams();
  const { handlerDeleteProduct, handlerDetailsProduct, handlerEditProduct } =
    useProductActions();
  const { search } = useURLSearchParams("search-items");

  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [filters, setFilters] = useState<ItemsFilters>({
    status: (query.get("status") as ItemStatus) || undefined,
    sortBy: (query.get("sortBy") as string) || undefined,
    sortOrder: (query.get("sortOrder") as string) || undefined,
    categoryId: (query.get("categoryId") as string) || undefined,
  });

  const {
    data: items,
    total,
    page,
    totalPages,
    setPage,
    goToNextPage,
    goToPreviousPage,
    isLoading,
    isError,
    refetch,
  } = usePagination<ItemResponse>({
    endpoint: "/items?type=PRODUCT",
    queryKey: ["items"],
    queryParams: filters,
  });

  const filteredData = useMemo(() => {
    return items.filter((item) => {
      const term = normalize(search);
      const username = item.price?.toString() || "";
      const plan = item.name?.toLowerCase() || "";
      const sku = item.sku?.toLowerCase() || "";
      return (
        normalize(username).includes(term) ||
        normalize(plan).includes(term) ||
        normalize(sku).includes(term)
      );
    });
  }, [items, search]);

  const columns: Column<ItemResponse>[] = [
    { key: "name", header: "Nome" },
    {
      key: "price",
      header: "Preço",
      render: (_, item) => (
        <div className="text-sm text-foreground">
          {formatCurrency(item.price)}
        </div>
      ),
    },
    { key: "sku", header: "SKU" },
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
      render: (_, item) => <StatusBadge status={item.status} />,
    },
    {
      key: "action",
      header: "Ação",
      render: (_, item) => (
        <ButtonOnlyAction
          data={item}
          handleDelete={handlerDeleteProduct}
          handleEdit={handlerEditProduct}
          handleSee={handlerDetailsProduct}
        />
      ),
    },
  ];

  if (isLoading)
    return viewMode === "card" ? <ProductCardSkeletonGrid /> : <ListSkeleton />;

  if (isError) {
    return (
      <RequestError refetch={refetch} message="Erro ao carregar os produtos" />
    );
  }

  return (
    <div className="justify-start mt-6 space-y-8">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <ProductsFilters filters={filters} setFilters={setFilters} />
          <div className="sm:flex self-center gap-2 p-1 rounded-md shrink-0 bg-sidebar border">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              className={`h-8 w-8 ${
                viewMode === "card" ? "bg-sidebar border hover:bg-sidebar" : ""
              }`}
              onClick={() => setViewMode("card")}
            >
              <Icon
                name="LayoutGrid"
                size={16}
                className={`text-muted-foreground ${
                  viewMode === "card" ? "text-primary" : ""
                }`}
              />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              className={`h-8 w-8 ${
                viewMode === "table" ? "bg-sidebar border hover:bg-sidebar" : ""
              }`}
              onClick={() => setViewMode("table")}
            >
              <Icon
                name="Grid3x3"
                size={16}
                className={`text-muted-foreground ${
                  viewMode === "table" ? "text-primary" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <div
          className={`w-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${
            className ?? ""
          }`}
        >
          {filteredData.map((product) => (
            <ProductCardView key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <GenericTable<ItemResponse>
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

      <DeleteProductModal />
      <DetailsProductModal />
      <EditProductModal />
    </div>
  );
}
