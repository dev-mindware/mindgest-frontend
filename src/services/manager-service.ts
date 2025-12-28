import type { ManagerData } from "@/types";
import { api } from "./api";

export const ManagerDataService = {
  addManager: async (data: ManagerData) => {
    return api.post<ManagerData>("/auth/register/user", data);
  },
  updateManager: async (id: string, data: ManagerData) => {
    return api.put<ManagerData>(`/users/${id}`, data);
  },
  deleteManager: async (id: string) => {
    return api.delete<ManagerData>(`/users/${id}`);
  },
};
