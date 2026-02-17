import type { BankData, BankResponse } from "@/types";
import api from "./api";

export const banksService = {
  addBank: async (data: BankData) => {
    return api.post<BankResponse>("/bank-accounts", data);
  },
  updateBank: async (id: string, data: Partial<BankData>) => {
    return api.patch<BankResponse>(`/bank-accounts/${id}`, data);
  },
  deleteBank: async (id: string) => {
    return api.delete<void>(`/bank-accounts/${id}`);
  },
  getBanks: async () => {
    return api.get("/bank-accounts");
  },
};