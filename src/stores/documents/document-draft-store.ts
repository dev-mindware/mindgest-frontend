import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ClientSelectOption } from "@/types/clients";

export type DocumentTabType = "invoice" | "invoice-receipt" | "proforma";

export interface DocumentDraftClient {
  name?: string;
  taxNumber?: string;
  address?: string;
  phone?: string;
}

export interface DocumentTabDraft {
  selectedClient: ClientSelectOption | null;
  clientId: string;
  client: DocumentDraftClient;
  items: any[];
  pendingItem: any | null;
  globalRetention: number;
  globalDiscount: number;
  currencyCode: "AOA" | "USD" | "EUR";
  notes: string;
  dueDate?: string;
  proformaExpiresAt?: string;
  paymentMethod?: string;
  updatedAt?: string;
}

type ScopeDrafts = {
  lastActiveTab?: DocumentTabType;
  tabs: Partial<Record<DocumentTabType, DocumentTabDraft>>;
};

interface DocumentDraftState {
  draftsByScope: Record<string, ScopeDrafts>;
  getTabDraft: (scope: string, tab: DocumentTabType) => DocumentTabDraft | undefined;
  getLastActiveTab: (scope: string) => DocumentTabType | undefined;
  setLastActiveTab: (scope: string, tab: DocumentTabType) => void;
  saveTabDraft: (
    scope: string,
    tab: DocumentTabType,
    draft: Partial<DocumentTabDraft>,
  ) => void;
  copyTabDraft: (scope: string, fromTab: DocumentTabType, toTab: DocumentTabType) => void;
  clearTabDraft: (scope: string, tab: DocumentTabType) => void;
  hasTabDraftContent: (scope: string, tab: DocumentTabType) => boolean;
}

export const EMPTY_DRAFT: DocumentTabDraft = {
  selectedClient: null,
  clientId: "",
  client: { name: "", taxNumber: "", address: "", phone: "" },
  items: [],
  pendingItem: null,
  globalRetention: 0,
  globalDiscount: 0,
  currencyCode: "AOA",
  notes: "",
};

/** Indica se o rascunho tem algo preenchido pelo utilizador. */
export function draftHasContent(draft?: Partial<DocumentTabDraft> | null): boolean {
  if (!draft) return false;
  return Boolean(
    draft.selectedClient ||
      draft.clientId ||
      draft.client?.name ||
      (draft.items && draft.items.length > 0) ||
      draft.pendingItem ||
      Number(draft.globalRetention) > 0 ||
      Number(draft.globalDiscount) > 0 ||
      (draft.notes && draft.notes.trim().length > 0),
  );
}

export const useDocumentDraftStore = create<DocumentDraftState>()(
  persist(
    (set, get) => ({
      draftsByScope: {},

      getTabDraft: (scope, tab) => get().draftsByScope[scope]?.tabs[tab],

      getLastActiveTab: (scope) => get().draftsByScope[scope]?.lastActiveTab,

      setLastActiveTab: (scope, tab) =>
        set((state) => {
          const current = state.draftsByScope[scope] ?? { tabs: {} };
          if (current.lastActiveTab === tab) return state;
          return {
            draftsByScope: {
              ...state.draftsByScope,
              [scope]: { ...current, lastActiveTab: tab },
            },
          };
        }),

      saveTabDraft: (scope, tab, draft) =>
        set((state) => {
          const current = state.draftsByScope[scope] ?? { tabs: {} };
          const previous = current.tabs[tab] ?? EMPTY_DRAFT;
          return {
            draftsByScope: {
              ...state.draftsByScope,
              [scope]: {
                ...current,
                tabs: {
                  ...current.tabs,
                  [tab]: {
                    ...previous,
                    ...draft,
                    updatedAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        }),

      copyTabDraft: (scope, fromTab, toTab) =>
        set((state) => {
          const current = state.draftsByScope[scope] ?? { tabs: {} };
          const source = current.tabs[fromTab];
          if (!source) return state;
          const target = current.tabs[toTab] ?? EMPTY_DRAFT;
          // Copia apenas os campos comuns; datas/método de pagamento
          // específicos de cada documento permanecem os da aba de destino.
          return {
            draftsByScope: {
              ...state.draftsByScope,
              [scope]: {
                ...current,
                tabs: {
                  ...current.tabs,
                  [toTab]: {
                    ...target,
                    selectedClient: source.selectedClient,
                    clientId: source.clientId,
                    client: { ...source.client },
                    items: source.items.map((item) => ({ ...item })),
                    pendingItem: source.pendingItem,
                    globalRetention: source.globalRetention,
                    globalDiscount: source.globalDiscount,
                    currencyCode: source.currencyCode,
                    notes: source.notes,
                    updatedAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        }),

      clearTabDraft: (scope, tab) =>
        set((state) => {
          const current = state.draftsByScope[scope];
          if (!current?.tabs[tab]) return state;
          const { [tab]: _removed, ...rest } = current.tabs;
          return {
            draftsByScope: {
              ...state.draftsByScope,
              [scope]: { ...current, tabs: rest },
            },
          };
        }),

      hasTabDraftContent: (scope, tab) =>
        draftHasContent(get().draftsByScope[scope]?.tabs[tab]),
    }),
    {
      name: "mindgest-document-draft-storage",
      version: 1,
    },
  ),
);

