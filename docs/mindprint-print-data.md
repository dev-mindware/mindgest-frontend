# MindPrint: contrato do endpoint `print-data`

O POS imprime a Factura Recibo directamente na impressora térmica através do
agente local **MindPrint**. O frontend monta o talão em ESC/POS, mas **todos os
campos legais vêm do backend, prontos a imprimir**: são os mesmos dados que
alimentam o PDF de `download-thermal`. O frontend não calcula nem corrige
nenhum valor.

Tipo no frontend: `InvoiceReceiptPrintData` em `src/types/mindprint.ts`.

## Endpoint

```
GET /invoice/invoice-receipt/:id/print-data
Authorization: Bearer <token>   (igual aos outros endpoints)
```

A resposta pode vir directa ou embrulhada em `{ "data": { ... } }`.

```json
{
  "id": "cmw4vwiw8000801obgbr2ckad",
  "title": "FACTURA RECIBO",
  "number": "FR FR9726S47405N/23",
  "issueDate": "2026-11-06T12:21:35+01:00",
  "accountingPeriod": "2026-11",
  "currencyCode": "AOA",
  "company": {
    "name": "MINDWARE - COMÉRCIO E SERVIÇOS, LDA",
    "taxNumber": "5002464497",
    "email": "info@mindware.ao",
    "phone": "943100922",
    "address": "Luanda, Angola",
    "logoUrl": null
  },
  "client": {
    "name": "Consumidor Final",
    "taxNumber": "999999999"
  },
  "items": [
    {
      "description": "Subscrição MindGest - Plano Base",
      "quantity": 1,
      "unitPrice": 5445.22,
      "taxLabel": "IVA 0% M04",
      "total": 5445.22
    }
  ],
  "taxes": [
    {
      "label": "IVA 0% M04",
      "incidence": 5445.22,
      "amount": 0,
      "note": "M04: IVA - Regime de Exclusão"
    }
  ],
  "subtotal": 5445.22,
  "discountAmount": 0,
  "taxAmount": 0,
  "retentionAmount": 0,
  "total": 5445.22,
  "issuedBy": "Nome do operador",
  "notes": "Subscrição MindGest - Plano Base (1 mês)",
  "paymentTerms": null,
  "qrCode": "<texto exacto codificado no QR do PDF>",
  "hash": "aB3x",
  "certificationNumber": "FE/241/AGT/2026",
  "footer": ["www.mindware.ao"]
}
```

## Campos

| Campo | Obrigatório | Notas |
|---|---|---|
| `id`, `number`, `title` | sim | `title` é o que sai no topo (ex.: `FACTURA RECIBO`). |
| `issueDate` | sim | ISO 8601. O frontend mostra a hora de parede, sem converter o fuso. |
| `accountingPeriod` | sim | Já formatado como deve sair no talão. |
| `currencyCode` | não | Por omissão sai `Kz`. |
| `company.name`, `company.taxNumber` | **sim** | |
| `company.email/phone/address` | não | |
| `company.logoUrl` | não | URL absoluto. Só sai se a imagem for servida com CORS (`Access-Control-Allow-Origin` para o domínio do MindGest). |
| `client.name`, `client.taxNumber` | sim / não | |
| `items[]` | **sim** | `taxLabel` curto (até ~10 caracteres cabe na coluna; mais do que isso quebra de linha). |
| `taxes[]` | sim | Quadro de impostos como no PDF. `note` (opcional) sai por baixo do quadro: usar para o motivo de isenção. |
| `subtotal`, `taxAmount`, `total` | sim | |
| `discountAmount`, `retentionAmount` | não | Só aparecem quando forem maiores que zero. |
| `issuedBy` | não | Nome de quem emitiu. |
| `notes`, `paymentTerms` | não | Podem ter quebras de linha (`\n`). |
| `qrCode` | **sim** | O texto **exacto** do QR do PDF. O frontend imprime-o como imagem. |
| `hash` | **sim** | Exactamente como sai no PDF (ex.: os 4 caracteres). |
| `certificationNumber` | **sim** | |
| `footer[]` | não | Linhas do rodapé (contactos). |

Valores monetários podem vir como número ou string decimal (`"1450.00"`). O
frontend só os formata (`1 450,00`).

Se faltar um campo obrigatório, ou se o pedido falhar, o talão **não** é enviado
ao MindPrint e o POS oferece "Imprimir pelo browser" (o PDF actual).

Texto: o talão usa os códigos de página da impressora (acentos portugueses
suportados). Evitar emojis e símbolos fora do Latin-1; travessões e aspas
tipográficas são convertidos para ASCII pelo frontend.

## Flag no frontend

```
NEXT_PUBLIC_MINDPRINT_ENABLED=true   # por omissão: desligada
```

## Segurança (urgente, à parte deste endpoint)

`GET /invoice/invoice-receipt` devolve hoje `company.agtPrivateKey`. A chave
privada AGT não deve sair do servidor: retirar o campo de todas as respostas
(e não o incluir neste endpoint novo).
