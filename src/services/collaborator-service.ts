import type { CollaboratorData } from "@/types";
import { api } from "./api";

export const collaboratorDataService = {
  addCollaborator: async (data: CollaboratorData) => {
    return api.post<CollaboratorData>("/auth/register/user", data);
  },
  updateCollaborator: async (id: string, data: CollaboratorData) => {
    return api.put<CollaboratorData>(`/users/${id}`, data);
  },
  deleteCollaborator: async (id: string) => {
    return api.delete<CollaboratorData>(`/users/${id}`);
  },
  toggleStatusCollaborator: async (id: string) => {
    return api.patch<CollaboratorData>(`/users/${id}/toggle-status`);
  },
};
