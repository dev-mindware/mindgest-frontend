import { Plan } from "@/types";

export const featuresByPlan: Record<Plan, string[]> = {
  "BASE": [
    'dashboard_access',
    'billing_documents',
    'client_management',
    'basic_sales_reports'
  ],
  "TSUNAMI": [
    'dashboard_access',
    'billing_documents',
    'client_management',
    'basic_sales_reports',
    'inventory_management',
    'web_pos',
    'filtered_sales_reports',
    'print_settings'
  ],
  "SMART_PRO": [
    'dashboard_access',
    'billing_documents',
    'client_management',
    'basic_sales_reports',
    'inventory_management',
    'web_pos',
    'filtered_sales_reports',
    'print_settings',
    'admin_dashboard',
    'supplier_management',
    'ai_management',
    'advanced_reports',
    'pos_management'
  ]
};

export const planHierarchy: Record<Plan, number> = {
  "BASE": 1,
  "TSUNAMI": 2,
  "SMART_PRO": 3
};

export function hasPlanAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}
