"use client";
import { Icon } from "@/components";
import { Badge, Button } from "@/components/ui";
import { Plan } from "@/types";
import { formatCurrency } from "@/utils";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const featuresList = [
    plan.maxUsers > 0 ? `Até ${plan.maxUsers} usuários` : "Usuários ilimitados",
    plan.maxStores > 0 ? `Até ${plan.maxStores} loja(s)` : "Lojas ilimitadas",
    plan.features.canExportSaft && "Exportação SAFT",
    plan.features.hasSimplifiedReporting && "Relatórios simplificados",
    plan.features.hasAdvancedReporting && "Relatórios avançados",
    plan.features.hasStockManagement && "Gestão de estoque",
    plan.features.hasSupplierManagement && "Gestão de fornecedores",
    plan.features.hasGestAI && "GestAI incluído",
    plan.features.hasPOS && "Gestão de POS",
  ].filter(Boolean); 

  return (
    <div
      className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
        isSelected
          ? "border-primary-500 bg-primary-50 dark:bg-primary-300/10"
          : "border-border hover:border-primary-500"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground text-lg">Plano {plan.name}</h4>
        {isSelected && (
          <Badge className="bg-primary-500 text-white">Selecionado</Badge>
        )}
      </div>

      <div className="mb-4">
        <div className="text-2xl font-bold text-primary-600">
          {formatCurrency(plan.priceMonthly)}{" "}
          <span className="text-base text-foreground">/mês</span>
        </div>
      </div>

      <ul className="space-y-2 mb-6 text-sm">
        {featuresList.slice(0, 5).map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <Icon
              name="Check"
              className="h-4 w-4 text-green-600 flex-shrink-0"
            />
            <span>{feature}</span>
          </li>
        ))}
        {featuresList.length > 6 && (
          <li className="text-xs text-foreground">
            + {featuresList.length - 6} funcionalidades
          </li>
        )}
      </ul>
    </div>
  );
}
