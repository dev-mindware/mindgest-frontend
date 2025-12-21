export type stockFilters = {
  sortBy?: string;
  sortOrder?: string;
  itemsId?: string;
  storeId?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minAvailable?: number;
  maxAvailable?: number;
  hasReserved?: boolean | null;
  lowStock?: boolean | null;
  outOfStock?: boolean | null;
  includeItem?: boolean | null;
  includeStore?: boolean | null;
  createdAfter?: string;
  createdBefore?: string;
};
