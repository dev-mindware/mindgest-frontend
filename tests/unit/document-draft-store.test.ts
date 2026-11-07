import {
  draftHasContent,
  useDocumentDraftStore,
} from "@/stores/documents/document-draft-store";

const SCOPE = "company-1:user-1:store-1";

describe("document draft store", () => {
  beforeEach(() => {
    useDocumentDraftStore.setState({ draftsByScope: {} });
    localStorage.clear();
  });

  it("detecta se um rascunho tem conteúdo", () => {
    expect(draftHasContent(undefined)).toBe(false);
    expect(draftHasContent({ items: [], notes: "  " })).toBe(false);
    expect(draftHasContent({ notes: "obs" })).toBe(true);
    expect(draftHasContent({ items: [{ description: "x" }] })).toBe(true);
    expect(draftHasContent({ globalDiscount: 5 })).toBe(true);
  });

  it("guarda e lê o rascunho por aba e por escopo", () => {
    const { saveTabDraft, getTabDraft } = useDocumentDraftStore.getState();
    saveTabDraft(SCOPE, "invoice-receipt", {
      notes: "Pagamento à vista",
      items: [{ description: "Portátil", quantity: 1, unitPrice: 100 }],
    });

    expect(getTabDraft(SCOPE, "invoice-receipt")?.notes).toBe("Pagamento à vista");
    expect(getTabDraft(SCOPE, "invoice")).toBeUndefined();
    expect(getTabDraft("outro:escopo:loja", "invoice-receipt")).toBeUndefined();
  });

  it("persiste no localStorage", () => {
    useDocumentDraftStore
      .getState()
      .saveTabDraft(SCOPE, "invoice", { notes: "persistido" });

    const raw = localStorage.getItem("mindgest-document-draft-storage");
    expect(raw).toContain("persistido");
  });

  it("copia os campos comuns entre abas preservando os específicos do destino", () => {
    const store = useDocumentDraftStore.getState();
    store.saveTabDraft(SCOPE, "invoice-receipt", {
      clientId: "c1",
      client: { name: "Cliente A" },
      items: [{ description: "Item 1" }],
      globalDiscount: 10,
      notes: "nota",
      paymentMethod: "CARD",
    });
    store.saveTabDraft(SCOPE, "invoice", { dueDate: "2099-01-01" });

    store.copyTabDraft(SCOPE, "invoice-receipt", "invoice");

    const target = useDocumentDraftStore.getState().getTabDraft(SCOPE, "invoice");
    expect(target?.clientId).toBe("c1");
    expect(target?.items).toHaveLength(1);
    expect(target?.globalDiscount).toBe(10);
    expect(target?.notes).toBe("nota");
    expect(target?.dueDate).toBe("2099-01-01");
    expect(target?.paymentMethod).toBeUndefined();
    // a origem mantém-se intacta
    expect(
      useDocumentDraftStore.getState().getTabDraft(SCOPE, "invoice-receipt")?.items,
    ).toHaveLength(1);
  });

  it("limpa apenas o rascunho da aba indicada", () => {
    const store = useDocumentDraftStore.getState();
    store.saveTabDraft(SCOPE, "invoice", { notes: "a" });
    store.saveTabDraft(SCOPE, "proforma", { notes: "b" });

    store.clearTabDraft(SCOPE, "invoice");

    const state = useDocumentDraftStore.getState();
    expect(state.hasTabDraftContent(SCOPE, "invoice")).toBe(false);
    expect(state.hasTabDraftContent(SCOPE, "proforma")).toBe(true);
  });

  it("memoriza a última aba activa", () => {
    const store = useDocumentDraftStore.getState();
    store.setLastActiveTab(SCOPE, "proforma");
    expect(useDocumentDraftStore.getState().getLastActiveTab(SCOPE)).toBe("proforma");
  });
});

