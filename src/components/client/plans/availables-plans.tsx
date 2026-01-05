import {
  Icon,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components";
import { useCurrentPlanStore } from "@/stores";
import { Plan } from "@/types";
import { formatCurrency } from "@/utils";

interface AvailablePlansProps {
  plans: Plan[];
  currentPlanId: string | undefined;
  hasActiveSubscription: boolean;
}

export function AvailablePlans({
  plans,
  currentPlanId,
  hasActiveSubscription,
}: AvailablePlansProps) {
  const { setCurrentPlanSelected } = useCurrentPlanStore();

  function onHandlerChoosePlan(plan: Plan) {
    setCurrentPlanSelected(plan);
    window.open("/checkout", "_blank");
  }

  const featureLabels: Record<string, string> = {
    hasPOS: "Ponto de Venda (POS)",
    hasGestAI: "Gestão Inteligente (IA)",
    canExportSaft: "Exportação SAF-T",
    hasStockManagement: "Gestão de Estoque",
    hasAdvancedReporting: "Relatórios Avançados",
    hasSupplierManagement: "Gestão de Fornecedores",
    hasSimplifiedReporting: "Relatórios Simplificados",
    hasAppearanceSettings: "Personalização da Aparência",
    hasMultiplePrintFormats: "Múltiplos formatos de impressão",
    hasFullReports: "Relatórios completos",
    hasSmartStockAnalysis: "Análise de Estoque Inteligente",
    hasPosManagement: "Gestão de POS",
  };

  const activePlanId = currentPlanId || plans[1]?.id;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Planos Disponíveis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const isActive = activePlanId === plan.id;
          const isPopular = index === 1;
          const buttonIsDisabled = isActive || hasActiveSubscription;

          const features: string[] = [
            `Até ${
              plan.maxUsers === -1
                ? "usuários ilimitados"
                : plan.maxUsers + " usuários"
            }`,
            `Até ${
              plan.maxStores === -1
                ? "lojas ilimitadas"
                : plan.maxStores + " loja(s)"
            }`,
            ...Object.entries(plan.features)
              .filter(([_, enabled]) => enabled)
              .map(([key]) => featureLabels[key] || key),
          ];

          return (
            <Card
              key={plan.id}
              className={`relative rounded-lg shadow-md ${
                isActive
                  ? "border-2 border-primary-500 bg-primary-300/10 shadow-xl"
                  : "border border-border bg-card"
              }`}
            >
              {isActive && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary-500/10 text-foreground">
                    <Icon
                      name={currentPlanId ? "Crown" : "Star"}
                      className="h-3 w-3 mr-1"
                    />
                    {currentPlanId ? "Atual" : "Popular"}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-2xl font-bold text-primary-600">
                  {formatCurrency(Number(plan.priceMonthly))}
                  <span className="text-base text-foreground"> /mês</span>
                </div>
                <p className="text-sm text-foreground">
                  {plan.isPublic ? "Disponível publicamente" : "Plano privado"}
                </p>
              </CardHeader>

              <CardContent className="grow">
                <ul className="space-y-2 mb-6">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Icon
                        name="Check"
                        className="h-4 w-4 text-green-600 flex-shrink-0"
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => onHandlerChoosePlan(plan)}
                  className={`w-full ${buttonIsDisabled && "bg-muted"}`}
                  variant={isActive ? "outline" : "default"}
                  disabled={buttonIsDisabled}
                >
                  {isActive
                    ? currentPlanId
                      ? "Plano Atual"
                      : "Plano Popular"
                    : "Escolher Plano"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
