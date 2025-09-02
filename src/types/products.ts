


export interface Product {
  id: string;
  name: string; 
  sku: string;
  category: string;
  subcategory?: string;

  // Preços
  price?: number; 
  retailPrice?: {
    min: number;
    max: number;
  };
  wholesalePrice?: {
    min: number;
    max: number;
  };

  // Estoque
  stock: number;
  minstock?: number;
  location?: string;
  variants?: number;

  // Gestão e Fornecimento
  supplier?: string;
  measurement?: string;
  expirydate?: Date;
  tax?: number;
  warranty?: number;
  salesperday?: number;
  repositiontime?: number;

  // Exibição
  description?: string;
  isActive?: boolean;
  status?: ProductStatus;
}


/* export interface Product {
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
} */

export interface ProductCard {
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
  export enum ProductStatus {
  Disponível = "Disponível",
  Pendente = "Pendente",
  Esgotado = "Esgotado",
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}
