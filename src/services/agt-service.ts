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
};
