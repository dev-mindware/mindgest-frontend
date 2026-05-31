
export type storesFilters = {
  sortBy: string | null;
  status: string | null;
  sortOrder: string | null;
  search: string | null;
};

export type StoreData = {
  name: string;
  code?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  companyId?: string;
};

export type StoreResponse = StoreData & {
  id: string;
  code?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreList = StoreData[];
