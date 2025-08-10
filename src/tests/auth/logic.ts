// Features permitidas por plano
export const planFeatures = {
  BASE: ["simpleReports", "basicBilling", "clientCRUD"],
  TSUNAMI: [
    "simpleReports", "advancedReports", "basicBilling", 
    "clientCRUD", "stockManagement", "posWeb"
  ],
  "SMART PRO": [
    "simpleReports", "advancedReports", "fullReports", 
    "basicBilling", "clientCRUD", "stockManagement", 
    "posWeb", "suppliers", "aiAnalysis"
  ]
} as const;

// Features permitidas por role
export const roleFeatures = {
  OWNER: ["all"], // dono tem tudo do plano
  MANAGER: ["simpleReports", "advancedReports", "stockManagement"],
  CASHIER: ["basicBilling", "posWeb"],
  CLIENTE: [], // cliente final não acessa backoffice
  AFILIADO: ["affiliateReports", "affiliateSales"]
} as const;
