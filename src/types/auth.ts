export interface LoginResponse {
  message: string;
  user: User;
  tokens: Tokens;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  storeId: string;
  company: Company;
  store: Company;
}

interface Company {
  id: string;
  name: string;
}