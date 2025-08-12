export type Plan = "BASE" | "TSUNAMI" | "SMART PRO"

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
  "SMART PRO": [
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
  "SMART PRO": 3
};

export function hasPlanAccess(userPlan: Plan, requiredPlan: Plan): boolean {
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
}
/* export const featuresByPlan: Record<Plan, string[]> = {
  "BASE": ["billing", "services"],
  "TSUNAMI": ["billing", "services", "pos", "inventory"],
  "SMART PRO": ["billing", "services", "pos", "inventory", "reports"]
};


export function getFeaturesForPlan(plan: Plan): string[] {
  return featuresByPlan[plan] || [];
}

export function canAccess(plan: Plan, feature: string): boolean {
  return getFeaturesForPlan(plan).includes(feature);
}
 */