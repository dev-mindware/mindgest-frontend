# Tipagens para Registo (POST)

Documento formatado para leitura suave e clara, próprio para um repositório GitHub.

---

## **ItemType**

```ts
enum ItemType {
  SERVICE,
  PRODUCT,
}
```

---

## **Items**

### **Estrutura**

```ts
items {
  id?: string,     // A: caso o item já exista na plataforma
  name?: string,
  price?: Decimal, // B: caso o item ainda não exista na plataforma
  type?: ItemType
}
```

> **Regra:** Nunca enviar ambos os grupos (A e B) a `null` ou `undefined`. Pelo menos um conjunto deve conter valores válidos.

---

## **Client**

```ts
client {
  id?: string,   // Caso já exista na plataforma
  name?: string  // Caso ainda não exista na plataforma
}
```

> **Regra:** Pelo menos um valor deve ser enviado.

---

# **Factura Normal – Interface Invoice**

```ts
interface Invoice {
  client: Client; // Necessário prisma transaction: criação de Invoice + Client
  issueDate: string;
  dueDate: string;
  items: Item[]; // Pode ser enviado ID ou corpo completo. Copilot irá decidir a abordagem mais segura.
  isPaid: false; // Alterado automaticamente no backend após emissão do recibo
  payment: Payment;
  subtotal: number;
  totalTax: number;
  totalDue: number;
  discount?: number;
}
```

---

# **Recibo – Interface receipt**

```ts
interface receipt {
  clientId: string;
  issueDate: string; // Ex: 8/11/2025
  invoiceValue: number; // Valor total da fatura
  discounts?: number; // Valor descontado
  receivedValue: number; // Valor efetivamente recebido
  taxes?: number; // Impostos, se aplicável
  userId: string; // Operador responsável
  referenceInvoice: string; // Referência da factura
  paymentMethod?: string; // Ex: "Transferência", "Cash"
  notes?: string; // Observações adicionais
}
```

---

# **Factura-Recibo – Interface InvoiceReceipt**

```ts
interface InvoiceReceipt {
  client: Client;
  issueDate: string;
  dueDate: string;
  items: Item[]; // Mesmo comportamento da interface Invoice
  isPaid: true;
  payment: Payment;
  subtotal: number;
  totalTax: number;
  totalDue: number;
  discount?: number;
}
```

---

# **Factura Proforma – Interface InvoiceProform (Backend)**

```ts
interface InvoiceProform {
  companyId: string; // Obtido no backend a partir do utilizador logado
  client: Client;
  issueDate: string;
  items: Item[];
  subtotal: number;
  totalTax: number;
  totalDue: number;
  payment: Payment;
}
```

### **Versão enviada pelo Frontend**

```ts
interface InvoiceProform {
  client: Client;
  issueDate: string;
  items: Item[];
  subtotal: number;
  totalTax: number;
  totalDue: number;
  payment: Payment;
}
```

---

## **Payment**

```ts
interface Payment {
  method: PaymentMethod;
  bankDetails?: string;
}
```

---

## **PaymentMethod**

```ts
enum PaymentMethod {
  CASH,
  CARD,
  TRANSFER,
  MOBILE_MONEY,
}
```

---
