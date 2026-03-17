"use client";

import { useCartCheckout, CartItem } from "@/hooks";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter,
  Button,
  Icon
} from "@/components";
import { PaymentSummary } from "../counter/cart/checkout-form/payment-summary";
import { CustomerSelection } from "../counter/cart/checkout-form/customer-selection";
import { PaymentMethods } from "../counter/cart/checkout-form/payment-methods";
import { DocumentSuccessModal } from "@/components/client/documents/modals/document-success-modal";
import { ErrorMessage } from "@/utils";

interface MobileCheckoutDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  onSuccess?: () => void;
  type?: "invoice" | "proforma";
  cashSessionId: string;
}

export function MobileCheckoutDrawer({
  open,
  onOpenChange,
  cartItems,
  onSuccess,
  type = "invoice",
  cashSessionId
}: MobileCheckoutDrawerProps) {
  const {
    form: { handleSubmit },
    paymentMethod,
    setPaymentMethod,
    cashGiven,
    setCashGiven,
    change,
    totals,
    isCustomerExpanded,
    setIsCustomerExpanded,
    newCustomerPhone,
    setNewCustomerPhone,
    selectedClient,
    handleClientChange,
    handleQuickCash,
    handlePreview,
    handleFinalSubmit,
    isPreviewOpen,
    setIsPreviewOpen,
    pendingPayload,
    isPending,
  } = useCartCheckout({ cartItems, type, onSuccess: () => {
    onSuccess?.();
    onOpenChange(false);
  }, cashSessionId });

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Finalizar Transação</DrawerTitle>
          </DrawerHeader>
          
          <div className="px-4 overflow-y-auto pb-4 space-y-6">
            <PaymentSummary
                subtotal={totals.subtotal}
                taxAmount={totals.taxAmount}
                discountAmount={totals.discountAmount}
                total={totals.total}
                change={change}
                paymentMethod={paymentMethod}
            />

            <CustomerSelection
                isExpanded={isCustomerExpanded}
                onToggleExpand={() => setIsCustomerExpanded(!isCustomerExpanded)}
                selectedClient={selectedClient}
                onClientChange={handleClientChange}
                newCustomerPhone={newCustomerPhone}
                onPhoneChange={setNewCustomerPhone}
            />

            <PaymentMethods
                paymentMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
                cashGiven={cashGiven}
                onCashChange={setCashGiven}
                onQuickCash={handleQuickCash}
                change={change}
            />
          </div>

          <DrawerFooter className="pt-0">
            <Button
                className="w-full h-12 text-base font-bold"
                onClick={handleSubmit((data) => handlePreview(data, true), (errors) => {
                    console.error("Form Validation Errors:", errors);
                    ErrorMessage("Verifique os campos obrigatórios");
                })}
                disabled={isPending}
            >
                {isPending ? "Processando..." : "Confirmar Pagamento"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <DocumentSuccessModal />
    </>
  );
}
