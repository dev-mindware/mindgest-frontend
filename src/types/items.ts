export type ItemType = "SERVICE" | "PRODUCT";
export type ItemStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export type ItemsFilters = {
  sortBy?: string;
  categoryId?: string;
  status?: ItemStatus;
  sortOrder?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
};

export type ItemData = {
  id: string;
  name: string;
  description: string;
  company: string;
  sku: string;
  barcode: string;
  price: number;
  cost: number;
  status: string;
  minStock: number;
  maxStock: number;
  unit: string;
  weight: number;
  dimensions: string;
  image: string;
  hasExpiry: boolean;
  expiryDate: string;
  daysToExpiry: number;
  createdAt: string;
  updatedAt: string;
  type?: string;
  companyId: string;
  storeId: string;
  categoryId: string;
};


export type CreateItemData = {
  name: string;
  type: "PRODUCT" | "SERVICE";
  categoryId: string;
  companyId: string;
  price: number;
  cost: number;
  description?: string;
  image?: string;
  storeId?: string;
  sku?: string;
  barcode?: string;
  minStock?: number;
  maxStock?: number;
  unit?: string;
  weight?: number;
  dimensions?: string;
  hasExpiry?: boolean;
  expiryDate?: string;
  daysToExpiry?: number;
};

// Resposta do backend: reaproveita ItemData e adiciona campos de controle
export type ItemResponse = ItemData & {
  id: string;
  category: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type ViewMode = "card" | "table"