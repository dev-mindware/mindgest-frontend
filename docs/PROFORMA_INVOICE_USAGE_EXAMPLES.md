# Proforma Invoice API - Usage Examples

## Overview

Proforma Invoice API handles **quotations and estimates** (non-binding offers). Unlike normal invoices and invoice receipts, proforma invoices are never marked as **paid** (`isPaid: false`) and typically include an expiry date for the quote validity.

### Key Differences from Other Invoice Types

| Feature           | Proforma              | Normal Invoice    | Invoice Receipt      |
| ----------------- | --------------------- | ----------------- | -------------------- |
| **isPaid**        | `false` (always)      | `false` (default) | `true` (always)      |
| **Status**        | `DRAFT` (default)     | `DRAFT` (default) | `PAID` (always)      |
| **Use Case**      | Quotations, Estimates | Billing, Invoices | Point-of-Sale, Sales |
| **Client**        | Optional              | Optional          | Recommended          |
| **Items**         | Required              | Required          | Required             |
| **Expiry Date**   | Supported             | N/A               | N/A                  |
| **Payment Terms** | Supports due date     | Supports due date | N/A                  |

---

## 1. Create Proforma Invoice with Existing Client and Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
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
    "proformaExpiresAt": "2025-12-22",
    "total": 1500.50,
    "taxAmount": 300,
    "discountAmount": 50
  }'
```

### Response

```json
{
  "id": "clm0proforma123",
  "invoiceNumber": "PROFORM-LG1W2BW-A3K5N9",
  "invoiceType": "PROFORMA_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-22",
  "dueDate": null,
  "proformaExpiresAt": "2025-12-22",
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

## 2. Create Proforma Invoice with New Client and New Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
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
        "name": "Installation Service",
        "price": 100.00,
        "quantity": 1,
        "type": "SERVICE"
      }
    ],
    "issueDate": "2025-11-24",
    "proformaExpiresAt": "2025-12-24",
    "dueDate": "2025-12-31",
    "total": 1099.99,
    "taxAmount": 150.00,
    "notes": "Valid for 30 days - Subject to stock availability"
  }'
```

### Response

```json
{
  "id": "clm0proforma456",
  "invoiceNumber": "PROFORM-LG1W2BW-B7M2K8",
  "invoiceType": "PROFORMA_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client456",
  "clientName": "Maria Santos",
  "clientEmail": "maria@example.com",
  "issueDate": "2025-11-24",
  "dueDate": "2025-12-31",
  "proformaExpiresAt": "2025-12-24",
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
      "name": "Installation Service",
      "quantity": 1,
      "unitPrice": 100.0,
      "total": 100.0
    }
  ],
  "subtotal": 1099.99,
  "taxAmount": 150.0,
  "discountAmount": 0.0,
  "totalAmount": 1249.99,
  "notes": "Valid for 30 days - Subject to stock availability",
  "createdAt": "2025-11-24T10:35:00.000Z",
  "updatedAt": "2025-11-24T10:35:00.000Z"
}
```

---

## 3. Create Proforma Invoice with Mixed Client and Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "id": "clm0client789"
    },
    "items": [
      {
        "id": "clm0item101",
        "quantity": 5
      },
      {
        "name": "Bulk Discount Service",
        "price": 150.00,
        "quantity": 1,
        "type": "SERVICE"
      }
    ],
    "issueDate": "2025-11-24",
    "proformaExpiresAt": "2025-12-08",
    "total": 5595.00,
    "discountAmount": 100.00,
    "notes": "Bulk order quotation - 10% additional discount if ordered by Dec 8"
  }'
```

### Response

```json
{
  "id": "clm0proforma789",
  "invoiceNumber": "PROFORM-LG1W2BW-C9N4P7",
  "invoiceType": "PROFORMA_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client789",
  "clientName": "Paulo Costa",
  "clientEmail": "paulo@example.com",
  "issueDate": "2025-11-24",
  "dueDate": null,
  "proformaExpiresAt": "2025-12-08",
  "items": [
    {
      "id": "clm0item101",
      "name": "iPad Pro 12.9",
      "quantity": 5,
      "unitPrice": 1099.0,
      "total": 5495.0
    },
    {
      "id": "clm0item102",
      "name": "Bulk Discount Service",
      "quantity": 1,
      "unitPrice": 150.0,
      "total": 150.0
    }
  ],
  "subtotal": 5645.0,
  "taxAmount": 0.0,
  "discountAmount": 100.0,
  "totalAmount": 5545.0,
  "notes": "Bulk order quotation - 10% additional discount if ordered by Dec 8",
  "createdAt": "2025-11-24T10:40:00.000Z",
  "updatedAt": "2025-11-24T10:40:00.000Z"
}
```

---

## 4. Create Simple Proforma Invoice (No Client)

### Request

```bash
curl -X POST http://localhost:3000/invoice/proforma \
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
    "proformaExpiresAt": "2025-11-30",
    "total": 1500.00,
    "taxAmount": 200.00,
    "notes": "Quick estimate - for RFQ response"
  }'
```

### Response

```json
{
  "id": "clm0proforma999",
  "invoiceNumber": "PROFORM-LG1W2BW-D5K3M1",
  "invoiceType": "PROFORMA_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": null,
  "clientName": "Unknown",
  "clientEmail": null,
  "issueDate": "2025-11-24",
  "dueDate": null,
  "proformaExpiresAt": "2025-11-30",
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
  "notes": "Quick estimate - for RFQ response",
  "createdAt": "2025-11-24T10:45:00.000Z",
  "updatedAt": "2025-11-24T10:45:00.000Z"
}
```

---

## 5. List Proforma Invoices with Pagination

### Request

```bash
curl -X GET "http://localhost:3000/invoice/proforma?page=1&limit=20&clientId=clm0client123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response

```json
{
  "data": [
    {
      "id": "clm0proforma123",
      "invoiceNumber": "PROFORM-LG1W2BW-A3K5N9",
      "invoiceType": "PROFORMA_INVOICE",
      "status": "DRAFT",
      "isPaid": false,
      "clientId": "clm0client123",
      "clientName": "João Silva",
      "clientEmail": "joao@example.com",
      "issueDate": "2025-11-22",
      "dueDate": null,
      "proformaExpiresAt": "2025-12-22",
      "items": [...],
      "subtotal": 2629.97,
      "taxAmount": 300.00,
      "discountAmount": 50.00,
      "totalAmount": 2879.97,
      "notes": null,
      "createdAt": "2025-11-24T10:30:00.000Z",
      "updatedAt": "2025-11-24T10:30:00.000Z"
    },
    // ... more proformas
  ],
  "total": 8,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

## 6. Get Single Proforma Invoice

### Request

```bash
curl -X GET http://localhost:3000/invoice/proforma/clm0proforma123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response

```json
{
  "id": "clm0proforma123",
  "invoiceNumber": "PROFORM-LG1W2BW-A3K5N9",
  "invoiceType": "PROFORMA_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-22",
  "dueDate": null,
  "proformaExpiresAt": "2025-12-22",
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
curl -X POST http://localhost:3000/invoice/proforma \
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
  "message": "Proforma invoice must have at least one item",
  "error": "Bad Request"
}
```

---

### Non-existent Client

**Request:**

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
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
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
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

### Proforma Invoice Not Found

**Request:**

```bash
curl -X GET http://localhost:3000/invoice/proforma/non-existent-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (404):**

```json
{
  "statusCode": 404,
  "message": "Proforma invoice with ID non-existent-id not found",
  "error": "Not Found"
}
```

---

### Invalid Quantity

**Request:**

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "id": "clm0client123"
    },
    "items": [{"id": "clm0item1", "quantity": 0}],
    "issueDate": "2025-11-24",
    "total": 100
  }'
```

**Response (400):**

```json
{
  "statusCode": 400,
  "message": "Item quantity must be greater than 0",
  "error": "Bad Request"
}
```

---

## Validation Rules Summary

### Client

- `id` (optional): Existing client ID
- `name` (conditional): Required if creating new client, min 2 chars, max 100 chars
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

### Proforma Invoice

- `issueDate` (required): ISO 8601 date
- `dueDate` (optional): ISO 8601 date
- `proformaExpiresAt` (optional): ISO 8601 date - quote expiry
- `total` (required): Positive number with max 2 decimals
- `taxAmount` (optional): Positive number with max 2 decimals
- `subtotal` (optional): Positive number with max 2 decimals
- `discountAmount` (optional): Positive number with max 2 decimals
- `notes` (optional): String

---

## Best Practices

1. **Always provide client details** - Helps with quotation management
2. **Set proformaExpiresAt** - Indicates quote validity period
3. **Use dueDate for follow-up** - When client should respond
4. **Include detailed notes** - Reference numbers, special terms, conditions
5. **Use ISO 8601 dates** - Format: YYYY-MM-DD
6. **Validate amounts before sending** - Total should equal subtotal + tax - discount
7. **Handle pagination properly** - Use page/limit for large datasets
8. **Store invoice IDs** - For tracking quotations and conversions
9. **isPaid is always false** - Don't attempt to change it
10. **Archive expired quotes** - Clean up old proformas periodically

---

## Proforma to Invoice Conversion Workflow

### Typical Sales Flow

```
1. Create Proforma Invoice (Quotation)
   └─ Client reviews quote
   └─ Valid until proformaExpiresAt

2. Client Accepts Quote
   └─ Create Normal Invoice from proforma details
   └─ OR create Invoice Receipt for immediate payment

3. Payment Processing
   └─ Normal Invoice: await payment (isPaid: false → true)
   └─ Invoice Receipt: immediate sale (isPaid: true)

4. Archival
   └─ Mark proforma as converted
   └─ Reference the actual invoice ID
```

### Copy Proforma to Invoice Example

When converting a proforma to a normal invoice:

```typescript
// Get existing proforma
const proforma = await proformaService.findOne(proformaId);

// Create normal invoice with same details
const normalInvoice = await normalInvoiceService.create({
  client: { id: proforma.clientId },
  items: proforma.items.map((item) => ({
    id: item.itemsId,
    quantity: item.quantity,
  })),
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: proforma.dueDate?.toISOString().split("T")[0],
  total: proforma.total,
  taxAmount: proforma.taxAmount,
  discountAmount: proforma.discountAmount,
  notes: `Converted from proforma ${proforma.number}: ${proforma.notes}`,
});
```

---

## Field Mapping

When converting to response DTO:

```javascript
{
  id: invoice.id,
  invoiceNumber: invoice.number,                    // PROFORM-xxx
  invoiceType: invoice.type,                        // Always 'PROFORMA_INVOICE'
  isPaid: invoice.isPaid,                           // Always false
  clientId: invoice.clientId,                     // Can be null
  clientName: invoice.client?.name || 'Unknown',
  clientEmail: invoice.client?.email,
  issueDate: formatted(invoice.createdAt),
  dueDate: formatted(invoice.dueDate),              // Optional follow-up date
  proformaExpiresAt: formatted(invoice.proformaExpiresAt),  // Quote expiry
  items: invoice.items.map(formatItem),
  subtotal: invoice.subtotal,
  taxAmount: invoice.taxAmount,
  discountAmount: invoice.discountAmount,
  totalAmount: invoice.total,
  notes: invoice.notes,
  createdAt: invoice.createdAt.toISO(),
  updatedAt: invoice.updatedAt.toISO()
}
```

---

## Common Use Cases

### Scenario 1: RFQ (Request for Quotation)

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "name": "Acme Corporation",
      "email": "procurement@acme.com"
    },
    "items": [
      {"id": "item1", "quantity": 100},
      {"id": "item2", "quantity": 50}
    ],
    "issueDate": "2025-11-24",
    "proformaExpiresAt": "2025-12-24",
    "dueDate": "2025-12-20",
    "total": 15000.00,
    "taxAmount": 2500.00,
    "notes": "Bulk order - Request quote by Dec 20 for processing"
  }'
```

### Scenario 2: Sales Proposal with Expiry

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "id": "clm0client123"
    },
    "items": [
      {"id": "clm0item1", "quantity": 1}
    ],
    "issueDate": "2025-11-24",
    "proformaExpiresAt": "2025-11-27",
    "total": 5000.00,
    "taxAmount": 750.00,
    "notes": "Special promotional price - expires Nov 27 only"
  }'
```

### Scenario 3: Estimate for Approval

```bash
curl -X POST http://localhost:3000/invoice/proforma \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"name": "Consulting Service", "price": 150, "quantity": 40, "type": "SERVICE"}
    ],
    "issueDate": "2025-11-24",
    "dueDate": "2025-12-01",
    "total": 6000.00,
    "notes": "Estimate for approval - PO#123456 required for processing"
  }'
```

---

## Integration Points

### With Normal Invoice

- Convert accepted proformas to normal invoices
- Track quotation-to-invoice ratio
- Monitor conversion rates

### With Invoice Receipt

- Quick quote-to-sale workflow for walk-in clients
- Immediate conversion for point-of-sale items
- Simplified checkout process

### Reporting

- Quote pipeline analysis
- Expired quotations tracking
- Quotation acceptance rates
- Average quote-to-order timeframe
