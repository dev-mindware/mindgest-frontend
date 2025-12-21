import { Client } from "./clients"
import { ItemBody } from "./credit-note"

export interface ProformData {
  client: Client
  items: ItemBody[]
  issueDate: string
  dueDate: string
  proformaExpiresAt: string
  total: number
  taxAmount: number
  subtotal: number
  discountAmount: number
  retentionAmount: number
  paymentMethod: string
  notes: string
}

export interface Item {
  id: string
  name: string
  description: string
  sku: string
  barcode: string
  price: number
  quantity: number
  type: string
  cost: number
  minStock: number
  maxStock: number
  unit: string
  weight: number
  dimensions: string
  image: string
  storeId: string
  categoryId: string
  hasExpiry: boolean
  expiryDate: string
  daysToExpiry: number
}
