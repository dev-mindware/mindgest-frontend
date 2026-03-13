import {
  HeroSubscription,
  SubscriptionPageContent,
} from "@/components";

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8 mb-auto w-full">
      <div className="max-w-6xl mx-auto">
        <HeroSubscription 
          title="Escolha o Plano Ideal"
          description="A sua assinatura expirou ou precisa de ser atualizada. Seleccione o plano que melhor se adequa ao momento atual da sua empresa e retome o acesso a todas as funcionalidades do sistema instantaneamente." 
        />
        <div className="mt-8">
          <SubscriptionPageContent />
        </div>
      </div>
    </div>
  );
}
