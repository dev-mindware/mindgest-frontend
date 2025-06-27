// Enhanced ProductCards with working filters and diversified product data + category filter and sorting
"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { Icon, DeleteProduct, SeeProduct, EditProduct } from '@/components';
import { useModal } from "@/contexts"

interface ProductCard {
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

interface ProductCardsProps {
  onAddToOrder?: (item: OrderItem) => void;
  className?: string;
}

const initialProducts: ProductCard[] = [
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


const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};


const ProductCard: React.FC<{ product: ProductCard; onAddToOrder?: (item: OrderItem) => void }> = ({ product, onAddToOrder }) => {
  const handleAddToOrder = () => {
    if (onAddToOrder) {
      const orderItem: OrderItem = {
        id: product.id,
        title: product.title,
        price: product.retailPrice.min,
        quantity: 1
      };
      onAddToOrder(orderItem);
    }
  };

  const { openModal } = useModal()

  return (
    <Card className="relative overflow-hidden transition-shadow duration-200 border border-border bg-card hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
              <Icon name='Package' className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold leading-tight truncate text-foreground">
                {product.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  SKU - {product.sku}
                </span>
                {product.isActive && (
                  <Badge variant="secondary" className="text-xs text-green-700 bg-green-100 border-green-200">
                    Ativo
                  </Badge>
                )}
                {!product.isActive && (
                  <Badge variant="secondary" className="text-xs text-red-700 bg-red-100 border-red-200">
                    Inactivo
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className='flex gap-1'>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-shrink-0 w-8 h-8 p-0 hover:bg-primary/10"
            onClick={handleAddToOrder}
            title="Adicionar ao template"
          >
            <Icon name='Plus' className="w-4 h-4 text-primary" />
          </Button>
          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open edit menu"
        >
          <Icon name="Ellipsis" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => openModal('see')}>Detalhes</DropdownMenuItem>
        <DropdownMenuItem onClick={() => openModal('edit')}>Editar</DropdownMenuItem>
        <DropdownMenuItem className='text-destructive' onClick={() => openModal('delete')}>Deletar</DropdownMenuItem>
      </DropdownMenuContent>
          </DropdownMenu> 
        </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 rounded-md bg-muted">{product.category}</span>
          <span className="px-2 py-1 rounded-md bg-muted">{product.subcategory}</span>
          <span className="px-2 py-1 rounded-md bg-muted">+{product.variants}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Retalho</p>
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(product.retailPrice.min)} - {formatPrice(product.retailPrice.max)}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Atacado</p>
            <p className="text-sm font-semibold text-foreground">
              {formatPrice(product.wholesalePrice.min)} - {formatPrice(product.wholesalePrice.max)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {product.stock} no Stock - {product.location}
          </span>
          <span className="text-xs text-muted-foreground">
            Variantes ({product.variants})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductCards: React.FC<ProductCardsProps> = ({ onAddToOrder, className }) => {
  const [search, setSearch] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'az' | 'za' | 'price-max' | 'price-min'>('az');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  

  const filteredProducts = initialProducts.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = (showActive && p.isActive) || (showInactive && !p.isActive);
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  }).sort((a, b) => {
  switch (sortBy) {
    case 'az': return a.title.localeCompare(b.title);
    case 'za': return b.title.localeCompare(a.title);
    case 'price-max': return b.retailPrice.max - a.retailPrice.max;
    case 'price-min': return a.retailPrice.min - b.retailPrice.min;
    default: return 0;
  }
});

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const uniqueCategories = Array.from(new Set(initialProducts.map(p => p.category)));

  return (
    <div className="justify-start mt-10 bg-background">
      <div className="mx-auto space-y-4 max-w-7xl">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search Input */}
          <div className="flex justify-between w-full">
            <div className="flex items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Pesquisar produtos..."
              className="h-10 text-sm border rounded-md ps-10 pe-10 border-input bg-background"
            />
            <div className="absolute inset-y-0 flex items-center pointer-events-none start-0 ps-3 text-muted-foreground">
              <Icon name="Search" size={16} />
            </div>
          </div>
          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="ListFilter" className="w-4 h-4" />
                Categoria
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 space-y-2">
              <p className="text-sm text-muted-foreground">Selecionar categoria</p>
              {uniqueCategories.map(cat => (
                <div key={cat} className='flex items-center gap-2'>
                  <Checkbox checked={categoryFilter === cat} onCheckedChange={() => setCategoryFilter(categoryFilter === cat ? null : cat)} />
                  <p>{cat}</p>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Icon name="Tag" className="w-4 h-4" />
                Status
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 space-y-2">
              <p className="mb-2 text-sm text-muted-foreground">Filtrar por status</p>
              <div className='flex items-center gap-2'>
                <Checkbox checked={showActive} onCheckedChange={val => setShowActive(val as boolean)} /> <p>Ativo</p>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox checked={showInactive} onCheckedChange={val => setShowInactive(val as boolean)} /> <p>Inativo</p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Sorting Select */}
          <select
            className="h-10 px-3 text-sm border rounded-md border-input bg-background"
            value={sortBy}
            onChange={e =>
                setSortBy(e.target.value as 'az' | 'za' | 'price-max' | 'price-min')
            }
            >
            <option value="az">Ordenar em A-Z</option>
            <option value="za">Ordenar em Z-A</option>
            <option value="price-max">Max preço</option>
            <option value="price-min">Min preço</option>
            </select>
          </div>
          
          <div className='flex gap-2 rounded-md bg-muted'>
            <Button>
              <Icon name="Grid2x2" size={16}/>
            </Button>
            <Button>
              <Icon name="Table" size={16}/>
            </Button>
          </div>  
          </div>

          
        </div>
          <div className="text-sm text-muted-foreground">
            {filteredProducts.length} resultados encontrados
          </div>
          
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${className ?? ''}`}>
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToOrder={onAddToOrder} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
      <DeleteProduct/>
      <SeeProduct/>
      <EditProduct/>
    </div>
  );
};

export default ProductCards;
