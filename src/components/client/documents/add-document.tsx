"use client";
import { useCallback, useState, useEffect } from "react";
import { TitleList } from "@/components/common";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { InvoiceForm } from "./invoice-normal";
import { InvoiceReceiptForm } from "./invoice-receipt";
import { ProformaForm } from "./invoice-proforma";
import { DocumentSuccessModal } from "./modals/document-success-modal";
import {
  TransferDraftModal,
  MODAL_TRANSFER_DRAFT_ID,
} from "./modals/transfer-draft-modal";
import { useDocumentDraftScope } from "@/hooks/invoice/use-document-draft";
import {
  draftHasContent,
  useDocumentDraftStore,
} from "@/stores/documents/document-draft-store";
import { BankModal } from "@/components/templates/definitions/contents/banks/banks-modals";
import { useAuth } from "@/hooks/auth";
import { useModal } from "@/stores";
import { SubscriptionStatus } from "@/types";

type TabsAloweds = "invoice" | "invoice-receipt" | "proforma";

export function AddDocuments() {
  const { isAuthenticating, user } = useAuth();

  // O escopo do rascunho depende do utilizador/loja; só monta quando já existe.
  if (isAuthenticating || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AddDocumentsContent />;
}

function AddDocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current_Tab = useSearchParams().get("tab");
  const { subscriptionStatus, hasActiveSubscription, isAuthenticating, user } = useAuth();
  const { openModal } = useModal();
  const scope = useDocumentDraftScope();
  const hasAnyDraft = useDocumentDraftStore((state) =>
    Object.values(state.draftsByScope[scope]?.tabs ?? {}).some(draftHasContent),
  );

  const [activeTab, setActiveTab] = useState<TabsAloweds>(() => {
    if (current_Tab && (current_Tab === "invoice" || current_Tab === "invoice-receipt" || current_Tab === "proforma")) {
      return current_Tab as TabsAloweds;
    }
    // Sem ?tab= explícito: retoma a última aba com rascunho guardado.
    const state = useDocumentDraftStore.getState();
    const last = state.getLastActiveTab(scope);
    if (last && state.hasTabDraftContent(scope, last)) return last;
    return "invoice";
  });
  const [pendingTab, setPendingTab] = useState<TabsAloweds | null>(null);
  const [transferSummary, setTransferSummary] = useState<{
    clientName?: string;
    itemsCount: number;
  }>({ itemsCount: 0 });

  const switchTab = useCallback(
    (value: TabsAloweds) => {
      setActiveTab(value);
      useDocumentDraftStore.getState().setLastActiveTab(scope, value);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, scope]
  );

  const handleTabChange = useCallback(
    (value: TabsAloweds | string) => {
      const next = value as TabsAloweds;
      if (next === activeTab) return;

      const store = useDocumentDraftStore.getState();
      if (store.hasTabDraftContent(scope, activeTab)) {
        const draft = store.getTabDraft(scope, activeTab);
        setTransferSummary({
          clientName: draft?.selectedClient?.label || draft?.client?.name,
          itemsCount: draft?.items?.length ?? 0,
        });
        setPendingTab(next);
        openModal(MODAL_TRANSFER_DRAFT_ID);
        return;
      }
      switchTab(next);
    },
    [activeTab, scope, openModal, switchTab]
  );

  const handleConfirmTransfer = useCallback(() => {
    if (!pendingTab) return;
    useDocumentDraftStore.getState().copyTabDraft(scope, activeTab, pendingTab);
    switchTab(pendingTab);
    setPendingTab(null);
  }, [pendingTab, scope, activeTab, switchTab]);

  const handleSkipTransfer = useCallback(() => {
    if (!pendingTab) return;
    switchTab(pendingTab);
    setPendingTab(null);
  }, [pendingTab, switchTab]);

  useEffect(() => {
    if (isAuthenticating) return;
    if (!user) return;

    if (!hasActiveSubscription) {
      if (subscriptionStatus === SubscriptionStatus.PENDING) {
        openModal("pending-subscription-modal");
      } else {
        openModal("subscription-expired-modal");
      }
      router.replace("/documents");
    }
  }, [subscriptionStatus, hasActiveSubscription, isAuthenticating, user, openModal, router]);

  if (isAuthenticating || !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return null;
  }

  return (
    <div className="space-y-6">
      <TitleList
        title="Documentos"
        suTitle="Crie documentos que ajudaram no controlo das suas atividades."
      />

      {hasAnyDraft && (
        <p className="text-xs text-muted-foreground" data-testid="draft-indicator">
          Rascunho guardado automaticamente neste dispositivo.
        </p>
      )}

      <Tabs
        className="w-full"
        value={activeTab}
        onValueChange={handleTabChange}
      >
        <TabsList
          className="flex w-full overflow-x-auto justify-start sm:w-fit p-1 gap-1"
          data-tour="normal-invoice-document-type"
        >
          <TabsTrigger value="invoice" className="flex-1 sm:flex-initial min-h-[38px] px-3 sm:px-4">
            Factura
          </TabsTrigger>
          <TabsTrigger value="invoice-receipt" className="flex-1 sm:flex-initial min-h-[38px] px-3 sm:px-4">
            Factura Recibo
          </TabsTrigger>
          <TabsTrigger value="proforma" className="flex-1 sm:flex-initial min-h-[38px] px-3 sm:px-4">
            Proforma
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoice">
          <InvoiceForm />
        </TabsContent>
        <TabsContent value="invoice-receipt">
          <InvoiceReceiptForm />
        </TabsContent>
        <TabsContent value="proforma">
          <ProformaForm />
        </TabsContent>
      </Tabs>

      <DocumentSuccessModal />
      <TransferDraftModal
        fromTab={activeTab}
        toTab={pendingTab}
        summary={transferSummary}
        onConfirm={handleConfirmTransfer}
        onSkip={handleSkipTransfer}
      />
      {/* Mounted outside document forms to avoid nested <form> submitting the invoice */}
      <BankModal action="add" />
    </div>
  );
}
