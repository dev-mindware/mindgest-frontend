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