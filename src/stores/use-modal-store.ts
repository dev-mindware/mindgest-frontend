import { create } from "zustand";

interface ModalState {
  open: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
}

export const useModal = create<ModalState>((set) => ({
  open: {},

  openModal: (id) =>
    set((state) => ({
      open: { ...state.open, [id]: true },
    })),

  closeModal: (id) =>
    set((state) => ({
      open: { ...state.open, [id]: false },
    })),

  toggleModal: (id) =>
    set((state) => ({
      open: { ...state.open, [id]: !state.open[id] },
    })),
}));