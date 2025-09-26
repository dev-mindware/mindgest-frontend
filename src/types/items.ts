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
};

export interface ItemData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  price: number; // preço de venda
  cost: number; // preço de compra
  minStock?: number;
  maxStock?: number;
  unit?: string;
  weight?: number;
  dimensions?: string;
  image?: string;
  type: ItemType;
  companyId: string;
  storeId?: string;
  categoryId?: string;
  hasExpiry?: boolean;
  expiryDate?: string;
  daysToExpiry?: number;
}

// Resposta do backend: reaproveita ItemData e adiciona campos de controle
export type ItemResponse = ItemData & {
  id: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
};

export type ViewMode = "card" | "table"