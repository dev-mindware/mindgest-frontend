"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { currentStoreStore, useAuthStore } from "@/stores";
import {
  draftHasContent,
  useDocumentDraftStore,
  type DocumentTabType,
} from "@/stores/documents/document-draft-store";
import type { ClientSelectOption } from "@/types/clients";
import { SucessMessage } from "@/utils/messages";

const SAVE_DEBOUNCE_MS = 400;

/** Chave de isolamento do rascunho: empresa + utilizador + loja. */
export function useDocumentDraftScope() {
  const { user } = useAuthStore();
  const { currentStore } = currentStoreStore();
  const storeId = currentStore?.id ?? user?.store?.id ?? "default";
  return `${user?.company?.id ?? "company"}:${user?.id ?? "user"}:${storeId}`;
}

interface UseDocumentDraftSyncParams {
  tab: DocumentTabType;
  form: UseFormReturn<any>;
  selectedClient: ClientSelectOption | null;
  setSelectedClient: (client: ClientSelectOption | null) => void;
  /** Valores por omissão usados ao limpar o formulário. */
  defaultValues: Record<string, any>;
  /** Desactivado, por exemplo, ao editar uma proforma existente. */
  enabled?: boolean;
}

/**
 * Sincroniza um formulário de emissão de documento com um rascunho guardado
 * em localStorage (100% client-side). Restaura ao montar, grava ao editar,
 * ao desmontar (troca de aba / saída da página) e ao fechar/recarregar o separador.
 */
export function useDocumentDraftSync({
  tab,
  form,
  selectedClient,
  setSelectedClient,
  defaultValues,
  enabled = true,
}: UseDocumentDraftSyncParams) {
  const scope = useDocumentDraftScope();

  const formRef = useRef(form);
  formRef.current = form;
  const setSelectedClientRef = useRef(setSelectedClient);
  setSelectedClientRef.current = setSelectedClient;
  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;
  const selectedClientRef = useRef(selectedClient);
  selectedClientRef.current = selectedClient;

  // Lido de forma síncrona na primeira renderização (o store hidrata do localStorage).
  const [initialPendingItem] = useState<any | null>(() =>
    enabled
      ? (useDocumentDraftStore.getState().getTabDraft(scope, tab)?.pendingItem ?? null)
      : null,
  );
  const pendingItemRef = useRef<any | null>(initialPendingItem);
  const restoredRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const flush = useCallback(() => {
    if (!enabled || !restoredRef.current) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const values = formRef.current.getValues();
    const payload = {
      selectedClient: selectedClientRef.current,
      clientId: values.clientId ?? "",
      client: values.client ?? {},
      items: values.items ?? [],
      pendingItem: pendingItemRef.current,
      globalRetention: Number(values.globalRetention) || 0,
      globalDiscount: Number(values.globalDiscount) || 0,
      currencyCode: values.currencyCode ?? "AOA",
      notes: values.notes ?? "",
      dueDate: values.dueDate,
      proformaExpiresAt: values.proformaExpiresAt,
      paymentMethod: values.paymentMethod,
    };
    useDocumentDraftStore.getState().saveTabDraft(scope, tab, payload);
    setHasDraft(draftHasContent(payload));
  }, [enabled, scope, tab]);

  const scheduleSave = useCallback(() => {
    if (!enabled || !restoredRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
  }, [enabled, flush]);

  // Restaura o rascunho ao montar a aba; grava ao desmontar.
  useEffect(() => {
    if (!enabled) return;
    const draft = useDocumentDraftStore.getState().getTabDraft(scope, tab);

    if (draft && draftHasContent(draft)) {
      const current = formRef.current.getValues();
      const today = new Date().toISOString().split("T")[0];
      formRef.current.reset({
        ...current,
        client: { ...(current.client ?? {}), ...draft.client },
        clientId: draft.clientId,
        items: draft.items,
        globalRetention: draft.globalRetention,
        globalDiscount: draft.globalDiscount,
        currencyCode: draft.currencyCode,
        notes: draft.notes,
        ...(tab === "invoice" && draft.dueDate && draft.dueDate >= today
          ? { dueDate: draft.dueDate }
          : {}),
        ...(tab !== "invoice" && draft.paymentMethod
          ? { paymentMethod: draft.paymentMethod }
          : {}),
      });
      setSelectedClientRef.current(draft.selectedClient ?? null);
      pendingItemRef.current = draft.pendingItem ?? null;
      setHasDraft(true);
    }
    restoredRef.current = true;

    return () => {
      flush();
      restoredRef.current = false;
    };
  }, [enabled, scope, tab, flush]);

  // Grava ao editar qualquer campo do formulário.
  useEffect(() => {
    if (!enabled) return;
    const subscription = formRef.current.watch(() => scheduleSave());
    return () => subscription.unsubscribe();
  }, [enabled, scheduleSave]);

  // Grava ao mudar o cliente seleccionado.
  useEffect(() => {
    scheduleSave();
  }, [selectedClient, scheduleSave]);

  // Grava ao fechar / recarregar o separador ou navegar para fora.
  useEffect(() => {
    if (!enabled) return;
    const handler = () => flush();
    window.addEventListener("pagehide", handler);
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("pagehide", handler);
      window.removeEventListener("beforeunload", handler);
    };
  }, [enabled, flush]);

  const onPendingItemChange = useCallback(
    (item: any | null) => {
      pendingItemRef.current = item;
      scheduleSave();
    },
    [scheduleSave],
  );

  const saveDraftManually = useCallback(() => {
    flush();
    SucessMessage("Rascunho guardado com sucesso!");
  }, [flush]);

  /** Limpa o formulário e remove o rascunho desta aba do localStorage. */
  const clearDraft = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    pendingItemRef.current = null;
    if (enabled) {
      useDocumentDraftStore.getState().clearTabDraft(scope, tab);
    }
    formRef.current.reset(defaultValuesRef.current);
    setSelectedClientRef.current(null);
    setHasDraft(false);
    setResetKey((key) => key + 1);
  }, [enabled, scope, tab]);

  return {
    hasDraft,
    resetKey,
    initialPendingItem,
    onPendingItemChange,
    saveDraftManually,
    clearDraft,
  };
}

