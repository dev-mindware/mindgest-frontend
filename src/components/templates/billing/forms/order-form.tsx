import React, { useState, useEffect } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderFormData {
  orderNumber: string;
  clientName: string;
  clientNIF: string;
  clientAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: string;
  total: number;
  paymentMethod: string;
  status: string;
}

interface OrderFormProps {
  initialData?: Partial<OrderFormData>;
  onOrderChange?: (order: OrderFormData) => void;
  onAddItem?: (item: OrderItem) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ 
  initialData, 
  onOrderChange,
  onAddItem 
}) => {
  const [orderData, setOrderData] = useState<OrderFormData>({
    orderNumber: '',
    clientName: '',
    clientNIF: '',
    clientAddress: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 'Black Friday',
    total: 0,
    paymentMethod: 'Cartão Multicaixa',
    status: 'Parcial',
    ...initialData
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.14; // 14% tax rate for Angola
    const discountAmount = orderData.discount === 'Black Friday' ? subtotal * 0.1 : 0; // 10% discount
    const total = subtotal + tax - discountAmount;

    setOrderData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [orderData.items, orderData.discount]);

  // Notify parent component of changes
  useEffect(() => {
    if (onOrderChange) {
      onOrderChange(orderData);
    }
  }, [orderData, onOrderChange]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setOrderData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const removeItem = (itemId: string) => {
    setOrderData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const addItem = (newItem: OrderItem) => {
    setOrderData(prev => {
      const existingItem = prev.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // If item already exists, increase quantity
        return {
          ...prev,
          items: prev.items.map(item => 
            item.id === newItem.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        // Add new item
        return {
          ...prev,
          items: [...prev.items, { ...newItem, quantity: 1 }]
        };
      }
    });

    if (onAddItem) {
      onAddItem(newItem);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving order:', orderData);
    // Here you would typically send the data to your backend
  };

  const handleCancel = () => {
    console.log('Canceling order');
    // Reset form or navigate away
  };

  return (
    <Card className="w-full max-w-md mx-auto border bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Novo Pedido
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order and Client Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="orderNumber" className="text-sm font-medium text-foreground">
              Número
            </Label>
            <Input
              id="orderNumber"
              placeholder="404-56789"
              value={orderData.orderNumber}
              onChange={(e) => handleInputChange('orderNumber', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientName" className="text-sm font-medium text-foreground">
              Cliente
            </Label>
            <Input
              id="clientName"
              placeholder="Mpova Josefo"
              value={orderData.clientName}
              onChange={(e) => handleInputChange('clientName', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="clientNIF" className="text-sm font-medium text-foreground">
              NIF do Cliente
            </Label>
            <Input
              id="clientNIF"
              placeholder="Ex: 5693647984"
              value={orderData.clientNIF}
              onChange={(e) => handleInputChange('clientNIF', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientAddress" className="text-sm font-medium text-foreground">
              Endereço do Cliente
            </Label>
            <Input
              id="clientAddress"
              placeholder="Ex: Av. Pedro Castro"
              value={orderData.clientAddress}
              onChange={(e) => handleInputChange('clientAddress', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-3">
          {orderData.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10">
                <div className="w-8 h-6 rounded bg-primary/20"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate text-foreground">
                  {item.title}
                </h4>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(item.price)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="w-8 text-sm font-medium text-center">
                  {item.quantity}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-2 space-y-3 border-t border-border">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Subtotal</Label>
              <Input
                value={formatPrice(orderData.subtotal)}
                readOnly
                className="mt-1 bg-muted/50"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Imposto</Label>
              <Input
                value={formatPrice(orderData.tax)}
                readOnly
                className="mt-1 bg-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Desconto</Label>
              <Select value={orderData.discount} onValueChange={(value) => handleInputChange('discount', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Black Friday">Black Friday</SelectItem>
                  <SelectItem value="Desconto 5%">Desconto 5%</SelectItem>
                  <SelectItem value="Sem desconto">Sem desconto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Total</Label>
              <Input
                value={formatPrice(orderData.total)}
                readOnly
                className="mt-1 font-semibold bg-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Método de Pagamento</Label>
              <Select value={orderData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cartão Multicaixa">Cartão Multicaixa</SelectItem>
                  <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="Transferência">Transferência</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Estado</Label>
              <Select value={orderData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parcial">Parcial</SelectItem>
                  <SelectItem value="Completo">Completo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleSave}
          >
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
export type { OrderItem, OrderFormData };