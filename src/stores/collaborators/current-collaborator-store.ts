import { CollaboratorResponse } from "@/types";
import { create } from "zustand";

interface CollaboratorStore {
  currentCollaborator: CollaboratorResponse | undefined,
  setCurrentCollaborator: (collaborator: CollaboratorResponse) => void
}

export const currentCollaboratorStore = create<CollaboratorStore>((set) => ({
  currentCollaborator: undefined,
  setCurrentCollaborator: (collaborator) => set({ currentCollaborator: collaborator})
}))

