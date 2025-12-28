import { api } from "./api";

export const creditNoteService = {
  updateCreditNote: async (id: string, data: any) => {
    return api.put(`/invoice/normal/${id}`, data);
  },
};
