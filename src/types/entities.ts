export type ClientData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  companyId?: string;
};

export type ClientResponse = ClientData & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupplierData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  companyId?: string;
};

export type SupplierResponse = SupplierData & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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