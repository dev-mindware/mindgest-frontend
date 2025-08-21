import { Plan } from "./types";

export interface LoginResponse {
  user: User;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export type Role = 'ADMIN' | 'OWNER' | 'MANAGER' | 'SELLER' | "CASHIER"

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  company: Company;
  stores: Store[];
}

interface Store {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
  plan: Plan;
}