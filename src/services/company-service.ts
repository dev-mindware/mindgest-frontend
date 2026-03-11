import type { User as CompanyResponse, CompanyData } from "@/types";
import { api } from "./api";

// We assume CompanyData contains all fields for PUT
export type UpdateCompanyPayload = Partial<CompanyData>;

export const companyService = {
  addCompany: async (data: CompanyData) => {
    return api.post<CompanyResponse>("/companies", data);
  },
  updateCompany: async (id: string, data: UpdateCompanyPayload) => {
    return api.put<CompanyResponse>(`/companies/${id}`, data);
  },
};
