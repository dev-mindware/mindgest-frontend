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
  title: string;
  sku: string;
  category: string;
  subcategory: string;
  retailPrice: {
    min: number;
    max: number;
  };
  wholesalePrice: {
    min: number;
    max: number;
  };
  stock: number;
  location: string;
  variants: number;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}