import { Subscription } from "./subscription";

export interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  website?: string;
  logo?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subscription?: Subscription | null;
}

export interface Store {
  id: string;
  name: string;
}

// CREATE ACCOUNT
export type CompanyData = {
  email: string;
  name: string;
  password: string;
  phone: string;
  role: "OWNER";
  company: Company;
}

/* type CompanyReq = {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxNumber: string;
  website?: string;
  logo?: string;
} */