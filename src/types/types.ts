
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
  status?: "Disponível" | "Pendente" | "Esgotado";
  salesperday?: number;
  repositiontime?: number;
  description?: string;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  price: number;
  isActive: boolean;
  description?: string;
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