export type ManagerData = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  companyId?: string;
  storeId?: string;
};

export type ManagerResponse = ManagerData & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
