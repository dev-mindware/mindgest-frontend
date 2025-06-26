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

export interface ProformaFormData {
  proformaNumber: string;
  clientName: string;
  clientNIF: string;
  clientAddress: string;
  clientPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: string;
  total: number;
  validityDays: string;
  deliveryTerms: string;
}

interface ProformaFormProps {
  initialData?: Partial<ProformaFormData>;
  onProformaChange?: (proforma: ProformaFormData) => void;
  onAddItem?: (item: OrderItem) => void;
}

const ProformaForm: React.FC<ProformaFormProps> = ({ 
  initialData, 
  onProformaChange,
  onAddItem 
}) => {
  const [proformaData, setProformaData] = useState<ProformaFormData>({
    proformaNumber: '',
    clientName: '',
    clientNIF: '',
    clientAddress: '',
    clientPhone: '',
    items: [],
    subtotal: 0,
    tax: 0,
    discount: 'Sem desconto',
    total: 0,
    validityDays: '30',
    deliveryTerms: 'Ex-works',
    ...initialData
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = proformaData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.14; // 14% tax rate for Angola
    let discountAmount = 0;
    
    switch (proformaData.discount) {
      case 'Volume 10%':
        discountAmount = subtotal * 0.1;
        break;
      case 'Cliente VIP':
        discountAmount = subtotal * 0.15;
        break;
      default:
        discountAmount = 0;
    }
    
    const total = subtotal + tax - discountAmount;

    setProformaData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }));
  }, [proformaData.items, proformaData.discount]);

  // Notify parent component of changes
  useEffect(() => {
    if (onProformaChange) {
      onProformaChange(proformaData);
    }
  }, [proformaData, onProformaChange]);

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
    
    setProformaData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }));
  };

  const removeItem = (itemId: string) => {
    setProformaData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const addItem = (newItem: OrderItem) => {
    setProformaData(prev => {
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

  const handleInputChange = (field: keyof ProformaFormData, value: string) => {
    setProformaData(prev => ({
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
          Nova Proforma
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Proforma and Client Info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="proformaNumber" className="text-sm font-medium text-foreground">
              Número Proforma
            </Label>
            <Input
              id="proformaNumber"
              placeholder="PRO-56789"
              value={proformaData.proformaNumber}
              onChange={(e) => handleInputChange('proformaNumber', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="validityDays" className="text-sm font-medium text-foreground">
              Validade (dias)
            </Label>
            <Select value={proformaData.validityDays} onValueChange={(value) => handleInputChange('validityDays', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="45">45 dias</SelectItem>
                <SelectItem value="60">60 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="clientName" className="text-sm font-medium text-foreground">
            Cliente
          </Label>
          <Input
            id="clientName"
            placeholder="Mpova Josefo"
            value={proformaData.clientName}
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
              value={proformaData.clientNIF}
              onChange={(e) => handleInputChange('clientNIF', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="clientPhone" className="text-sm font-medium text-foreground">
              Telefone
            </Label>
            <Input
              id="clientPhone"
              placeholder="Ex: +244 923 456 789"
              value={proformaData.clientPhone}
              onChange={(e) => handleInputChange('clientPhone', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="clientAddress" className="text-sm font-medium text-foreground">
            Endereço do Cliente
          </Label>
          <Input
            id="clientAddress"
            placeholder="Ex: Av. Pedro Castro"
            value={proformaData.clientAddress}
            onChange={(e) => handleInputChange('clientAddress', e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Proforma Items */}
        <div className="space-y-3">
          {proformaData.items.map((item) => (
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
                value={formatPrice(proformaData.subtotal)}
                readOnly
                className="mt-1 bg-muted/50"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Imposto</Label>
              <Input
                value={formatPrice(proformaData.tax)}
                readOnly
                className="mt-1 bg-muted/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium text-foreground">Desconto</Label>
              <Select value={proformaData.discount} onValueChange={(value) => handleInputChange('discount', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Volume 10%">Volume 10%</SelectItem>
                  <SelectItem value="Cliente VIP">Cliente VIP</SelectItem>
                  <SelectItem value="Sem desconto">Sem desconto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground">Total</Label>
              <Input
                value={formatPrice(proformaData.total)}
                readOnly
                className="mt-1 font-semibold bg-muted/50"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Termos de Entrega</Label>
            <Select value={proformaData.deliveryTerms} onValueChange={(value) => handleInputChange('deliveryTerms', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ex-works">Ex-works</SelectItem>
                <SelectItem value="FOB">FOB</SelectItem>
                <SelectItem value="CIF">CIF</SelectItem>
                <SelectItem value="Entrega Local">Entrega Local</SelectItem>
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
            Salvar Proforma
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProformaForm;
export type { OrderItem, ProformaFormData };