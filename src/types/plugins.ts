export type PluginConnectionStatus = "PENDING" | "ACTIVE" | "REVOKED";

export type IntegrationServiceTaxState = "POR_CONFIGURAR" | "PRONTO";

export interface MindschoolConnection {
  id: string;
  status: PluginConnectionStatus;
  school: { id: string; name: string | null; nif: string | null };
  store: { id: string; name: string };
  connectedAt: string | null;
  lastWebhookOkAt: string | null;
  lastError: string | null;
  servicesPendingTax: number;
  configurationComplete: boolean;
  documents: number;
}

export interface ConnectMindschoolPayload {
  storeId: string;
  redirectUri: string;
}

export interface ConnectMindschoolResponse {
  authorizeUrl: string;
  state: string;
  expiresAt: string;
}

export interface CompleteMindschoolPayload {
  code: string;
  state: string;
}

export interface IntegrationServiceTax {
  id: string;
  name: string;
  rate: string;
  exemptionCode: string | null;
}

export interface IntegrationService {
  id: string;
  serviceRef: string;
  name: string;
  referencePrice: string | null;
  taxState: IntegrationServiceTaxState;
  tax: IntegrationServiceTax | null;
}

export interface IntegrationTaxOption {
  id: string;
  name: string;
  type: string;
  rate: string;
  exemptionCode: string | null;
  exemptionReason: string | null;
}

/** Mensagem publicada pela página `plugins/callback` no BroadcastChannel. */
export interface MindschoolCallbackMessage {
  type: "mindschool-callback";
  state: string;
  code?: string;
  error?: string;
  errorDescription?: string;
}
