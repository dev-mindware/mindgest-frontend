import { useState, useMemo, useEffect } from "react";
import { Product, ProductStatus } from "@/types";

type SortByType = "az" | "za" | "price-max" | "price-min";
type ViewMode = "card" | "table";

export function useProductFilters(
  products: Product[],
  initialViewMode: ViewMode = "card"
) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  
  const [statusFilter, setStatusFilter] = useState<ProductStatus[]>([]);

  const [sortBy, setSortBy] = useState<SortByType>("az");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const uniqueCategories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, sortBy, viewMode]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchSearch = (product.name || '')
          .toLowerCase()
          .includes(search.toLowerCase());
          
        const matchCategory =
          categoryFilter.length === 0 ||
          categoryFilter.includes(product.category);

        const matchStatus =
          statusFilter.length === 0 || statusFilter.includes(product.status!);

        return matchSearch && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "az":
            return (a.name || '').localeCompare(b.name || '');
          case "za":
            return (b.name || '').localeCompare(a.name || '');
          case "price-max":
            return b.price! - a.price!;
          case "price-min":
            return a.price! - b.price!;
          default:
            return 0;
        }
      });
  }, [products, search, categoryFilter, statusFilter, sortBy]);

  const itemsPerPage = viewMode === "card" ? 8 : 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
      return filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
  }, [filteredProducts, currentPage, itemsPerPage]);


  const handleCategoryChange = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleStatusChange = (status: ProductStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter([]);
    // ALTERAÇÃO 2: A função de limpar agora redefine para um array vazio.
    setStatusFilter([]);
    setSortBy("az");
  };

  // ALTERAÇÃO 3: A lógica para saber se os filtros estão ativos foi simplificada.
  const areFiltersActive =
    search !== "" ||
    categoryFilter.length > 0 ||
    statusFilter.length > 0; // Se qualquer status for selecionado, o filtro está ativo.

  return {
    search, setSearch,
    sortBy, setSortBy,
    viewMode, setViewMode,
    currentPage, setCurrentPage,
    categoryFilter, handleCategoryChange,
    statusFilter, handleStatusChange,
    paginatedProducts,
    uniqueCategories,
    totalResults: filteredProducts.length,
    totalPages,
    clearFilters,
    areFiltersActive,
  };
}