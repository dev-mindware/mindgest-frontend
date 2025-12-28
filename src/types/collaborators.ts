export type ManagerData = {
  name: string;
  email?: string;
  password?: string;
  phone: string;
  role: string;
  companyId?: string;
  storeId?: string;
};

export type ManagerResponse = ManagerData & {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type CollaboratorData = {
  name: string;
  email?: string;
  password?: string;
  phone: string;
  role: string;
  companyId?: string;
  storeId?: string;
};

export type CollaboratorResponse = CollaboratorData & {
  id: string;
  status: any;
  createdAt: string;
  updatedAt: string;
};

export type CollaboratorFilters = {
  sortBy?: string;
  status?: string;
  sortOrder?: string;
  search?: string;
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