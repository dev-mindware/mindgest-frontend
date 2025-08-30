export interface Cashier {
  id: number;
  name: string;
  cashNumber: string;
  totalSold: number;
  activityTime: string;
  progress: number;
  status: "Ativo" | "Inativo" | "Pausado" | "Fechado";
}

export interface OpenCashRegister {
  id: number;
  name: string;
  cashNumber: string;
}

export interface CashierCardProps {
  cashier: Cashier;
  onAdd: (cashier: Pick<Cashier, "name" | "cashNumber">) => void;
}

export interface CashOpeningFormProps {
  openCashRegisters: OpenCashRegister[];
  onRemove: (id: number) => void;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  measurement?: string;
  stock: number;
  minstock?: number;
  supplier?: string;
  location?: string;
  expirydate?: Date;
  tax?: number;
  warranty?: number;
  status: ProductStatus;
  salesperday?: number;
  repositiontime?: number;
  description?: string;
}

export enum ServiceStatus {
  Activo = "Activo",
  Pendente = "Pendente",
  Inactivo = "Inactivo",
}

export enum ProductStatus {
  Disponível = "Disponível",
  Pendente = "Pendente",
  Esgotado = "Esgotado",
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  status: ServiceStatus;
  description?: string;
  isActive?: boolean
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export type Plan = "BASE" | "TSUNAMI" | "SMART_PRO"

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}