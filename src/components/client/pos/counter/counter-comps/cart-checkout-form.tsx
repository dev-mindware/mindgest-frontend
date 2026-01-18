"use client";

import { useState, useEffect } from "react";
import {
  Icon,
  Input,
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components";
import { cn } from "@/lib/utils";
import { AsyncCreatableSelectField } from "@/components/common/input-fetch/async-select";
import { useCreateInvoiceReceipt, useCreateProforma } from "@/hooks";
import { useAuthStore } from "@/stores";
import { ErrorMessage, formatCurrency, parseCurrency } from "@/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PosSalesFormData, PosSalesSchema } from "@/schemas";
import { useInvoiceTotals, useClientSelection } from "@/hooks/invoice";

interface CartCheckoutFormProps {
  cartItems: any[];
  onSuccess?: () => void;
  type?: "invoice" | "proforma";
}

type PaymentMethod = "Credit Card" | "Cash";

export function CartCheckoutForm({
  cartItems,
  onSuccess,
  type = "invoice",
}: CartCheckoutFormProps) {
  const { user } = useAuthStore();
  const { mutateAsync: createInvoiceReceipt, isPending: isPendingInvoice } =
    useCreateInvoiceReceipt();
  const { mutateAsync: createProforma, isPending: isPendingProforma } =
    useCreateProforma();

  const isPending = isPendingInvoice || isPendingProforma;

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("Credit Card");
  const [cashGiven, setCashGiven] = useState<string>("");
  const [change, setChange] = useState<number>(0);

  // Customer states handled by hook
  const [isCustomerExpanded, setIsCustomerExpanded] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const form = useForm<PosSalesFormData>({
    resolver: zodResolver(PosSalesSchema),
    defaultValues: {
      issueDate: new Date().toISOString().split("T")[0],
      items: [],
      client: undefined,
      storeId: user?.store?.id || "",
      total: 0,
      subtotal: 0,
      taxAmount: 0,
      discountAmount: 0,
      receivedValue: 0,
      change: 0,
      paymentMethod: "CARD",
    },
  });

  const { handleSubmit, setValue, watch, reset } = form;
  const { handleClientChange, selectedClient, setSelectedClient } =
    useClientSelection(setValue);

  // Note: We watch "items" to calculate totals, but for the form validation against PosSalesSchema
  // (which expects {id, quantity}), we need to be careful. usage of 'any' in setValue helps bypass type check for the extra fields needed for UI calculation.
  const watchedItems = watch("items") as any[];
  const totals = useInvoiceTotals({
    items: watchedItems || [],
    tax: 0, // Global tax removed/set to 0
    retention: 0,
    discount: 0, // Global discount removed/set to 0
  });

  // Synchronize cartItems with form items
  useEffect(() => {
    const items = cartItems.map((item) => ({
      id: item.id,
      description: item.name,
      type: "PRODUCT" as const,
      quantity: item.qty,
      unitPrice: item.price || 0,
      tax: 0,
      discount: 0,
      total: (item.price || 0) * item.qty,
      isFromAPI: true,
    }));
    // We pass the full object for UI calculations, even though Schema only strictly requires id and quantity.
    setValue("items", items as any, { shouldValidate: true });
  }, [cartItems, setValue]);

  // Synchronize totals to form state
  useEffect(() => {
    setValue("total", totals.total);
    setValue("subtotal", totals.subtotal);
    setValue("taxAmount", totals.taxAmount);
    setValue("discountAmount", totals.discountAmount);
  }, [totals, setValue]);

  // Synchronize payment method
  useEffect(() => {
    setValue("paymentMethod", paymentMethod === "Cash" ? "CASH" : "CARD");
  }, [paymentMethod, setValue]);

  // Handle Cash & Change
  useEffect(() => {
    if (paymentMethod === "Cash") {
      const cash = parseCurrency(cashGiven) || 0;
      const changeVal = cash >= totals.total ? cash - totals.total : 0;
      setChange(changeVal);
      setValue("receivedValue", cash);
      setValue("change", changeVal);
    } else {
      setChange(0);
      setValue("receivedValue", totals.total); // For card, received == total
      setValue("change", 0);
    }
  }, [cashGiven, totals.total, paymentMethod, setValue]);

  const handleQuickCash = (amount: number) => {
    setCashGiven(formatCurrency(amount));
  };

  // console.log("ERROS: ", form.formState.errors);

  const onSubmit = async (data: PosSalesFormData) => {
    try {
      if (cartItems.length === 0) {
        ErrorMessage("O carrinho está vazio!");
        return;
      }

      // Prepare payload
      // data.items will already be stripped to schema shape (id, quantity) by zodResolver if it works strictly,
      // but if we passed extra data, it might still safely contain just what we need or we can map it to be sure.
      const simplifiedItems = data.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const payload: PosSalesFormData = {
        ...data,
        items: simplifiedItems,
        // Ensure client is structure correctly if manually set via phone
        client: data.client,
      };

      // Custom adjustments for client from POS UI
      if (!selectedClient && newCustomerPhone) {
        payload.client = {
          name: "Consumidor Final",
          phone: newCustomerPhone,
          email: "consumidor@final.com", // Dummy email to satisfy loose requirements if any
          address: "Loja",
          taxNumber: "999999999", // Generic
        };
      }

      // If we have a selected client that is NEW (created via AsyncCreatableSelect)
      // The hook useClientSelection/AsyncSelect usually handles passing the object to setValue('client', ...)
      // We just need to ensure it matches the schema.

      if (type === "invoice") {
        await createInvoiceReceipt(payload as any);
      } else {
        // For proforma, we might need a different payload structure or endpoint
        // The previous code had specific fields for proforma.
        // Assuming createProforma can accept PosSalesFormData or similar.
        // We'll keep the proforma logic as close to previous as possible but using new data.
        const proformaPayload = {
          ...payload,
          proformaExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        };
        await createProforma(proformaPayload as any);
      }

      setCashGiven("");
      setSelectedClient(null);
      setNewCustomerPhone("");
      reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Payment error:", error);
      ErrorMessage(
        `Erro ao processar ${
          type === "invoice" ? "o pagamento" : "a proforma"
        }.`,
      );
    }
  };

  return (
    <div className="mt-4 p-4 border border-dashed rounded-md bg-muted/30">
      <h3 className="font-bold mb-3">Resumo de Pagamento</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-medium text-foreground">
            {formatCurrency(totals.subtotal)}
          </span>
        </div>
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
            <Icon
              name="ChevronDown"
              size={16}
              className="text-muted-foreground group-hover:text-primary"
            />
          ) : (
            <Icon
              name="ChevronRight"
              size={16}
              className="text-muted-foreground group-hover:text-primary"
            />
          )}
        </button>

        {isCustomerExpanded && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Buscar Cliente
              </label>
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
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Telefone do Cliente (Novo)
                </label>
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
            {(["Credit Card", "Cash"] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-2 py-2 rounded-md text-xs font-medium transition-all",
                  paymentMethod === method
                    ? "bg-primary/15 shadow text-primary"
                    : "text-muted-foreground hover:bg-accent",
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
              <p>
                Contacte os desenvolvedores para adicionar diferentes métodos de
                pagamento.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Cash Logic */}
        {paymentMethod === "Cash" && (
          <div className="space-y-3 bg-muted/30 p-3 rounded-xl border border-dashed mb-3">
            <div className="grid grid-cols-4 gap-2">
              {[200, 500, 1000, 5000].map((amt) => (
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
            <div
              className={cn(
                "flex justify-between bg-muted text-sm font-bold p-2 rounded-md",
                change >= 0 ? "text-green-700" : "text-red-700",
              )}
            >
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
