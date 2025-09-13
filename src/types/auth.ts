import { Company, Store } from "./company";

export interface LoginResponse {
  message: string;
  user: User;
  tokens: Tokens;
}

export type Plan = "BASE" | "TSUNAMI" | "SMART_PRO"
export type Role = 'ADMIN' | 'OWNER' | 'MANAGER' | 'SELLER' | "CASHIER"

export enum Role2  {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  SELLER = 'SELLER',
  CASHIER = 'CASHIER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  company?: Company;
  store?: Store
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

