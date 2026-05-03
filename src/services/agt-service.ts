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
};
