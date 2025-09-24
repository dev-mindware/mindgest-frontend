import { useState } from 'react';

export type ViewMode = 'card' | 'table';

export function useProductFilters(initialViewMode: ViewMode = 'card') {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode);

  // Construir objeto de filtros para a API
  const apiFilters = {
    ...(search && { search }),
    ...(categoryFilter.length > 0 && { category: categoryFilter.join(',') }),
    ...(statusFilter.length > 0 && { status: statusFilter.join(',') }),
    ...(typeFilter.length > 0 && { type: typeFilter.join(',') }),
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(prev =>
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter([]);
    setStatusFilter([]);
    setTypeFilter([]);
  };

  const areFiltersActive = search !== '' || categoryFilter.length > 0 || statusFilter.length > 0 || typeFilter.length > 0;

  return {
    search,
    setSearch,
    categoryFilter,
    handleCategoryChange,
    statusFilter,
    handleStatusChange,
    typeFilter,
    handleTypeChange,
    viewMode,
    setViewMode,
    apiFilters,
    clearFilters,
    areFiltersActive,
  };
}