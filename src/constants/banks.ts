export interface BankConfig {
  code: string;
  name: string;
  fullName: string;
  isPopular?: boolean;
}

/**
 * Acervo oficial de bancos em Angola com códigos de identificação bancária BNA.
 */
export const ANGOLAN_BANKS: BankConfig[] = [
  // Mais comuns / Mais utilizados
  { name: "BAI", code: "0040", fullName: "Banco Angolano de Investimentos", isPopular: true },
  { name: "BFA", code: "0006", fullName: "Banco de Fomento Angola", isPopular: true },
  { name: "ATLANTICO", code: "0055", fullName: "Banco Millennium Atlântico", isPopular: true },
  { name: "BIC", code: "0051", fullName: "Banco BIC", isPopular: true },
  { name: "BPC", code: "0010", fullName: "Banco de Poupança e Crédito", isPopular: true },
  { name: "SOL", code: "0044", fullName: "Banco Sol", isPopular: true },
  { name: "STANDARD BANK", code: "0060", fullName: "Standard Bank de Angola", isPopular: true },
  { name: "BCI", code: "0005", fullName: "Banco de Comércio e Indústria", isPopular: true },
  { name: "KEVE", code: "0045", fullName: "Banco Keve", isPopular: true },
  { name: "BCGA", code: "0047", fullName: "Banco Caixa Geral Angola", isPopular: true },

  // Demais instituições bancárias autorizadas pelo BNA
  { name: "BNI", code: "0052", fullName: "Banco de Negócios Internacional" },
  { name: "BE", code: "0041", fullName: "Banco Económico" },
  { name: "YETU", code: "0066", fullName: "Banco Yetu" },
  { name: "BIR", code: "0067", fullName: "Banco de Investimento Rural" },
  { name: "BCA", code: "0042", fullName: "Banco Comercial Angolano" },
  { name: "BCH", code: "0059", fullName: "Banco Comercial do Huambo" },
  { name: "BDA", code: "0054", fullName: "Banco de Desenvolvimento de Angola" },
  { name: "BOM", code: "0063", fullName: "Banco BAI Microfinanças" },
  { name: "VTB", code: "0053", fullName: "Banco VTB África" },
  { name: "ACCESS BANK", code: "0057", fullName: "Access Bank Angola" },
  { name: "VALOR", code: "0058", fullName: "Banco Valor" },
  { name: "PRESTÍGIO", code: "0064", fullName: "Banco Prestígio" },
  { name: "BOC", code: "0068", fullName: "Bank of China - Luanda" },
  { name: "SCBA", code: "0062", fullName: "Standard Chartered Bank Angola" },
];

export const CUSTOM_BANK_VALUE = "__CUSTOM_BANK__";

/**
 * Procura um banco pelo nome (sigla ou nome completo).
 */
export function findBankByName(name?: string | null): BankConfig | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toUpperCase();
  return ANGOLAN_BANKS.find(
    (b) =>
      b.name.toUpperCase() === normalized ||
      b.fullName.toUpperCase() === normalized ||
      `${b.name} - ${b.fullName}`.toUpperCase() === normalized,
  );
}
