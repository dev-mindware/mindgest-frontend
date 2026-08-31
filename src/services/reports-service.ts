import type {
  OwnerDashboardData,
  ManagerDashboardData,
  DashboardOverview,
  DashboardPeriodType,
} from "@/types";
import type {
  PosManagementDashboard,
  ReportExportParams,
} from "@/types/reports";
import { buildDashboardOverviewMock } from "@/mocks/dashboard-overview";
import api from "./api";

export interface DashboardOverviewParams {
  period: DashboardPeriodType;
  /** Ausente = âmbito global (OWNER); presente = âmbito de uma loja. */
  storeId?: string;
}

export const reportsService = {
  /**
   * TODO(backend): substituir o mock pela chamada real quando
   * `/reports/dashboard/overview` estiver disponível:
   *
   *   return api.get<DashboardOverview>("/reports/dashboard/overview", { params });
   *
   * A resposta mockada segue exactamente o contrato `DashboardOverview`,
   * por isso a troca não implica alterações nos hooks nem nos componentes.
   */
  getDashboardOverview: async (params: DashboardOverviewParams) => {
    const data = buildDashboardOverviewMock(params.period, {
      includeStores: !params.storeId,
    });
    return { data } as { data: DashboardOverview };
  },
  getOwnerDashboard: async () => {
    return api.get<OwnerDashboardData>("/reports/dashboard/global");
  },
  getManagerDashboard: async (storeId: string) => {
    return api.get<ManagerDashboardData>(`/reports/dashboard`, {
      params: { storeId },
    });
  },
  getPosManagementDashboard: async () => {
    return api.get<PosManagementDashboard>("/reports/dashboard/pos-management");
  },
  exportReport: async (params: ReportExportParams) => {
    return api.get<Blob>("/reports/export", {
      params,
      responseType: "blob",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  },
};
