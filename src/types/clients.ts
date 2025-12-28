export type clientsFilters = {
  sortBy?: string;
  status?: string;
  sortOrder?: string;
  search?: string;
};

export interface Client {
  id: string
  name: string
  email?: string
  phone: string
  address: string
  taxNumber?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  companyId: string
}

export interface ClientSelectOption {
  value: string | number;
  label: string;
  data?: {
    id: string;
    name: string;
    taxNumber?: string;
    phone?: string;
    address?: string;
    email?: string;
  };
  __isNew__?: boolean;
}
