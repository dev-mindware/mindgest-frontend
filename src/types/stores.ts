export type storesFilters = {
  sortBy?: string;
  status?: string;
  sortOrder?: string;
  search?: string;
};

export type StoreData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type StoreResponse = StoreData & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreList = StoreData[];