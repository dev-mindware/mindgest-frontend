import { Product, Service } from './types';

export const initialProducts: Product[] = [
  {
    id: '1',
    title: 'PC Gaming Intel i9 RTX 4080',
    sku: 'Gigabyte-900',
    category: 'Eletrônicos',
    subcategory: 'Computadores',
    price: 5700000,
    stock: 10,
    location: 'Armazém A',
    variants: 3,
    isActive: true
  },
  {
    id: '2',
    title: 'Smartphone Samsung Galaxy S24',
    sku: 'Samsung-S24',
    category: 'Telemóveis',
    subcategory: 'Smartphones',
    price: 270000,
    stock: 50,
    location: 'Armazém B',
    variants: 2,
    isActive: true
  },
  {
    id: '3',
    title: 'TV LG OLED 55" 4K',
    sku: 'LG-4K55',
    category: 'Eletrônicos',
    subcategory: 'TVs',
    price: 1100000,
    stock: 30,
    location: 'Armazém C',
    variants: 1,
    isActive: false
  },
  {
    id: '4',
    title: 'Máquina de Lavar Samsung 10kg',
    sku: 'Wash-S10',
    category: 'Eletrodomésticos',
    subcategory: 'Lavadoras',
    price: 450000,
    stock: 15,
    location: 'Armazém D',
    variants: 1,
    isActive: true
  },
  {
    id: '5',
    title: 'Ventoinha Xiaomi Smart Fan',
    sku: 'Xiao-Fan',
    category: 'Eletrodomésticos',
    subcategory: 'Ventoinhas',
    price: 120000,
    stock: 60,
    location: 'Armazém E',
    variants: 2,
    isActive: false
  },
  {
    id: '6',
    title: 'iPhone 15 Pro Max 256GB',
    sku: 'Apple-15PM',
    category: 'Telemóveis',
    subcategory: 'Smartphones',
    price: 850000,
    stock: 35,
    location: 'Armazém B',
    variants: 3,
    isActive: true
  },
  {
    id: '7',
    title: 'Monitor Dell 27" 4K UHD',
    sku: 'Dell-4K27',
    category: 'Eletrônicos',
    subcategory: 'Monitores',
    price: 320000,
    stock: 25,
    location: 'Armazém A',
    variants: 1,
    isActive: true
  },
  {
    id: '8',
    title: 'Tablet Huawei MatePad 11',
    sku: 'Huawei-M11',
    category: 'Eletrônicos',
    subcategory: 'Tablets',
    price: 280000,
    stock: 22,
    location: 'Armazém C',
    variants: 2,
    isActive: true
  },
  {
    id: '9',
    title: 'Teclado Mecânico Redragon K552',
    sku: 'Red-K552',
    category: 'Acessórios',
    subcategory: 'Periféricos',
    price: 45000,
    stock: 120,
    location: 'Armazém E',
    variants: 4,
    isActive: true
  },
  {
    id: '10',
    title: 'Headset Gamer Logitech G Pro X',
    sku: 'Logi-GPX',
    category: 'Acessórios',
    subcategory: 'Áudio',
    price: 85000,
    stock: 90,
    location: 'Armazém A',
    variants: 1,
    isActive: false
  },
]

export const initialServices: Service[] = [
  { id: '1', title: 'Consultoria em TI', category: "Consultoria", description: 'Serviço de consultoria em tecnologia da informação', price: 150000, isActive: true },
  { id: '2', title: 'Desenvolvimento de Software', category: "Desenvolvimento", description: 'Criação de software sob medida', price: 300000, isActive: true },
  { id: '3', title: 'Suporte Técnico', category: "Suporte", description: 'Assistência técnica para equipamentos de informática', price: 80000, isActive: false },
  { id: '4', title: 'Treinamento em Tecnologia', category: "Treinamento", description: 'Capacitação em ferramentas tecnológicas', price: 100000, isActive: true },
  { id: '5', title: 'Gerenciamento de Projetos', category: "Gerenciamento", description: 'Gestão de projetos de tecnologia', price: 200000, isActive: true },
]