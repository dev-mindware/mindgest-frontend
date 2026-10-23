import { api } from "./api";
import type {
  CompleteMindschoolPayload,
  ConnectMindschoolPayload,
  ConnectMindschoolResponse,
  IntegrationService,
  IntegrationTaxOption,
  MindschoolConnection,
} from "@/types";

const BASE = "/plugins/mindschool";

export const pluginsService = {
  getStatus: async (): Promise<MindschoolConnection[]> => {
    const response = await api.get<MindschoolConnection[]>(BASE);
    return response.data;
  },

  /** O `storeId` vai explícito no corpo: a loja que emite não é a loja activa do ecrã. */
  connect: async (
    data: ConnectMindschoolPayload,
  ): Promise<ConnectMindschoolResponse> => {
    const response = await api.post<ConnectMindschoolResponse>(
      `${BASE}/connect`,
      data,
    );
    return response.data;
  },

  complete: async (data: CompleteMindschoolPayload) => {
    const response = await api.post(`${BASE}/complete`, data);
    return response.data;
  },

  disconnect: async (connectionId: string) => {
    await api.delete(`${BASE}/connections/${connectionId}`);
  },

  getServices: async (connectionId: string): Promise<IntegrationService[]> => {
    const response = await api.get<IntegrationService[]>(
      `${BASE}/connections/${connectionId}/services`,
    );
    return response.data;
  },

  getTaxes: async (): Promise<IntegrationTaxOption[]> => {
    const response = await api.get<IntegrationTaxOption[]>(`${BASE}/taxes`);
    return response.data;
  },

  setServiceTax: async (serviceId: string, taxId: string) => {
    const response = await api.patch(`${BASE}/services/${serviceId}/tax`, {
      taxId,
    });
    return response.data;
  },
};
