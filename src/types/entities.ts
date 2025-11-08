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
