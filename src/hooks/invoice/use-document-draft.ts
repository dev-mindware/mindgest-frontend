"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { currentStoreStore, useAuthStore } from "@/stores";
import {
  draftHasContent,
  useDocumentDraftStore,
  type DocumentTabType,
} from "@/stores/documents/document-draft-store";
import type { ClientSelectOption } from "@/types/clients";
import { SucessMessage } from "@/utils/messages";

const SAVE_DEBOUNCE_MS = 100;

let activeFormFlushFn: (() => void) | null = null;

/**
 * Garante que quaisquer alterações pendentes no formulário da aba activa
 * sejam gravadas imediatamente no store antes de verificar ou copiar o rascunho.
 */
export function flushActiveDocumentDraft() {
  if (activeFormFlushFn) {
    activeFormFlushFn();
  }
}

/** Chave de isolamento do rascunho: empresa + utilizador + loja. */
export function useDocumentDraftScope() {
  const { user } = useAuthStore();
  const { currentStore } = currentStoreStore();
  const storeId = currentStore?.id ?? user?.store?.id ?? "default";
  return `${user?.company?.id ?? "company"}:${user?.id ?? "user"}:${storeId}`;
}

/**
 * Hidrata de forma síncrona os defaultValues do useForm a partir do rascunho guardado,
 * garantindo que useForm e useFieldArray já nascem preenchidos na primeira renderização.
 */
export function getHydratedFormDefaults<T extends Record<string, any>>(
  scope: string,
  tab: DocumentTabType,
  baseDefaults: T,
  enabled = true,
): T {
  if (!enabled) return baseDefaults;
  const draft = useDocumentDraftStore.getState().getTabDraft(scope, tab);
  if (!draft || !draftHasContent(draft)) return baseDefaults;

  const today = new Date().toISOString().split("T")[0];

  return {
    ...baseDefaults,
    client: {
      ...(baseDefaults.client ?? {}),
      ...(draft.client ?? {}),
    },
    clientId: draft.clientId ?? baseDefaults.clientId ?? "",
    items: Array.isArray(draft.items)
      ? draft.items.map((item) => ({ ...item }))
      : baseDefaults.items,
    globalRetention:
      typeof draft.globalRetention === "number"
        ? draft.globalRetention
        : baseDefaults.globalRetention,
    globalDiscount:
      typeof draft.globalDiscount === "number"
        ? draft.globalDiscount
        : baseDefaults.globalDiscount,
    currencyCode: draft.currencyCode ?? baseDefaults.currencyCode ?? "AOA",
    notes: draft.notes ?? baseDefaults.notes ?? "",
    ...(tab === "invoice" && draft.dueDate && draft.dueDate >= today
      ? { dueDate: draft.dueDate }
      : {}),
    ...(tab !== "invoice" && draft.paymentMethod
      ? { paymentMethod: draft.paymentMethod }
      : {}),
  };
}

/**
 * Devolve o cliente seleccionado guardado no rascunho de forma síncrona
 * para inicializar o estado de useClientSelection logo na primeira renderização.
 */
export function getHydratedSelectedClient(
  scope: string,
  tab: DocumentTabType,
  enabled = true,
): ClientSelectOption | null {
  if (!enabled) return null;
  const draft = useDocumentDraftStore.getState().getTabDraft(scope, tab);
  if (!draft || !draftHasContent(draft)) return null;
  return draft.selectedClient ?? null;
}

interface UseDocumentDraftSyncParams {
  tab: DocumentTabType;
  form: UseFormReturn<any>;
  fieldArray?: UseFieldArrayReturn<any, "items">;
  selectedClient: ClientSelectOption | null;
  setSelectedClient: (client: ClientSelectOption | null) => void;
  /** Valores por omissão limpos usados ao clicar em "Limpar Formulário". */
  defaultValues: Record<string, any>;
  /** Desactivado ao editar uma proforma existente. */
  enabled?: boolean;
}

/**
 * Sincroniza um formulário de emissão de documento com um rascunho guardado
 * em localStorage (100% client-side).
 */
export function useDocumentDraftSync({
  tab,
  form,
  fieldArray,
  selectedClient,
  setSelectedClient,
  defaultValues,
  enabled = true,
}: UseDocumentDraftSyncParams) {
  const scope = useDocumentDraftScope();

  const formRef = useRef(form);
  formRef.current = form;
  const fieldArrayRef = useRef(fieldArray);
  fieldArrayRef.current = fieldArray;
  const setSelectedClientRef = useRef(setSelectedClient);
  setSelectedClientRef.current = setSelectedClient;
  const defaultValuesRef = useRef(defaultValues);
  defaultValuesRef.current = defaultValues;
  const selectedClientRef = useRef(selectedClient);
  selectedClientRef.current = selectedClient;

  // Lido de forma síncrona na primeira renderização
  const [initialPendingItem, setInitialPendingItem] = useState<any | null>(() =>
    enabled
      ? (useDocumentDraftStore.getState().getTabDraft(scope, tab)?.pendingItem ?? null)
      : null,
  );
  const pendingItemRef = useRef<any | null>(initialPendingItem);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevClientRef = useRef(selectedClient);
  const prevFieldsRef = useRef(fieldArray?.fields);

  const [hasDraft, setHasDraft] = useState<boolean>(() =>
    enabled
      ? useDocumentDraftStore.getState().hasTabDraftContent(scope, tab)
      : false,
  );
  const [resetKey, setResetKey] = useState(0);

  const flush = useCallback(() => {
    if (!enabled) return;
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
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
  }, [enabled, flush]);

  // Regista o flush da aba activa e sincroniza o formulário ao montar
  useEffect(() => {
    if (!enabled) return;

    activeFormFlushFn = () => {
      flush();
    };

    const draft = useDocumentDraftStore.getState().getTabDraft(scope, tab);
    if (draft && draftHasContent(draft)) {
      const hydrated = getHydratedFormDefaults(
        scope,
        tab,
        formRef.current.getValues(),
        enabled,
      );
      formRef.current.reset(hydrated);
      if (fieldArrayRef.current && Array.isArray(draft.items)) {
        fieldArrayRef.current.replace(draft.items.map((item) => ({ ...item })));
      }
      selectedClientRef.current = draft.selectedClient ?? null;
      setSelectedClientRef.current(draft.selectedClient ?? null);
      pendingItemRef.current = draft.pendingItem ?? null;
      setInitialPendingItem(draft.pendingItem ?? null);
      setHasDraft(true);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        flush();
      }
      if (activeFormFlushFn) {
        activeFormFlushFn = null;
      }
    };
  }, [enabled, scope, tab, flush]);

  // Grava ao editar qualquer campo do formulário
  useEffect(() => {
    if (!enabled) return;
    const subscription = formRef.current.watch(() => scheduleSave());
    return () => subscription.unsubscribe();
  }, [enabled, scheduleSave]);

  // Grava ao mudar o cliente seleccionado
  useEffect(() => {
    if (prevClientRef.current === selectedClient) return;
    prevClientRef.current = selectedClient;
    scheduleSave();
  }, [selectedClient, scheduleSave]);

  // Grava sempre que a lista de itens (useFieldArray) muda
  useEffect(() => {
    if (prevFieldsRef.current === fieldArray?.fields) return;
    prevFieldsRef.current = fieldArray?.fields;
    scheduleSave();
  }, [fieldArray?.fields, scheduleSave]);

  // Grava ao fechar / recarregar o separador
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
      if (pendingItemRef.current === item) return;
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
    setInitialPendingItem(null);
    selectedClientRef.current = null;
    if (enabled) {
      useDocumentDraftStore.getState().clearTabDraft(scope, tab);
    }
    formRef.current.reset(defaultValuesRef.current);
    if (fieldArrayRef.current) {
      fieldArrayRef.current.replace([]);
    }
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
