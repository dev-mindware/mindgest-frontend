# Receipt API - Complete Guide

## Overview

The Receipt API handles immediate payment sales transactions. A receipt represents a completed sale where the client pays at the point of sale. Receipts are always marked as paid (isPaid=true) and include change calculation functionality.

## Key Features

- ✅ **Immediate Payment** - Automatically marked as paid
- ✅ **Change Calculation** - Automatically calculates change from received amount
- ✅ **Invoice Reference** - Link to original invoice if refunding/converting
- ✅ **Payment Method Tracking** - Record how payment was made (cash, card, etc.)
- ✅ **Refund Support** - Create refund receipts with inverse amounts
- ✅ **Pagination** - List receipts with flexible filtering
- ✅ **Date Range Filtering** - Search by date range
- ✅ **Operator Tracking** - Records which user created the receipt

## API Endpoints

### 1. Create Receipt

**Endpoint:** `POST /invoice/receipt`

**Authentication:** Required (Bearer Token)

**Required Roles:** ADMIN, OWNER, MANAGER, CASHIER

**Request Body:**

```json
{
  "clientId": "clm0client123",
  "issueDate": "2025-11-24",
  "total": 1500.5,
  "receivedValue": 2000.0,
  "taxAmount": 300.0,
  "discountAmount": 50.0,
  "paymentMethod": "CASH",
  "originalInvoiceId": "clm0invoice123",
  "notes": "Payment received for order #12345"
}
```

**Response (201):**

```json
{
  "id": "clm0receipt001",
  "receiptNumber": "REC-LG1W2BW-A3K5N9",
  "receiptType": "RECEIPT",
  "isPaid": true,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-24",
  "subtotal": 1250.5,
  "taxAmount": 300.0,
  "discountAmount": 50.0,
  "totalAmount": 1500.5,
  "receivedValue": 2000.0,
  "changeAmount": 499.5,
  "paymentMethod": "CASH",
  "originalInvoiceId": "clm0invoice123",
  "notes": "Payment received for order #12345",
  "operatorId": "clm0user456",
  "operatorName": "Maria Santos",
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

---

### 2. List Receipts

**Endpoint:** `GET /invoice/receipt`

**Authentication:** Required (Bearer Token)

**Required Roles:** ADMIN, OWNER, MANAGER, CASHIER

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | string | No | Page number (default: 1) |
| limit | string | No | Items per page (default: 10, max: 100) |
| clientId | string | No | Filter by client ID |
| startDate | string | No | Start date (ISO 8601) for range filter |
| endDate | string | No | End date (ISO 8601) for range filter |

**Example Request:**

```bash
GET /invoice/receipt?page=1&limit=20&clientId=clm0client123&startDate=2025-11-01&endDate=2025-11-30
```

**Response:**

```json
{
  "data": [
    {
      "id": "clm0receipt001",
      "receiptNumber": "REC-LG1W2BW-A3K5N9",
      "receiptType": "RECEIPT",
      "isPaid": true,
      "clientId": "clm0client123",
      "clientName": "João Silva",
      "clientEmail": "joao@example.com",
      "issueDate": "2025-11-24",
      "subtotal": 1250.5,
      "taxAmount": 300.0,
      "discountAmount": 50.0,
      "totalAmount": 1500.5,
      "receivedValue": 2000.0,
      "changeAmount": 499.5,
      "paymentMethod": "CASH",
      "operatorId": "clm0user456",
      "operatorName": "Maria Santos",
      "createdAt": "2025-11-24T10:30:00.000Z",
      "updatedAt": "2025-11-24T10:30:00.000Z"
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

### 3. Get Receipt by ID

**Endpoint:** `GET /invoice/receipt/:id`

**Authentication:** Required (Bearer Token)

**Required Roles:** ADMIN, OWNER, MANAGER, CASHIER

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Receipt ID |

**Example Request:**

```bash
GET /invoice/receipt/clm0receipt001
```

**Response:**

```json
{
  "id": "clm0receipt001",
  "receiptNumber": "REC-LG1W2BW-A3K5N9",
  "receiptType": "RECEIPT",
  "isPaid": true,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-24",
  "subtotal": 1250.5,
  "taxAmount": 300.0,
  "discountAmount": 50.0,
  "totalAmount": 1500.5,
  "receivedValue": 2000.0,
  "changeAmount": 499.5,
  "paymentMethod": "CASH",
  "originalInvoiceId": "clm0invoice123",
  "notes": "Payment received for order #12345",
  "operatorId": "clm0user456",
  "operatorName": "Maria Santos",
  "createdAt": "2025-11-24T10:30:00.000Z",
  "updatedAt": "2025-11-24T10:30:00.000Z"
}
```

---

### 4. Refund Receipt

**Endpoint:** `POST /invoice/receipt/:id/refund`

**Authentication:** Required (Bearer Token)

**Required Roles:** ADMIN, OWNER, MANAGER

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Receipt ID to refund |

**Request Body:**

```json
{
  "reason": "Client returned items due to defect"
}
```

**Response (201):**

```json
{
  "id": "clm0receipt002",
  "receiptNumber": "REFUND-LG1W2BW-B7M2K8",
  "receiptType": "RECEIPT",
  "isPaid": true,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-24",
  "subtotal": -1250.5,
  "taxAmount": -300.0,
  "discountAmount": -50.0,
  "totalAmount": -1500.5,
  "receivedValue": -2000.0,
  "changeAmount": -499.5,
  "originalInvoiceId": "clm0receipt001",
  "notes": "Refund: Client returned items due to defect",
  "operatorId": "clm0user456",
  "operatorName": "Maria Santos",
  "createdAt": "2025-11-24T11:00:00.000Z",
  "updatedAt": "2025-11-24T11:00:00.000Z"
}
```

---

## Usage Examples

### Example 1: Simple Cash Sale

**Scenario:** Client buys items worth 500 AOA and pays with 1000 AOA in cash.

```bash
curl -X POST http://localhost:3000/invoice/receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "clm0client123",
    "issueDate": "2025-11-24",
    "total": 500.00,
    "receivedValue": 1000.00,
    "paymentMethod": "CASH",
    "notes": "Daily sales"
  }'
```

**Result:**

- Receipt created with automatic change calculation: 500 AOA
- Marked as paid immediately
- Can be used for sales reporting

---

### Example 2: Sale with Taxes and Discount

**Scenario:** Client buys items with IVA tax and applies a discount.

```bash
curl -X POST http://localhost:3000/invoice/receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "clm0client456",
    "issueDate": "2025-11-24",
    "total": 2200.00,
    "receivedValue": 2500.00,
    "taxAmount": 400.00,
    "discountAmount": 100.00,
    "paymentMethod": "CARD",
    "notes": "Card payment - see authorization #12345"
  }'
```

**Calculation:**

- Subtotal: 2200.00 - 400.00 + 100.00 = 1900.00
- Total: 2200.00
- Change: 2500.00 - 2200.00 = 300.00

---

### Example 3: Receipt Linked to Original Invoice

**Scenario:** Converting a normal invoice to a receipt (client pays now).

```bash
curl -X POST http://localhost:3000/invoice/receipt \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "clm0client789",
    "issueDate": "2025-11-24",
    "total": 5000.00,
    "receivedValue": 5000.00,
    "taxAmount": 750.00,
    "paymentMethod": "TRANSFER",
    "originalInvoiceId": "clm0invoice789",
    "notes": "Payment received for invoice #INV-123"
  }'
```

---

### Example 4: List Daily Receipts

**Scenario:** Get all receipts from today for daily reconciliation.

```bash
curl -X GET "http://localhost:3000/invoice/receipt?startDate=2025-11-24&endDate=2025-11-24&limit=50" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Example 5: Refund a Receipt

**Scenario:** Client returns items and needs refund.

```bash
curl -X POST http://localhost:3000/invoice/receipt/clm0receipt001/refund \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Client changed mind - items defective"
  }'
```

**Result:**

- Refund receipt created with negative amounts
- Linked to original receipt via originalInvoiceId
- Can be used to track refunds separately

---

## Validation Rules

### Required Fields

| Field         | Type   | Validation                       |
| ------------- | ------ | -------------------------------- |
| clientId      | string | Must be existing client ID       |
| issueDate     | string | ISO 8601 format (YYYY-MM-DD)     |
| total         | number | Must be > 0, max 2 decimals      |
| receivedValue | number | Must be >= total, max 2 decimals |

### Optional Fields

| Field             | Type   | Validation                         | Notes                  |
| ----------------- | ------ | ---------------------------------- | ---------------------- |
| taxAmount         | number | Must be >= 0, max 2 decimals       |                        |
| discountAmount    | number | Must be >= 0, max 2 decimals       |                        |
| paymentMethod     | enum   | CASH, CARD, TRANSFER, MOBILE_MONEY |                        |
| originalInvoiceId | string | Must be existing invoice ID        | Link to source invoice |
| notes             | string | No validation                      | Free text field        |

---

## Error Responses

### 400 - Bad Request

**Client Not Found:**

```json
{
  "statusCode": 400,
  "message": "Client with ID non-existent-id not found",
  "error": "Bad Request"
}
```

**Received Amount Less Than Total:**

```json
{
  "statusCode": 400,
  "message": "Received value (1000.00) must be >= total (1500.00)",
  "error": "Bad Request"
}
```

**Invalid Original Invoice:**

```json
{
  "statusCode": 400,
  "message": "Original invoice with ID non-existent-id not found",
  "error": "Bad Request"
}
```

### 404 - Not Found

```json
{
  "statusCode": 404,
  "message": "Receipt with ID clm0receipt999 not found",
  "error": "Not Found"
}
```

### 500 - Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Failed to create receipt: Database connection error",
  "error": "Internal Server Error"
}
```

---

## Business Rules

1. **Always Paid** - Receipts are automatically marked as paid (isPaid=true)
2. **Change Calculation** - Change = receivedValue - total (must be >= 0)
3. **Immediate Status** - Status set to PAID on creation
4. **Operator Tracking** - Current user's ID is recorded as operator
5. **Company Isolation** - Receipts belong to user's company
6. **Store Assignment** - Receipt assigned to user's store
7. **Immutable Type** - Receipt type cannot be changed after creation

---

## Data Flow

```
POST /invoice/receipt
    ↓
Validate client exists
    ↓
Validate original invoice (if provided)
    ↓
Calculate change amount
    ↓
Create receipt with:
  - type: RECEIPT
  - isPaid: true
  - status: PAID
  - paidAt: now()
    ↓
Return formatted response with:
  - changeAmount calculated
  - operatorName resolved
  - clientName resolved
```

---

## Common Use Cases

### Daily Sales Tracking

Use receipts to track all daily cash transactions for reconciliation.

### POS Integration

Create receipt directly when client pays at checkout.

### Multi-Payment Support

Create separate receipts for split payments or partial payments.

### Refund Management

Use refund endpoint to handle returns without deleting original receipt.

### Sales Reporting

Receipts are automatically included in sales reports (filtered by isPaid=true).

### Cash Flow Analysis

Use receivedValue field to track actual cash received vs invoiced amounts.

---

## Best Practices

1. **Always Provide Client ID** - Ensures proper tracking and reporting
2. **Include Payment Method** - Helps with reconciliation
3. **Link to Original Invoice** - Track invoice-to-receipt conversion
4. **Add Notes** - Document any special circumstances
5. **Validate Amounts** - Ensure receivedValue >= total before submission
6. **Use Pagination** - For efficient data retrieval in reports
7. **Filter by Date Range** - For daily/monthly reconciliation

---

## Integration Notes

- Receipts are automatically included in sales reporting (Sales Report API)
- Use `isPaid=true` filter to identify completed transactions
- Receipt amounts are included in profit/margin calculations
- Change amounts can be tracked separately for cash management
