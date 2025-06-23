"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, X, Percent, Minus } from "lucide-react";
import { useState } from "react";

const mockUsers = [
  {
    id: 1,
    name: "Ceara Coveney",
    company: "Mindware - Comércio e Serviços",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=32&h=32&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "João Silva",
    company: "Tech Solutions Lda",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Maria Santos",
    company: "Inovação Digital",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "Pedro Costa",
    company: "Consultoria Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
  }
];

const planPrices = {
  plus: 2500,
  premium: 4350,
  vip: 6800,
  enterprise: 12500,
  basico: 1200,
  starter: 1800,
  professional: 8900
};

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: unknown) => void;
}

export function AddSubscriptionModal({ isOpen, onClose, onSubmit }: AddSubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [discount, setDiscount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAdd = (userId: number) => {
    setSelectedUsers(prev => new Set([...prev, userId]));
  };

  const handleUserRemove = (userId: number) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  const calculatePrice = () => {
    if (!selectedPlan) return 0;
    const basePrice = planPrices[selectedPlan as keyof typeof planPrices];
    const discountValue = parseFloat(discount) || 0;
    const finalPrice = basePrice - (basePrice * discountValue / 100);
    return finalPrice;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-AO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) + ' Kz';
  };

  const handleSubmit = () => {
    const selectedUsersList = mockUsers.filter(user => selectedUsers.has(user.id));
    const formData = {
      plan: selectedPlan,
      discount: discount,
      users: selectedUsersList,
      price: formatPrice(calculatePrice()),
      totalUsers: selectedUsers.size
    };
    
    if (onSubmit) {
      onSubmit(formData);
    }
    
    // Reset form
    setSelectedPlan("");
    setDiscount("");
    setSearchTerm("");
    setSelectedUsers(new Set());
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setSelectedPlan("");
    setDiscount("");
    setSearchTerm("");
    setSelectedUsers(new Set());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative w-full h-full max-w-md ml-auto duration-300 shadow-xl bg-background animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Adicionar Subscrição</h2>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Selecionar Plano</Label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico - {formatPrice(planPrices.basico)}</SelectItem>
                    <SelectItem value="starter">Starter - {formatPrice(planPrices.starter)}</SelectItem>
                    <SelectItem value="plus">Plus - {formatPrice(planPrices.plus)}</SelectItem>
                    <SelectItem value="premium">Premium - {formatPrice(planPrices.premium)}</SelectItem>
                    <SelectItem value="vip">VIP - {formatPrice(planPrices.vip)}</SelectItem>
                    <SelectItem value="professional">Professional - {formatPrice(planPrices.professional)}</SelectItem>
                    <SelectItem value="enterprise">Enterprise - {formatPrice(planPrices.enterprise)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Desconto</Label>
                <div className="relative">
                  <Input
                    id="discount"
                    placeholder="Ex: 15"
                    value={discount}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      if (parseFloat(value) <= 100 || value === '') {
                        setDiscount(value);
                      }
                    }}
                    className="pr-10"
                    type="text"
                  />
                  <Percent className="absolute w-4 h-4 -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Clientes Selecionados</p>
                    <p className="font-medium text-primary">
                      {selectedUsers.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Plano</p>
                    <p className="font-medium text-primary">
                      {selectedPlan ? selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1) : "Nenhum"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Desconto</p>
                    <p className="font-medium text-primary">
                      {discount ? `${discount}%` : "0%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preço Base</p>
                    <p className="font-medium text-primary">
                      {selectedPlan ? formatPrice(planPrices[selectedPlan as keyof typeof planPrices]) : "0 Kz"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Preço Final (por cliente)</p>
                  <p className="text-lg font-bold text-primary">{formatPrice(calculatePrice())}</p>
                </div>

                {selectedUsers.size > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Total Geral</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatPrice(calculatePrice() * selectedUsers.size)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar clientes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 overflow-y-auto max-h-60">
                {filteredUsers.map((user) => {
                  const isSelected = selectedUsers.has(user.id);
                  return (
                    <div
                      key={user.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary bg-accent' 
                          : 'border-border hover:border-primary/50 hover:bg-purple-50/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 text-sm font-medium text-white rounded-full ${
                          isSelected 
                            ? 'bg-gradient-to-br from-purple-500 to-purple-700' 
                            : 'bg-gradient-to-br from-purple-400 to-primary'
                        }`}>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.company}</p>
                        </div>
                      </div>
                        <div className="flex items-center space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUserRemove(user.id)}
                            disabled={!isSelected}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUserAdd(user.id)}
                            disabled={isSelected}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                        </div>

                    </div>
                  );
                })}
                
                {filteredUsers.length === 0 && searchTerm && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Nenhum cliente encontrado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t">
            <div className="flex space-x-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-purple-700"
                disabled={selectedUsers.size === 0 || !selectedPlan}
              >
                Adicionar ({selectedUsers.size})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
