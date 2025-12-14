# Estrutura de Tipos de Documentos Financeiros

Este documento define os **tipos TypeScript** utilizados na comunicação entre o **frontend** e o **backend** para gestão de documentos financeiros — **Recibos**, **Proformas** e **Faturas**.

---

## 🧩 Tipos Base

### `ContactInfo`

Representa informações de contacto genéricas.

```ts
export type ContactInfo = {
  phone?: string;
  email?: string;
};
```

### `CompanyInfo`

Informações da empresa emissora.

```ts
export type CompanyInfo = {
  name?: string;
  vatNumber?: string;
  address?: string;
  contact?: ContactInfo;
};
```

### `ClientInfo`

Informações do cliente.

```ts
export type ClientInfo = {
  name: string;
  address: string;
  vatNumber?: string;
};
```

### `Item`

Item individual listado no documento (produto ou serviço).

```ts
export type Item = {
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
  description?: string;
};
```

### `Totals`

Representa totais monetários do documento.

```ts
export type Totals = {
  subtotal?: number;
  totalTax?: number;
  totalDue: number;
};
```

### `Payment`

Define o método de pagamento utilizado.

```ts
export type PaymentMethod = "bank_transfer" | "cash" | "card";

export type Payment = {
  method: PaymentMethod;
  bankDetails?: string;
};
```

---

## 📜 Tipos de Documentos

### `ReceiptFormData`

Recibo simples, geralmente emitido após pagamento.

```ts
export type ReceiptFormData = {
  documentNumber: string;
  issueDate: string;
  totals: Pick<Totals, "totalDue">;
  referenceInvoice: string;
  company?: CompanyInfo;
  client?: ClientInfo;
  items?: Omit<Item, "total">[];
  payment?: Payment;
};
```

### `ProformaFormData`

Documento proforma (cotação ou proposta comercial), não fiscal.

```ts
export type ProformaFormData = {
  documentNumber: string;
  issueDate: string;
  client: ClientInfo;
  items: Item[];
  totals: Required<Totals>;
  company?: CompanyInfo;
  payment?: Payment;
};
```

### `InvoiceFormData`

Fatura normal, documento fiscal completo.

```ts
export type InvoiceFormData = {
  documentNumber: string;
  issueDate: string;
  dueDate: string;
  client: ClientInfo;
  items: Item[];
  totals: Required<Totals>;
  payment: Payment;
  company?: CompanyInfo;
  categoryId?: string;
  orderReference?: string;
  discount?: number;
};
```

---

## 🧠 Observações

- **Totais:** o `totalDue` é obrigatório em todos os documentos.
- **Faturas e Proformas** usam `Required<Totals>` pois exigem todos os valores detalhados.
- **Recibos** podem ter apenas o valor total, por isso usam `Pick<Totals, 'totalDue'>`.
- A estrutura é modular e reutilizável — ideal para expandir com novos tipos de documentos futuros.

---

📦 **Autor:** Equipa de Desenvolvimento Frontend  
⚙️ **Uso:** Comunicação entre frontend ↔ backend via DTOs  
🗓️ **Versão:** 1.0.0
