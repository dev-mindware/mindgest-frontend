import { Product } from '@/types/types';

export const initialProducts: Product[] = [
  {
    id: '1',
    title: 'PC Gaming Intel i9 RTX 4080',
    sku: 'Gigabyte-900',
    category: 'Eletrônicos',
    subcategory: 'Computadores',
    retailPrice: { min: 5200000, max: 5700000 },
    wholesalePrice: { min: 4900000, max: 5100000 },
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
    retailPrice: { min: 270000, max: 320000 },
    wholesalePrice: { min: 240000, max: 260000 },
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
    retailPrice: { min: 1100000, max: 1300000 },
    wholesalePrice: { min: 980000, max: 1050000 },
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
    retailPrice: { min: 450000, max: 490000 },
    wholesalePrice: { min: 410000, max: 430000 },
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
    retailPrice: { min: 120000, max: 150000 },
    wholesalePrice: { min: 100000, max: 110000 },
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
    retailPrice: { min: 850000, max: 920000 },
    wholesalePrice: { min: 790000, max: 830000 },
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
    retailPrice: { min: 320000, max: 350000 },
    wholesalePrice: { min: 290000, max: 310000 },
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
    retailPrice: { min: 280000, max: 300000 },
    wholesalePrice: { min: 250000, max: 270000 },
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
    retailPrice: { min: 45000, max: 60000 },
    wholesalePrice: { min: 40000, max: 45000 },
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
    retailPrice: { min: 85000, max: 99000 },
    wholesalePrice: { min: 75000, max: 80000 },
    stock: 90,
    location: 'Armazém A',
    variants: 1,
    isActive: false
  },
  {
    id: '11',
    title: 'Máquina de Café Nespresso Mini',
    sku: 'Nes-Mini',
    category: 'Eletrodomésticos',
    subcategory: 'Cafeteiras',
    retailPrice: { min: 60000, max: 75000 },
    wholesalePrice: { min: 52000, max: 58000 },
    stock: 48,
    location: 'Armazém D',
    variants: 1,
    isActive: true
  },
  {
    id: '12',
    title: 'Impressora HP DeskJet 2710',
    sku: 'HP-2710',
    category: 'Eletrônicos',
    subcategory: 'Impressoras',
    retailPrice: { min: 120000, max: 135000 },
    wholesalePrice: { min: 105000, max: 110000 },
    stock: 40,
    location: 'Armazém C',
    variants: 1,
    isActive: true
  },
  {
    id: '13',
    title: 'Placa Mãe ASUS ROG STRIX B550',
    sku: 'ASUS-B550',
    category: 'Eletrônicos',
    subcategory: 'Componentes',
    retailPrice: { min: 150000, max: 175000 },
    wholesalePrice: { min: 135000, max: 145000 },
    stock: 26,
    location: 'Armazém A',
    variants: 1,
    isActive: false
  },
  {
    id: '14',
    title: 'Câmera Canon EOS M50 Mark II',
    sku: 'Canon-M50',
    category: 'Eletrônicos',
    subcategory: 'Câmeras',
    retailPrice: { min: 420000, max: 460000 },
    wholesalePrice: { min: 380000, max: 400000 },
    stock: 12,
    location: 'Armazém C',
    variants: 2,
    isActive: true
  },
  {
    id: '15',
    title: 'Smartwatch Amazfit GTS 4',
    sku: 'Amaz-GTS4',
    category: 'Acessórios',
    subcategory: 'Relógios',
    retailPrice: { min: 110000, max: 130000 },
    wholesalePrice: { min: 95000, max: 105000 },
    stock: 55,
    location: 'Armazém B',
    variants: 3,
    isActive: true
  },
  {
    id: '16',
    title: 'Notebook Lenovo IdeaPad 3',
    sku: 'Lenovo-IP3',
    category: 'Eletrônicos',
    subcategory: 'Portáteis',
    retailPrice: { min: 390000, max: 440000 },
    wholesalePrice: { min: 360000, max: 380000 },
    stock: 18,
    location: 'Armazém A',
    variants: 1,
    isActive: false
  },
  {
    id: '17',
    title: 'Cadeira Gamer ThunderX3',
    sku: 'Thunder-GC01',
    category: 'Móveis',
    subcategory: 'Cadeiras',
    retailPrice: { min: 180000, max: 210000 },
    wholesalePrice: { min: 160000, max: 175000 },
    stock: 27,
    location: 'Armazém F',
    variants: 2,
    isActive: true
  },
  {
    id: '18',
    title: 'Power Bank Xiaomi 20000mAh',
    sku: 'Xiao-PB20',
    category: 'Acessórios',
    subcategory: 'Energia',
    retailPrice: { min: 45000, max: 52000 },
    wholesalePrice: { min: 40000, max: 45000 },
    stock: 100,
    location: 'Armazém E',
    variants: 1,
    isActive: true
  }
];