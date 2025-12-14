# Normal Invoice API - Usage Examples

## 1. Create Invoice with Existing Client and Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/normal \
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
    "dueDate": "2025-12-22",
    "total": 1500.50,
    "taxAmount": 300,
    "discountAmount": 50
  }'
```

### Response

```json
{
  "id": "clm0invoice123",
  "invoiceNumber": "FACT-LG1W2BW-A3K5N9",
  "invoiceType": "NORMAL_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-22",
  "dueDate": "2025-12-22",
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

## 2. Create Invoice with New Client and New Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/normal \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "name": "Maria Santos",
      "email": "maria@example.com",
      "phone": " 923 456 789",
      "address": "Rua Principal, 456, Luanda",
      "companyId": "clm0company123"
    },
    "items": [
      {
        "name": "Samsung Galaxy S24",
        "price": 999.99,
        "quantity": 1,
        "sku": "SAMSUNG-S24-512",
        "type": "PRODUCT",
        "cost": 700.00,
        "companyId": "clm0company123"
      },
      {
        "name": "Tech Support Service",
        "price": 50.00,
        "quantity": 2,
        "type": "SERVICE",
        "companyId": "clm0company123"
      }
    ],
    "issueDate": "2025-11-24",
    "dueDate": "2025-12-24",
    "total": 1099.99,
    "taxAmount": 150.00,
    "notes": "Delivery on 2025-12-20"
  }'
```

### Response

```json
{
  "id": "clm0invoice456",
  "invoiceNumber": "FACT-LG1W2BW-B7M2K8",
  "invoiceType": "NORMAL_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client456",
  "clientName": "Maria Santos",
  "clientEmail": "maria@example.com",
  "issueDate": "2025-11-24",
  "dueDate": "2025-12-24",
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
  "notes": "Delivery on 2025-12-20",
  "createdAt": "2025-11-24T10:35:00.000Z",
  "updatedAt": "2025-11-24T10:35:00.000Z"
}
```

---

## 3. Create Invoice with Mixed Client and Items

### Request

```bash
curl -X POST http://localhost:3000/invoice/normal \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
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
        "type": "SERVICE",
        "companyId": "clm0company123"
      }
    ],
    "issueDate": "2025-11-24",
    "total": 385.00,
    "discountAmount": 15.00,
    "notes": "Rush delivery requested"
  }'
```

### Response

```json
{
  "id": "clm0invoice789",
  "invoiceNumber": "FACT-LG1W2BW-C9N4P7",
  "invoiceType": "NORMAL_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client789",
  "clientName": "Paulo Costa",
  "clientEmail": "paulo@example.com",
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
  "notes": "Rush delivery requested",
  "createdAt": "2025-11-24T10:40:00.000Z",
  "updatedAt": "2025-11-24T10:40:00.000Z"
}
```

---

## 4. List Invoices with Pagination

### Request

```bash
curl -X GET "http://localhost:3000/invoice/normal?page=1&limit=20&clientId=clm0client123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response

```json
{
  "data": [
    {
      "id": "clm0invoice123",
      "invoiceNumber": "FACT-LG1W2BW-A3K5N9",
      "invoiceType": "NORMAL_INVOICE",
      "status": "DRAFT",
      "isPaid": false,
      "clientId": "clm0client123",
      "clientName": "João Silva",
      "clientEmail": "joao@example.com",
      "issueDate": "2025-11-22",
      "dueDate": "2025-12-22",
      "items": [...],
      "subtotal": 2629.97,
      "taxAmount": 300.00,
      "discountAmount": 50.00,
      "totalAmount": 2879.97,
      "notes": null,
      "createdAt": "2025-11-24T10:30:00.000Z",
      "updatedAt": "2025-11-24T10:30:00.000Z"
    },
    // ... more invoices
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

---

## 5. Get Single Invoice

### Request

```bash
curl -X GET http://localhost:3000/invoice/normal/clm0invoice123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Response

```json
{
  "id": "clm0invoice123",
  "invoiceNumber": "FACT-LG1W2BW-A3K5N9",
  "invoiceType": "NORMAL_INVOICE",
  "status": "DRAFT",
  "isPaid": false,
  "clientId": "clm0client123",
  "clientName": "João Silva",
  "clientEmail": "joao@example.com",
  "issueDate": "2025-11-22",
  "dueDate": "2025-12-22",
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

```bash
curl -X POST http://localhost:3000/invoice/normal \
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
  "message": "Invoice must have at least one item",
  "error": "Bad Request"
}
```

### Non-existent Client

```bash
curl -X POST http://localhost:3000/invoice/normal \
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

### Invoice Not Found

```bash
curl -X GET http://localhost:3000/invoice/normal/non-existent-id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (404):**

```json
{
  "statusCode": 404,
  "message": "Invoice with ID non-existent-id not found",
  "error": "Not Found"
}
```

### Invalid Email

```bash
curl -X POST http://localhost:3000/invoice/normal \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "name": "Test User",
      "email": "invalid-email",
      "companyId": "clm0company123"
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

### Client

- `id` (optional): Existing client ID
- `name` (conditional): Required if creating new client, min 2 chars, max 100 chars
- `email` (optional): Valid email format
- `phone` (optional): Max 20 characters
- `address` (optional): Max 255 characters
- `taxNumber` (optional): Max 20 characters
- `companyId` (conditional): Required if creating new client

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
- `companyId` (conditional): Required if creating new item
- And 10+ other optional fields (minStock, maxStock, unit, weight, dimensions, image, etc.)

### Invoice

- `issueDate` (required): ISO 8601 date
- `dueDate` (optional): ISO 8601 date
- `total` (required): Positive number with max 2 decimals
- `taxAmount` (optional): Positive number with max 2 decimals
- `subtotal` (optional): Positive number with max 2 decimals
- `discountAmount` (optional): Positive number with max 2 decimals
- `notes` (optional): String

---

## Best Practices

1. **Always provide client ID or full client details** - Avoid typos by reusing existing clients when possible
2. **Always provide item ID or full item details** - Use existing items for consistency
3. **Validate amounts before sending** - Total should equal subtotal + tax - discount
4. **Use ISO 8601 dates** - Format: YYYY-MM-DD
5. **Set appropriate due dates** - Use for tracking payment terms
6. **Include notes for special instructions** - Helps with fulfillment
7. **Handle pagination properly** - Use page/limit for large datasets
8. **Store invoice IDs** - For future reference and updates
