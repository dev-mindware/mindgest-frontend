# Invoice Receipt API - Usage Examples

## Overview

Invoice Receipt API handles **point-of-sale transactions** (completed sales). Unlike normal invoices, invoice receipts are always marked as **paid** (`isPaid: true`) immediately upon creation, representing a finalized transaction.

### Key Differences from Normal Invoice

| Feature           | Normal Invoice      | Invoice Receipt                    |
| ----------------- | ------------------- | ---------------------------------- |
| **isPaid**        | `false` (default)   | `true` (always)                    |
| **Status**        | `DRAFT` (default)   | `PAID` (always)                    |
| **Use Case**      | Billing, Quotations | Point-of-Sale, Completed Sales     |
| **Customer**      | Optional            | Recommended (optional for walk-in) |
| **Items**         | Required            | Required                           |
| **Payment Terms** | Supports due date   | N/A (already paid)                 |

---

## 1. Create Invoice Receipt with Existing Customer and Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "id": "clm0client123"
    },
    "items": [
      {
        "id": "clm0item1",
        "quantity": 2
      },
      {
        "id": "clm0item2",
        "quantity": 1
      }
    ],
    "issueDate": "2025-11-22",
    "total": 1500.50,
    "taxAmount": 300,
    "discountAmount": 50
  }'
```

### Response

```json
{
  "id": "clm0receipt123",
  "invoiceNumber": "RECIP-LG1W2BW-A3K5N9",
  "invoiceType": "INVOICE_RECEIPT",
  "status": "PAID",
  "isPaid": true,
  "customerId": "clm0client123",
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "issueDate": "2025-11-22",
  "dueDate": null,
  "items": [
    {
      "id": "clm0item1",
      "name": "iPhone 17 Pro Max",
      "quantity": 2,
      "unitPrice": 1299.99,
      "total": 2599.98
    },
    {
      "id": "clm0item2",
      "name": "iPhone 15 Case",
      "quantity": 1,
      "unitPrice": 29.99,
      "total": 29.99
    }
  ],
  "subtotal": 2629.97,
  "taxAmount": 300.0,
  "discountAmount": 50.0,
  "totalAmount": 2879.97,
  "notes": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

---

## 2. Create Invoice Receipt with New Customer and New Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Maria Santos",
      "email": "maria@example.com",
      "phone": " 923 456 789",
      "address": "Rua Principal, 456, Luanda"
    },
    "items": [
      {
        "name": "Samsung Galaxy S24",
        "price": 999.99,
        "quantity": 1,
        "sku": "SAMSUNG-S24-512",
        "type": "PRODUCT",
        "cost": 700.00
      },
      {
        "name": "Tech Support Service",
        "price": 50.00,
        "quantity": 2,
        "type": "SERVICE"
      }
    ],
    "issueDate": "2025-11-24",
    "total": 1099.99,
    "taxAmount": 150.00,
    "notes": "Walk-in sale - no delivery needed"
  }'
```

### Response

```json
{
  "id": "clm0receipt456",
  "invoiceNumber": "RECIP-LG1W2BW-B7M2K8",
  "invoiceType": "INVOICE_RECEIPT",
  "status": "PAID",
  "isPaid": true,
  "customerId": "clm0client456",
  "customerName": "Maria Santos",
  "customerEmail": "maria@example.com",
  "issueDate": "2025-11-24",
  "dueDate": null,
  "items": [
    {
      "id": "clm0item789",
      "name": "Samsung Galaxy S24",
      "quantity": 1,
      "unitPrice": 999.99,
      "total": 999.99
    },
    {
      "id": "clm0item790",
      "name": "Tech Support Service",
      "quantity": 2,
      "unitPrice": 50.0,
      "total": 100.0
    }
  ],
  "subtotal": 1099.99,
  "taxAmount": 150.0,
  "discountAmount": 0.0,
  "totalAmount": 1249.99,
  "notes": "Walk-in sale - no delivery needed",
  "createdAt": "2025-11-24T10:35:00.000Z",
  "updatedAt": "2025-11-24T10:35:00.000Z"
}
```

---

## 3. Create Invoice Receipt with Mixed Customer and Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "id": "clm0client789"
    },
    "items": [
      {
        "id": "clm0item101",
        "quantity": 3
      },
      {
        "name": "Shipping Service",
        "price": 25.00,
        "quantity": 1,
        "type": "SERVICE"
      }
    ],
    "issueDate": "2025-11-24",
    "total": 385.00,
    "discountAmount": 15.00,
    "notes": "Same-day delivery completed"
  }'
```

### Response

```json
{
  "id": "clm0receipt789",
  "invoiceNumber": "RECIP-LG1W2BW-C9N4P7",
  "invoiceType": "INVOICE_RECEIPT",
  "status": "PAID",
  "isPaid": true,
  "customerId": "clm0client789",
  "customerName": "Paulo Costa",
  "customerEmail": "paulo@example.com",
  "issueDate": "2025-11-24",
  "dueDate": null,
  "items": [
    {
      "id": "clm0item101",
      "name": "iPad Pro 12.9",
      "quantity": 3,
      "unitPrice": 1099.0,
      "total": 3297.0
    },
    {
      "id": "clm0item102",
      "name": "Shipping Service",
      "quantity": 1,
      "unitPrice": 25.0,
      "total": 25.0
    }
  ],
  "subtotal": 3322.0,
  "taxAmount": 0.0,
  "discountAmount": 15.0,
  "totalAmount": 3307.0,
  "notes": "Same-day delivery completed",
  "createdAt": "2025-11-24T10:40:00.000Z",
  "updatedAt": "2025-11-24T10:40:00.000Z"
}
```

---

## 4. Create Walk-In Sale (No Customer ID)

### Request

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "id": "clm0item1",
        "quantity": 1
      },
      {
        "id": "clm0item2",
        "quantity": 2
      }
    ],
    "issueDate": "2025-11-24",
    "total": 1500.00,
    "taxAmount": 200.00
  }'
```

### Response

```json
{
  "id": "clm0receipt999",
  "invoiceNumber": "RECIP-LG1W2BW-D5K3M1",
  "invoiceType": "INVOICE_RECEIPT",
  "status": "PAID",
  "isPaid": true,
  "customerId": null,
  "customerName": "Walk-in Customer",
  "customerEmail": null,
  "issueDate": "2025-11-24",
  "dueDate": null,
  "items": [
    {
      "id": "clm0item1",
      "name": "iPhone 17 Pro Max",
      "quantity": 1,
      "unitPrice": 1299.99,
      "total": 1299.99
    },
    {
      "id": "clm0item2",
      "name": "iPhone 15 Case",
      "quantity": 2,
      "unitPrice": 29.99,
      "total": 59.98
    }
  ],
  "subtotal": 1359.97,
  "taxAmount": 200.0,
  "discountAmount": 0.0,
  "totalAmount": 1559.97,
  "notes": null,
  "createdAt": "2025-11-24T10:45:00.000Z",
  "updatedAt": "2025-11-24T10:45:00.000Z"
}
```

---

## 5. List Invoice Receipts with Pagination

### Request

```bash
curl -X GET "http://localhost:3000/invoice/invoice-receipt?page=1&limit=20&clientId=clm0client123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response

```json
{
  "data": [
    {
      "id": "clm0receipt123",
      "invoiceNumber": "RECIP-LG1W2BW-A3K5N9",
      "invoiceType": "INVOICE_RECEIPT",
      "status": "PAID",
      "isPaid": true,
      "customerId": "clm0client123",
      "customerName": "João Silva",
      "customerEmail": "joao@example.com",
      "issueDate": "2025-11-22",
      "dueDate": null,
      "items": [...],
      "subtotal": 2629.97,
      "taxAmount": 300.00,
      "discountAmount": 50.00,
      "totalAmount": 2879.97,
      "notes": null,
      "createdAt": "2025-11-24T10:30:00.000Z",
      "updatedAt": "2025-11-24T10:30:00.000Z"
    },
    // ... more receipts
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

## 6. Get Single Invoice Receipt

### Request

```bash
curl -X GET http://localhost:3000/invoice/invoice-receipt/clm0receipt123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response

```json
{
  "id": "clm0receipt123",
  "invoiceNumber": "RECIP-LG1W2BW-A3K5N9",
  "invoiceType": "INVOICE_RECEIPT",
  "status": "PAID",
  "isPaid": true,
  "customerId": "clm0client123",
  "customerName": "João Silva",
  "customerEmail": "joao@example.com",
  "issueDate": "2025-11-22",
  "dueDate": null,
  "items": [
    {
      "id": "clm0item1",
      "name": "iPhone 17 Pro Max",
      "quantity": 2,
      "unitPrice": 1299.99,
      "total": 2599.98
    },
    {
      "id": "clm0item2",
      "name": "iPhone 15 Case",
      "quantity": 1,
      "unitPrice": 29.99,
      "total": 29.99
    }
  ],
  "subtotal": 2629.97,
  "taxAmount": 300.0,
  "discountAmount": 50.0,
  "totalAmount": 2879.97,
  "notes": null,
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

---

## Error Responses

### Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": []
  }'
```

**Response (400):**

```json
{
  "statusCode": 400,
  "message": "Invoice receipt must have at least one item",
  "error": "Bad Request"
}
```

---

### Non-existent Customer

**Request:**

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "id": "non-existent-id"
    },
    "items": [{"id": "clm0item1", "quantity": 1}],
    "issueDate": "2025-11-24",
    "total": 100
  }'
```

**Response (400):**

```json
{
  "statusCode": 400,
  "message": "Client with ID non-existent-id not found",
  "error": "Bad Request"
}
```

---

### Non-existent Item

**Request:**

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "id": "clm0client123"
    },
    "items": [{"id": "non-existent-item", "quantity": 1}],
    "issueDate": "2025-11-24",
    "total": 100
  }'
```

**Response (400):**

```json
{
  "statusCode": 400,
  "message": "Item with ID non-existent-item not found",
  "error": "Bad Request"
}
```

---

### Invoice Receipt Not Found

**Request:**

```bash
curl -X GET http://localhost:3000/invoice/invoice-receipt/non-existent-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (404):**

```json
{
  "statusCode": 404,
  "message": "Invoice receipt with ID non-existent-id not found",
  "error": "Not Found"
}
```

---

### Invalid Email (for new customer)

**Request:**

```bash
curl -X POST http://localhost:3000/invoice/invoice-receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test User",
      "email": "invalid-email"
    },
    "items": [{"id": "clm0item1", "quantity": 1}],
    "issueDate": "2025-11-24",
    "total": 100
  }'
```

**Response (400):**

```json
{
  "statusCode": 400,
  "message": "Invalid email address",
  "error": "Bad Request"
}
```

---

## Validation Rules Summary

### Customer

- `id` (optional): Existing customer ID
- `name` (conditional): Required if creating new customer, min 2 chars, max 100 chars
- `email` (optional): Valid email format
- `phone` (optional): Max 20 characters
- `address` (optional): Max 255 characters
- `taxNumber` (optional): Max 20 characters

### Items

- `id` (optional): Existing item ID
- `name` (conditional): Required if creating new item, min 2 chars, max 200 chars
- `price` (conditional): Required if creating new item, positive number, max 2 decimals
- `quantity` (required): Positive integer
- `description` (optional): Max 1000 characters
- `sku` (optional): Min 3 chars, max 50 chars, uppercase
- `barcode` (optional): Max 50 characters
- `type` (optional): PRODUCT or SERVICE
- `cost` (optional): Positive number
- And 10+ other optional fields (minStock, maxStock, unit, weight, dimensions, image, etc.)

### Invoice Receipt

- `issueDate` (required): ISO 8601 date
- `dueDate` (optional): ISO 8601 date (ignored for receipts)
- `total` (required): Positive number with max 2 decimals
- `taxAmount` (optional): Positive number with max 2 decimals
- `subtotal` (optional): Positive number with max 2 decimals
- `discountAmount` (optional): Positive number with max 2 decimals
- `notes` (optional): String

---

## Best Practices

1. **Always provide item details** - Include quantity and either existing item ID or full item details
2. **Customer is optional** - Walk-in sales can omit the customer object entirely
3. **Use existing customers when possible** - Provides better data consistency
4. **Validate amounts before sending** - Total should equal subtotal + tax - discount
5. **Use ISO 8601 dates** - Format: YYYY-MM-DD
6. **Include notes for context** - Helps with reconciliation and auditing
7. **Handle pagination properly** - Use page/limit for large datasets
8. **Store invoice IDs** - For future reference and reconciliation
9. **isPaid is always true** - Don't attempt to change it; it's always marked as paid upon creation
10. **Status is always PAID** - Unlike normal invoices, receipts cannot have DRAFT status

---

## Key Differences from Normal Invoice API

| Aspect                    | Details                                         |
| ------------------------- | ----------------------------------------------- | -------------------------- |
| **Endpoint**              | `/invoice/invoice-receipt` vs `/invoice/normal` |
| **Invoice Number Prefix** | `RECIP-` vs `FACT-`                             |
| **isPaid Behavior**       | Always `true`                                   | Defaults to `false`        |
| **Status Behavior**       | Always `PAID`                                   | Defaults to `DRAFT`        |
| **Type Field**            | `INVOICE_RECEIPT`                               | `NORMAL_INVOICE`           |
| **Use Case**              | Point-of-Sale Transactions                      | Billing & Quotations       |
| **Immutable Fields**      | `isPaid` and `status`                           | Can be updated (if needed) |

---

## Invoice Receipt Workflow Example

### Complete Transaction Flow

```
1. Customer arrives at store
   └─ Search for existing customer (or leave empty for walk-in)

2. Scan/Select items
   └─ Add quantities

3. Calculate totals (backend does this)
   └─ Subtotal = sum of all items
   └─ Tax = calculated or provided
   └─ Discount = applied if any
   └─ Total = subtotal + tax - discount

4. Create Invoice Receipt (POST /invoice/invoice-receipt)
   └─ Automatically marked as PAID
   └─ Invoice number generated (RECIP-xxx-xxx)
   └─ Receipt is immediately finalized

5. Retrieve Receipt (GET /invoice/invoice-receipt/:id)
   └─ Print or email receipt to customer

6. Reconciliation
   └─ List all receipts (GET /invoice/invoice-receipt)
   └─ Filter by date range or customer
   └─ Generate sales reports
```

---

## Field Mapping

When converting to response DTO:

```javascript
{
  id: invoice.id,
  invoiceNumber: invoice.number,           // System-generated (RECIP-xxx)
  invoiceType: invoice.type,               // Always 'INVOICE_RECEIPT'
  isPaid: invoice.isPaid,                  // Always true
  customerId: invoice.clientId,            // Can be null for walk-in
  customerName: invoice.client?.name || 'Walk-in Customer',
  customerEmail: invoice.client?.email,    // Can be null
  issueDate: formatted(invoice.createdAt),
  dueDate: formatted(invoice.dueDate),     // Usually null for receipts
  items: invoice.items.map(formatItem),    // Detailed line items
  subtotal: invoice.subtotal,              // Sum of items before tax/discount
  taxAmount: invoice.taxAmount,            // Tax collected
  discountAmount: invoice.discountAmount,  // Discount given
  totalAmount: invoice.total,              // Final amount paid
  notes: invoice.notes,                    // Sale notes
  createdAt: invoice.createdAt.toISO(),
  updatedAt: invoice.updatedAt.toISO()
}
```
