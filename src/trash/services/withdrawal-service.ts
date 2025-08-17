import { IbanData, WithdrawData,  IBanResponse } from "@/types";
import { api } from "./api";

export const withdrawalService = {
  addIban: async (data: IbanData) => {
    return api.post<IBanResponse>("/iban/add", data);
  },
  withdraw: async (data: WithdrawData) => {
    return api.post<any>("/withdraw", data);
  },
};
