import { Product, ProductStatus } from "@/types";

export interface CategoryMock {
  id: string;
  name: string;
  count: number;
  icon: string; // Icon name
}

export interface ProductMock extends Product {
  image?: string;
  description?: string;
  barcode?: number;
}

export const mockCategories: CategoryMock[] = [
  { id: "1", name: "Breakfast", count: 12, icon: "Coffee" },
  { id: "2", name: "Lunch", count: 12, icon: "Utensils" },
  { id: "3", name: "Dinner", count: 12, icon: "UtensilsCrossed" },
  { id: "4", name: "Soup", count: 12, icon: "Soup" },
  { id: "5", name: "Desserts", count: 12, icon: "IceCream" },
  { id: "6", name: "Side Dish", count: 12, icon: "FishSymbol" }, // Changed Fish to FishSymbol as simplistic match
  { id: "7", name: "Appetizer", count: 12, icon: "Pizza" }, // Changed Bowl to Pizza as proxy
  { id: "8", name: "Beverages", count: 12, icon: "CupSoda" },
];

export const mockProducts: ProductMock[] = [
  {
    id: "p1",
    name: "Pasta Bolognese",
    description: "Delicious beef lasagna with double chilli Delicious beef",
    sku: "SKU001",
    category: "Lunch",
    reserved: 50,
    price: 50.5,
    retailPrice: { min: 50.5, max: 50.5 },
    image:
      "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFzdGElMjBib2xvZ25lc2V8ZW58MHx8MHx8fDA%3D",
    isActive: true,
    status: ProductStatus.Disponível,
    barcode: 5601790412001,
  },
  {
    id: "p2",
    name: "Spicy Fried Chicken",
    description: "Delicious beef lasagna with double chilli Delicious beef",
    sku: "SKU002",
    category: "Lunch",
    reserved: 30,
    price: 45.7,
    retailPrice: { min: 45.7, max: 45.7 },
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJpZWQlMjBjaGlja2VufGVufDB8fDB8fHww",
    isActive: true,
    status: ProductStatus.Disponível,
    barcode: 1234567890124,
  },
  {
    id: "p3",
    name: "Grilled Steak",
    description: "Delicious beef lasagna with double chilli Delicious beef",
    sku: "SKU003",
    category: "Lunch",
    reserved: 20,
    price: 80.0,
    retailPrice: { min: 80.0, max: 80.0 },
    image:
      "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JpbGxlZCUyMHN0ZWFrfGVufDB8fDB8fHww",
    isActive: true,
    status: ProductStatus.Disponível,
    barcode: 1234567890125,
  },
  {
    id: "p4",
    name: "Fish And Chips",
    description: "Delicious beef lasagna with double chilli Delicious beef",
    sku: "SKU004",
    category: "Lunch",
    reserved: 15,
    price: 90.4,
    retailPrice: { min: 90.4, max: 90.4 },
    image:
      "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlzaCUyMGFuZCUyMGNoaXBzfGVufDB8fDB8fHww",
    isActive: true,
    status: ProductStatus.Disponível,
    barcode: 1234567890126,
  },
  {
    id: "p5",
    name: "Beef Bourguignon",
    description: "Delicious beef lasagna with double chilli Delicious beef",
    sku: "SKU005",
    category: "Lunch",
    reserved: 12,
    price: 75.5,
    retailPrice: { min: 75.5, max: 75.5 },
    image:
      "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVlZiUyMGJvdXJndWlnbm9ufGVufDB8fDB8fHww",
    isActive: true,
    status: ProductStatus.Disponível,
    barcode: 1234567890127,
  },
  {
    id: "p6",
    name: "Spaghetti Carbonara",
    description: "Delicious beef lasagna with double chilli Delicious beef",
    sku: "SKU006",
    category: "Lunch",
    reserved: 40,
    price: 35.3,
    retailPrice: { min: 35.3, max: 35.3 },
    image:
      "https://plus.unsplash.com/premium_photo-1674384860228-4c1735cb24d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhZ2hldHRpJTIwY2FyYm9uYXJhfGVufDB8fDB8fHww",
    isActive: true,
    status: ProductStatus.Disponível,
    barcode: 1234567890128,
  },
];
