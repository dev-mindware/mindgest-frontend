import { useState, useMemo, useEffect } from "react";
import { Service, ServiceStatus } from "@/types";

type SortByType = "az" | "za" | "price-max" | "price-min";
type ViewMode = "card" | "table";

export function useServiceFilters(
  services: Service[],
  initialViewMode: ViewMode = "card"
) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  
  // ALTERAÇÃO 1: O estado inicial do filtro de status agora é um array vazio.
  const [statusFilter, setStatusFilter] = useState<ServiceStatus[]>([]);

  const [sortBy, setSortBy] = useState<SortByType>("az");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  const uniqueCategories = useMemo(
    () => [...new Set(services.map((s) => s.category))],
    [services]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, sortBy, viewMode]);

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchSearch = (service.name || '')
          .toLowerCase()
          .includes(search.toLowerCase());
          
        const matchCategory =
          categoryFilter.length === 0 ||
          categoryFilter.includes(service.category);
          
        // Esta lógica já funciona corretamente com um array vazio
        const matchStatus =
          statusFilter.length === 0 || statusFilter.includes(service.status);

        return matchSearch && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "az":
            return (a.name || '').localeCompare(b.name || '');
          case "za":
            return (b.name || '').localeCompare(a.name || '');
          case "price-max":
            return b.price - a.price;
          case "price-min":
            return a.price - b.price;
          default:
            return 0;
        }
      });
  }, [services, search, categoryFilter, statusFilter, sortBy]);

  const itemsPerPage = viewMode === "card" ? 8 : 6;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const paginatedServices = useMemo(() => {
      return filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
  }, [filteredServices, currentPage, itemsPerPage]);


  const handleCategoryChange = (category: string) => {
    setCategoryFilter((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  
  const handleStatusChange = (status: ServiceStatus) => {
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
    paginatedServices,
    uniqueCategories,
    totalResults: filteredServices.length,
    totalPages,
    clearFilters,
    areFiltersActive,
  };
}