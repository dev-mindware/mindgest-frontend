import { Plan } from "@/lib/features";

// constants/routes.ts
export const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/pricing'
];

export const PRIVATE_ROUTE_PREFIXES = [
  '/dashboard',
  '/billing',
  '/inventory',
  '/pos',
  '/reports',
  '/admin',
  '/management'
];

type RouteFeatureMapping = {
  pathPrefix: string;
  feature: string;
  minPlan: Plan;
};

export const ROUTE_FEATURE_MAPPING: RouteFeatureMapping[] = [
  { pathPrefix: '/dashboard', feature: 'dashboard_access', minPlan: 'BASE' },
  { pathPrefix: '/billing/documents', feature: 'billing_documents', minPlan: 'BASE' },
  { pathPrefix: '/billing/clients', feature: 'client_management', minPlan: 'BASE' },
  { pathPrefix: '/reports/sales', feature: 'basic_sales_reports', minPlan: 'BASE' },
  
  { pathPrefix: '/inventory', feature: 'inventory_management', minPlan: 'TSUNAMI' },
  { pathPrefix: '/pos/web', feature: 'web_pos', minPlan: 'TSUNAMI' },
  { pathPrefix: '/reports/filtered-sales', feature: 'filtered_sales_reports', minPlan: 'TSUNAMI' },
  { pathPrefix: '/billing/print-settings', feature: 'print_settings', minPlan: 'TSUNAMI' },
  
  { pathPrefix: '/admin', feature: 'admin_dashboard', minPlan: 'SMART PRO' },
  { pathPrefix: '/management/suppliers', feature: 'supplier_management', minPlan: 'SMART PRO' },
  { pathPrefix: '/management/ai', feature: 'ai_management', minPlan: 'SMART PRO' },
  { pathPrefix: '/reports/advanced', feature: 'advanced_reports', minPlan: 'SMART PRO' },
  { pathPrefix: '/pos/management', feature: 'pos_management', minPlan: 'SMART PRO' }
];

export const API_AUTH_PREFIX = '/api/auth';
export const DEFAULT_LOGIN_REDIRECT = '/auth/login';
export const UPGRADE_REDIRECT = '/pricing';


/* import { Plan } from "@/lib/features";

export const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
];

export const PRIVATE_ROUTE_PREFIXES = [
  '/admin',
  '/billing',
  '/inventory',
  '/management',
  '/pos'
];

type RouteFeatureMapping = {
  pathPrefix: string;
  feature: string;
  minPlan: Plan;
};

export const ROUTE_FEATURE_MAPPING: RouteFeatureMapping[] = [
  { pathPrefix: '/admin', feature: 'admin_access', minPlan: 'BASE' },
  { pathPrefix: '/billing', feature: 'billing_access', minPlan: 'BASE' },
  { pathPrefix: '/inventory', feature: 'inventory_access', minPlan: 'TSUNAMI' },
  { pathPrefix: '/management', feature: 'management_access', minPlan: 'SMART PRO' },
  { pathPrefix: '/pos', feature: 'pos_access', minPlan: 'TSUNAMI' }
];

export const API_AUTH_PREFIX = '/api/auth';
export const DEFAULT_LOGIN_REDIRECT = '/auth/login'; */