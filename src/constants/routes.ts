import { PlanType, Role } from "@/types";

export const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/client/checkout",
  "/unauthorized",
  "/not-found",
];

export const PRIVATE_ROUTE_PREFIXES = ["/admin", "/client"];

type RouteFeatureMapping = {
  pathPrefix: string;
  feature?: string; 
  minPlan: PlanType;
  roles?: Role[]; 
};

export const ROUTE_FEATURE_MAPPING: RouteFeatureMapping[] = [
  {
    pathPrefix: "/client/dashboard",
    feature: "dashboard_access",
    minPlan: "Base",
    roles: ["MANAGER", "OWNER", "SELLER", "CASHIER"],
  },
  {
    pathPrefix: "/client/gestai",
    feature: "ai_management",
    minPlan: "Smart Pro",
    roles: ["MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/documents",
    feature: "billing_documents",
    minPlan: "Base",
    roles: ["ADMIN", "MANAGER", "OWNER", "CASHIER"],
  },
  {
    pathPrefix: "/client/items",
    feature: "inventory_management",
    minPlan: "Base",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/entities",
    feature: "client_management",
    minPlan: "Base",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports",
    feature: "basic_sales_reports",
    minPlan: "Base",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports/simple",
    minPlan: "Base",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports/by-date",
    feature: "filtered_sales_reports",
    minPlan: "Tsunami",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports/access-control",
    feature: "advanced_reports",
    minPlan: "Smart Pro",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports/stock-control",
    feature: "advanced_reports",
    minPlan: "Smart Pro",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports/sales-control",
    feature: "advanced_reports",
    minPlan: "Smart Pro",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/reports/fiscal",
    feature: "advanced_reports",
    minPlan: "Smart Pro",
    roles: ["ADMIN", "MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/stock",
    feature: "inventory_management",
    minPlan: "Tsunami",
    roles: ["MANAGER", "OWNER"],
  },
  {
    pathPrefix: "/client/pos",
    feature: "web_pos",
    minPlan: "Tsunami",
    roles: ["CASHIER", "OWNER"],
  },
  {
    pathPrefix: "/client/pos/new",
    feature: "web_pos",
    minPlan: "Tsunami",
    roles: ["CASHIER", "OWNER"],
  },
  {
    pathPrefix: "/client/pos/moviments-box",
    feature: "web_pos",
    minPlan: "Tsunami",
    roles: ["CASHIER", "OWNER"],
  },
  {
    pathPrefix: "/client/pos/settings",
    minPlan: "Smart Pro",
    roles: ["OWNER", "ADMIN"],
  },
  { pathPrefix: "/client/appearance", minPlan: "Tsunami", roles: ["OWNER"] },
  {
    pathPrefix: "/client/suppliers",
    feature: "supplier_management",
    minPlan: "Smart Pro",
    roles: ["OWNER", "MANAGER"],
  },
  {
    pathPrefix: "/client/stock-analysis",
    feature: "advanced_reports",
    minPlan: "Smart Pro",
    roles: ["OWNER", "MANAGER"],
  },
  {
    pathPrefix: "/client/pos-management",
    feature: "pos_management",
    minPlan: "Smart Pro",
    roles: ["OWNER"],
  },

  // Rotas de Admin (super-admin)
  {
    pathPrefix: "/admin/dashboard",
    feature: "admin_dashboard",
    minPlan: "Smart Pro",
    roles: ["ADMIN"],
  },
  {
    pathPrefix: "/admin/companies",
    feature: "admin_companies",
    minPlan: "Smart Pro",
    roles: ["ADMIN"],
  },
  {
    pathPrefix: "/admin/plans",
    feature: "admin_plans",
    minPlan: "Smart Pro",
    roles: ["ADMIN"],
  },
  {
    pathPrefix: "/admin/logs",
    feature: "admin_logs",
    minPlan: "Smart Pro",
    roles: ["ADMIN"],
  },
  {
    pathPrefix: "/admin/settings",
    feature: "admin_settings",
    minPlan: "Smart Pro",
    roles: ["ADMIN"],
  },
];

export const API_AUTH_PREFIX = "/api/auth";
export const DEFAULT_LOGIN_REDIRECT = "/auth/login";
export const UPGRADE_REDIRECT = "/pricing";