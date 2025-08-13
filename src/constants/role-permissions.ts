export const rolePermissions = {
  "OWNER": {
    "BASE": [
      "/owner/dashboard",
      "/owner/users",
      "/owner/settings",
      "/owner/documents",
      "/owner/reports",
    ],
    "TSUNAMI": [
      "/owner/tsunami",
      "/owner/users",
      "/owner/settings",
      "/owner/documents",
      "/owner/reports",
    ],
    "SMART_PRO": [
      "/owner/dashboard",
      "/owner/users",
      "/owner/settings",
      "/owner/documents",
      "/owner/reports",
    ],
 
  },
  "MANAGER": [
    "/headmaster/dashboard",
    "/headmaster/orders",
    "/headmaster/reports",
    "/headmaster/settings",
  ],
  "CASHIER": [
    "/cashier/dashboard",
    "/cashier/orders",
    "/cashier/docs",
    "/cashier/analysis",
    "/cashier/settings",
  ],
};
