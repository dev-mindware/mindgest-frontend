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

export interface ReceiptFormData {
  receiptNumber: string;
  clientName: string;
  clientNIF: string;
  clientAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: string;
  total: number;
  paymentMethod: string;
  receiptDate: string;
}

interface ReceiptFormProps {
  initialData?: Partial<ReceiptFormData>;
  onReceiptChange?: (receipt: ReceiptFormData) => void;
  onAddItem?: (item: OrderItem) => void;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({ 
  initialData, 
  onReceiptChange,
  onAddItem 
}) => {
  const [receiptData, setReceiptData] = useState<ReceiptFormData>({
    receiptNumber: '',
    clientName: '',
    clientNIF: '',
    clientAddress: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 'Sem desconto',
    total: 0,
    paymentMethod: 'Dinheiro',
    receiptDate: new Date().toISOString().split('T')[0],
    ...initialData
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = receiptData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.14; // 14% tax rate for Angola
    const discountAmount = receiptData.discount === 'Desconto 5%' ? subtotal * 0.05 : 0;
    const total = subtotal + tax - discountAmount;

    setReceiptData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [receiptData.items, receiptData.discount]);

  // Notify parent component of changes
  useEffect(() => {
    if (onReceiptChange) {
      onReceiptChange(receiptData);
    }
  }, [receiptData, onReceiptChange]);

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
    
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const removeItem = (itemId: string) => {
    setReceiptData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const addItem = (newItem: OrderItem) => {
    setReceiptData(prev => {
      const existingItem = prev.items.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(item => 
            item.id === newItem.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
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

  const handleInputChange = (field: keyof ReceiptFormData, value: string) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Expose addItem method to parent
  React.useImperativeHandle(React.forwardRef((props, ref) => ref), () => ({
    addItem
  }));

  return (
    <Card className="w-full max-w-md mx-auto border bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Novo Recibo
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Receipt and Client Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="receiptNumber" className="text-sm font-medium text-foreground">
              Número
            </Label>
            <Input
              id="receiptNumber"
              placeholder="REC-56789"
              value={receiptData.receiptNumber}
              onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="receiptDate" className="text-sm font-medium text-foreground">
              Data
            </Label>
            <Input
              id="receiptDate"
              type="date"
              value={receiptData.receiptDate}
              onChange={(e) => handleInputChange('receiptDate', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="clientName" className="text-sm font-medium text-foreground">
            Cliente
          </Label>
          <Input
            id="clientName"
            placeholder="Mpova Josefo"
            value={receiptData.clientName}
            onChange={(e) => handleInputChange('clientName', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="clientNIF" className="text-sm font-medium text-foreground">
              NIF do Cliente
            </Label>
            <Input
              id="clientNIF"
              placeholder="Ex: 5693647984"
              value={receiptData.clientNIF}
              onChange={(e) => handleInputChange('clientNIF', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientAddress" className="text-sm font-medium text-foreground">
              Endereço
            </Label>
            <Input
              id="clientAddress"
              placeholder="Ex: Av. Pedro Castro"
              value={receiptData.clientAddress}
              onChange={(e) => handleInputChange('clientAddress', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        {/* Receipt Items */}
        <div className="space-y-3">
          {receiptData.items.map((item) => (
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
                value={formatPrice(receiptData.subtotal)}
                readOnly
                className="mt-1 bg-muted/50"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Imposto</Label>
              <Input
                value={formatPrice(receiptData.tax)}
                readOnly
                className="mt-1 bg-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Desconto</Label>
              <Select value={receiptData.discount} onValueChange={(value) => handleInputChange('discount', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Desconto 5%">Desconto 5%</SelectItem>
                  <SelectItem value="Sem desconto">Sem desconto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Total</Label>
              <Input
                value={formatPrice(receiptData.total)}
                readOnly
                className="mt-1 font-semibold bg-muted/50"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Método de Pagamento</Label>
            <Select value={receiptData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Cartão Multicaixa">Cartão Multicaixa</SelectItem>
                <SelectItem value="Transferência">Transferência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" className="flex-1">
            Cancelar
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90">
            Salvar Recibo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceiptForm;
export type { OrderItem, ReceiptFormData };