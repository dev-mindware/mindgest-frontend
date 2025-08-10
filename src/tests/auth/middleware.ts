/* function getAllowedFeatures(role, plan) {
  const rolePerms = roleFeatures[role] || [];
  const planPerms = planFeatures[plan] || [];

  if (rolePerms.includes("all")) {
    return planPerms; // dono tem todas as features do plano
  }

  // apenas interseção de permissões
  return planPerms.filter(feature => rolePerms.includes(feature));
}

// Exemplo de uso:
const allowed = getAllowedFeatures("CASHIER", "TSUNAMI");
// ["basicBilling", "posWeb"]
 */