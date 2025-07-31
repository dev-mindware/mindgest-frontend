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

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}