import { api } from "./api";

export const agtService = {
  getStatus: async () => {
    const response = await api.get("/agt/config/status");
    return response.data;
  },

  updatePrivateKey: async (privateKey: string) => {
    const response = await api.post("/agt/config/private-key", { privateKey });
    return response.data;
  },

  getSeries: async () => {
    const response = await api.get("/agt/series");
    return response.data;
  },

  requestSeries: async (data: { documentType: string; seriesYear: string; establishmentNumber?: string }) => {
    const response = await api.post("/agt/series/solicitar", data);
    return response.data;
  },

  listInvoices: async (params: { 
    queryStartDate: string; 
    queryEndDate: string; 
    documentType?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get("/agt/invoices", { params });
    return response.data;
  },

  consultInvoice: async (documentNo: string) => {
    const encodedDocNo = encodeURIComponent(documentNo);
    const response = await api.get(`/agt/invoice/${encodedDocNo}`);
    return response.data;
  },

  validateDocument: async (data: { 
    documentNo: string; 
    action: "CONFIRMAR" | "REJEITAR";
    deductibleVATPercentage?: number;
    nonDeductibleAmount?: number;
  }) => {
    const response = await api.post("/agt/invoice/validate", data);
    return response.data;
  },
};
