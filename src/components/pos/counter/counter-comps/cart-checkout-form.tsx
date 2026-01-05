"use client";

import { useState, useEffect } from "react";
import { Icon, Input, Button, Tooltip, TooltipContent, TooltipTrigger } from "@/components";
import { cn } from "@/lib/utils";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { useCreateInvoiceReceipt, useCreateProforma } from "@/hooks";
import { useAuthStore } from "@/stores";
import { ErrorMessage, formatCurrency, parseCurrency } from "@/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InvoiceReceiptFormData, InvoiceReceiptSchema } from "@/schemas";
import { useInvoiceTotals, useClientSelection } from "@/hooks/invoice";

interface CartCheckoutFormProps {
    cartItems: any[];
    onSuccess?: () => void;
    type?: "invoice" | "proforma";
}

type PaymentMethod = "Credit Card" | "Cash";

export function CartCheckoutForm({ cartItems, onSuccess, type = "invoice" }: CartCheckoutFormProps) {
    const { user } = useAuthStore();
    const { mutateAsync: createInvoiceReceipt, isPending: isPendingInvoice } = useCreateInvoiceReceipt();
    const { mutateAsync: createProforma, isPending: isPendingProforma } = useCreateProforma();

    const isPending = isPendingInvoice || isPendingProforma;

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Credit Card");
    const [cashGiven, setCashGiven] = useState<string>("");
    const [change, setChange] = useState<number>(0);

    // Customer states handled by hook
    const [isCustomerExpanded, setIsCustomerExpanded] = useState(false);
    const [newCustomerPhone, setNewCustomerPhone] = useState("");

    const form = useForm<InvoiceReceiptFormData>({
        resolver: zodResolver(InvoiceReceiptSchema),
        defaultValues: {
            issueDate: new Date().toISOString().split("T")[0],
            items: [],
            client: {
                name: "",
                taxNumber: "",
                address: "",
                phone: "",
            },
            globalTax: 0,
            globalDiscount: 0,
            storeId: user?.store?.id || "",
        },
    });

    const { handleSubmit, setValue, watch, reset } = form;
    const { handleClientChange, selectedClient, setSelectedClient } = useClientSelection(setValue);

    const watchedItems = watch("items");
    const totals = useInvoiceTotals({
        items: watchedItems || [],
        tax: watch("globalTax") || 0,
        retention: 0,
        discount: watch("globalDiscount") || 0,
    });

    // Synchronize cartItems with form items
    useEffect(() => {
        const items = cartItems.map(item => ({
            id: item.id,
            description: item.name,
            type: "PRODUCT" as const,
            quantity: item.qty,
            unitPrice: item.price || 0,
            tax: 0,
            discount: 0,
            total: (item.price || 0) * item.qty,
            isFromAPI: true
        }));
        setValue("items", items as any, { shouldValidate: true });
    }, [cartItems, setValue]);

    // Synchronize payment method
    useEffect(() => {
        setValue("paymentMethod", paymentMethod === "Cash" ? "CASH" : "CARD");
    }, [paymentMethod, setValue]);

    useEffect(() => {
        if (paymentMethod === "Cash") {
            const cash = parseCurrency(cashGiven) || 0;
            setChange(cash >= totals.total ? cash - totals.total : 0);
        } else {
            setChange(0);
        }
    }, [cashGiven, totals.total, paymentMethod]);

    const handleQuickCash = (amount: number) => {
        setCashGiven(formatCurrency(amount));
    };

    const onSubmit = async (data: InvoiceReceiptFormData) => {
        try {
            if (cartItems.length === 0) {
                ErrorMessage("O carrinho está vazio!");
                return;
            }

            // Simplified items: only id and quantity as per user request
            const simplifiedItems = data.items.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            // Extract values to exclude global fields
            const {
                globalTax: _gt,
                globalDiscount: _gd,
                globalRetention: _gr,
                items: _items,
                ...rest
            } = data;

            const payload: any = {
                ...rest,
                items: simplifiedItems,
                client: {
                    name: data.client.name,
                    phone: data.client.phone,
                },
                total: totals.total,
                taxAmount: totals.taxAmount,
                discountAmount: totals.discountAmount,
                subtotal: totals.subtotal,
                paymentMethod: paymentMethod === "Cash" ? "CASH" : "CARD",
                ...(user?.store?.id && { storeId: user.store.id })
            };

            // Custom adjustments for client from POS UI
            if (!selectedClient && newCustomerPhone) {
                payload.client.name = "Consumidor Final";
                payload.client.phone = newCustomerPhone;
            }

            if (selectedClient && !selectedClient.__isNew__) {
                payload.clientId = selectedClient.value;
            }

            if (type === "invoice") {
                if (paymentMethod === "Cash") {
                    payload.amountReceived = parseCurrency(cashGiven) || totals.total;
                    payload.change = change;
                }
                await createInvoiceReceipt(payload);
            } else {
                // Proforma specific adjustments
                payload.proformaExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]; // 7 days expiration
                await createProforma(payload);
            }

            setCashGiven("");
            setSelectedClient(null);
            setNewCustomerPhone("");
            reset();
            onSuccess?.();
        } catch (error: any) {
            console.error("Payment error:", error);
            ErrorMessage(`Erro ao processar ${type === "invoice" ? "o pagamento" : "a proforma"}.`);
        }
    };

    return (
        <div className="mt-4 p-4 border border-dashed rounded-md bg-muted/30">
            <h3 className="font-bold mb-3">Resumo de Pagamento</h3>

            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatCurrency(totals.subtotal)}</span>
                </div>
                {/* Tax removed */}
                {change > 0 && paymentMethod === "Cash" && (
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                        <span>Troco</span>
                        <span>{formatCurrency(change)}</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center text-base font-bold mb-6 border-t border-dashed pt-2">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
            </div>

            {/* Optional Customer Section */}
            <div className="mb-6 space-y-3">
                <button
                    onClick={() => setIsCustomerExpanded(!isCustomerExpanded)}
                    className="flex items-center justify-between w-full py-2 group hover:text-primary transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">Cliente (Opcional)</span>
                    </div>
                    {isCustomerExpanded ? (
                        <Icon name="ChevronDown" size={16} className="text-muted-foreground group-hover:text-primary" />
                    ) : (
                        <Icon name="ChevronRight" size={16} className="text-muted-foreground group-hover:text-primary" />
                    )}
                </button>

                {isCustomerExpanded && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buscar Cliente</label>
                            <AsyncCreatableSelectField
                                endpoint="/clients"
                                label=""
                                placeholder="Procurar cliente..."
                                value={selectedClient}
                                onChange={handleClientChange}
                                displayFields={["name", "phone"]}
                                minChars={2}
                                formatCreateLabel={(val) => `➕ Criar "${val}"`}
                            />
                        </div>

                        {/* If no selected customer or it's a new one, show phone field */}
                        {(!selectedClient || selectedClient.__isNew__) && (
                            <div className="space-y-2 pt-2 border-t border-dashed">
                                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Telefone do Cliente (Novo)</label>
                                <Input
                                    startIcon="Phone"
                                    type="text"
                                    inputMode="numeric"
                                    data-layout="numeric"
                                    placeholder="Digite o número de telefone..."
                                    value={newCustomerPhone}
                                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                                    className="bg-muted/30"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Payment Methods */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 flex p-1 gap-2 bg-muted/50 rounded-md">
                        {(["Credit Card", "Cash"] as PaymentMethod[]).map(method => (
                            <button
                                key={method}
                                onClick={() => setPaymentMethod(method)}
                                className={cn(
                                    "flex-1 flex flex-col items-center gap-2 py-2 rounded-md text-xs font-medium transition-all",
                                    paymentMethod === method ? "bg-primary/15 shadow text-primary" : "text-muted-foreground hover:bg-accent"
                                )}
                            >
                                {method === "Credit Card" ? (
                                    <Icon name="CreditCard" size={16} />
                                ) : (
                                    <Icon name="Banknote" size={16} />
                                )}
                                {method === "Cash" ? "Dinheiro" : "Multicaixa"}
                            </button>
                        ))}
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="h-full aspect-square rounded-md bg-muted flex items-center justify-center cursor-help hover:bg-muted/80 transition-colors">
                                <Icon name="Info" size={16} className="text-muted-foreground" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Contacte os desenvolvedores para adicionar diferentes métodos de pagamento.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Cash Logic */}
                {paymentMethod === "Cash" && (
                    <div className="space-y-3 bg-muted/30 p-3 rounded-xl border border-dashed mb-3">
                        <div className="grid grid-cols-4 gap-2">
                            {[200, 500, 1000, 5000].map(amt => (
                                <Button
                                    key={amt}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8 px-0"
                                    onClick={() => handleQuickCash(amt)}
                                >
                                    {amt}kz
                                </Button>
                            ))}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Valor Entregue</label>
                            <Input
                                startIcon="Coins"
                                value={cashGiven}
                                onChange={(e) => setCashGiven(formatCurrency(e.target.value))}
                                placeholder="0,00 Kz"
                                type="text"
                                inputMode="numeric"
                                data-layout="numeric"
                                autoFocus
                            />
                        </div>
                        <div className={cn("flex justify-between bg-muted text-sm font-bold p-2 rounded-md", change >= 0 ? "text-green-700" : "text-red-700")}>
                            <span>Troco</span>
                            <span>{formatCurrency(change)}</span>
                        </div>
                    </div>
                )}
            </div>

            <Button
                className="w-full"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
            >
                {isPending ? "Processando..." : "Confirmar Pagamento"}
            </Button>
        </div>
    );
}