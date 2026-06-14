import type { Alignment, DriveStep, Side } from "driver.js";
import type { PlanType, Role } from "@/types";

export type OnboardingTourId =
  | "setup"
  | "clients"
  | "items"
  | "documents-list"
  | "normal-invoice"
  | "stock"
  | "pos-invoice"
  | "pos-settings"
  | "pos-movements"
  | "pos-management"
  | "suppliers"
  | "reservations"
  | "reports-sales"
  | "reports-clients"
  | "reports-access-control"
  | "plans";

export type OnboardingTourGroup =
  | "setup"
  | "core"
  | "operation"
  | "advanced"
  | "reporting";

export type OnboardingTourType =
  | "setup"
  | "core"
  | "advanced"
  | "reporting";

export type OnboardingTourMode = "normal" | "demo";

export type OnboardingTourDemo =
  | "documents-filters"
  | "normal-client-existing"
  | "normal-client-new"
  | "normal-client-details"
  | "normal-product-existing"
  | "normal-product-new"
  | "normal-product-details"
  | "product-form-basics"
  | "product-form-stock"
  | "pos-management-filters"
  | "pos-management-view"
  | "reservations-calendar-view"
  | "pos-products-search"
  | "pos-client-existing"
  | "pos-client-new"
  | "pos-client-details";

export type TourStepDefinition = {
  selector: string;
  title: string;
  description: string;
  side?: Side;
  align?: Alignment;
  demo?: OnboardingTourDemo;
};

export type TourDefinition = {
  id: OnboardingTourId;
  title: string;
  group: OnboardingTourGroup;
  type: OnboardingTourType;
  priority: number;
  roles: Role[];
  minPlan: PlanType;
  steps: TourStepDefinition[];
};

export type OnboardingDriveStep = DriveStep & {
  selector?: string;
  demo?: OnboardingTourDemo;
};

type TourConfig = Omit<TourDefinition, "id">;
type StepOptions = Pick<TourStepDefinition, "side" | "align" | "demo">;

const TOUR_ROLES = {
  owner: ["OWNER"],
  ownerManager: ["OWNER", "MANAGER"],
  cashier: ["CASHIER"],
} satisfies Record<string, Role[]>;

function dataTour(name: string) {
  return `[data-tour="${name}"]`;
}

function tourStep(
  selector: string,
  title: string,
  description: string,
  options: StepOptions = {},
): TourStepDefinition {
  return {
    selector: dataTour(selector),
    title,
    description,
    ...options,
  };
}

function defineTour(id: OnboardingTourId, config: TourConfig): TourDefinition {
  return {
    id,
    ...config,
  };
}

export const onboardingTours: Record<OnboardingTourId, TourDefinition> = {
  setup: defineTour("setup", {
    title: "Configuração inicial",
    group: "setup",
    type: "setup",
    priority: 1,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Base",
    steps: [
      tourStep(
        "setup-layout",
        "Definições da conta",
        "Prepare empresa, fiscalidade e operação antes de emitir documentos.",
        { side: "bottom" },
      ),
      tourStep(
        "setup-general-tabs",
        "Área geral",
        "Aceda a perfil, segurança, aparência, subscrição e preferências de tours.",
        { side: "right" },
      ),
      tourStep(
        "setup-company-profile",
        "Perfil da empresa",
        "Confirme nome, contacto, endereço e NIF usados nos documentos.",
        { side: "left" },
      ),
      tourStep(
        "setup-tab-appearance",
        "Aparência",
        "Personalize a experiência visual quando o plano permitir.",
        { side: "right" },
      ),
      tourStep(
        "setup-tab-subscription",
        "Subscrição",
        "Reveja plano, limites e estado de pagamento da empresa.",
        { side: "right" },
      ),
      tourStep(
        "setup-workplace-tabs",
        "Ambiente de trabalho",
        "Configure colaboradores, categorias, lojas, bancos e dados fiscais.",
        { side: "right" },
      ),
      tourStep(
        "setup-tab-collaborators",
        "Colaboradores",
        "Gira acessos da equipa sem misturar perfis operacionais.",
        { side: "right" },
      ),
      tourStep(
        "setup-tab-categories",
        "Categorias",
        "Organize produtos, serviços e documentos por categorias.",
        { side: "right" },
      ),
      tourStep(
        "setup-tab-entities",
        "Lojas",
        "Configure lojas quando o plano tiver suporte multi-loja.",
        { side: "right" },
      ),
      tourStep(
        "setup-banks-content",
        "Bancos",
        "Cadastre bancos usados em documentos, recibos e controlo financeiro.",
        { side: "left" },
      ),
      tourStep(
        "setup-agt-content",
        "Dados fiscais",
        "Reveja séries, validações e configurações ligadas à integração fiscal.",
        { side: "left" },
      ),
      tourStep(
        "setup-guides-content",
        "Guias e tours",
        "Defina se os guias devem aparecer automaticamente e reponha os tours já vistos.",
        { side: "left" },
      ),
    ],
  }),

  clients: defineTour("clients", {
    title: "Gestão de clientes",
    group: "core",
    type: "core",
    priority: 2,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Base",
    steps: [
      tourStep(
        "clients-header",
        "Clientes",
        "Utilize esta área para centralizar os dados dos clientes usados em facturas e relatórios.",
        { side: "bottom" },
      ),
      tourStep(
        "clients-create",
        "Novo cliente",
        "Crie clientes completos quando já conhece o NIF, o telefone e o endereço antes da venda.",
        { side: "left" },
      ),
      tourStep(
        "clients-list",
        "Lista e pesquisa",
        "Pesquise, consulte e edite clientes existentes sem duplicar dados durante a emissão de documentos.",
        { side: "top" },
      ),
    ],
  }),

  items: defineTour("items", {
    title: "Produtos e serviços",
    group: "core",
    type: "core",
    priority: 3,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Base",
    steps: [
      tourStep(
        "items-header",
        "Catálogo comercial",
        "Os produtos e serviços alimentam facturas, o POS, o stock e os relatórios.",
        { side: "bottom" },
      ),
      tourStep(
        "items-tabs",
        "Produtos ou serviços",
        "Alterne entre produtos com controlo de stock e serviços sem inventário.",
        { side: "bottom" },
      ),
      tourStep(
        "items-create",
        "Criar item",
        "Crie o item manualmente ou, no plano Pro, utilize o código de barras para acelerar o registo.",
        { side: "left" },
      ),
      tourStep(
        "product-modal",
        "Registo do produto",
        "Preencha nome, preço, imposto e categoria antes de guardar.",
        { side: "left", demo: "product-form-basics" },
      ),
      tourStep(
        "product-stock-fields",
        "Stock e rastreio",
        "Defina quantidade, stock mínimo, stock máximo e código de barras quando disponível.",
        { side: "left", demo: "product-form-stock" },
      ),
      tourStep(
        "items-list",
        "Listagem",
        "Use a lista para filtrar e editar preços, categorias, impostos e campos avançados.",
        { side: "top" },
      ),
    ],
  }),

  "documents-list": defineTour("documents-list", {
    title: "Documentos",
    group: "core",
    type: "core",
    priority: 4,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Base",
    steps: [
      tourStep(
        "documents-header",
        "Central de documentos",
        "Aqui pode acompanhar facturas, facturas-recibo, proformas, recibos e notas de crédito.",
        { side: "bottom" },
      ),
      tourStep(
        "documents-tabs",
        "Tipos de documento",
        "Cada separador apresenta um tipo de documento fiscal ou comercial, com estados e acções próprias.",
        { side: "bottom" },
      ),
      tourStep(
        "documents-create",
        "Criar documento",
        "Inicia o fluxo de emissão no tipo seleccionado. As notas de crédito são geradas a partir de documentos existentes.",
        { side: "left" },
      ),
      tourStep(
        "documents-list",
        "Listagem e acções",
        "Utilize os filtros e os menus da tabela para consultar, descarregar, duplicar, cancelar ou converter documentos.",
        { side: "top" },
      ),
      tourStep(
        "documents-filters",
        "Filtros avançados",
        "Pesquise por cliente, estado, número e datas sem perder o contexto da lista.",
        { side: "bottom", demo: "documents-filters" },
      ),
    ],
  }),

  "normal-invoice": defineTour("normal-invoice", {
    title: "Criar factura",
    group: "core",
    type: "core",
    priority: 5,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Base",
    steps: [
      tourStep(
        "normal-invoice-document-type",
        "Tipo de documento",
        "Comece pelo separador Factura. Os outros separadores destinam-se a recibos e proformas.",
        { side: "bottom", align: "start" },
      ),
      tourStep(
        "normal-invoice-main-fields",
        "Dados principais",
        "Confirme a data de vencimento e a moeda antes de avançar para o cliente e os itens.",
        { side: "bottom" },
      ),
      tourStep(
        "normal-invoice-client",
        "Cliente existente",
        "Primeiro cenário: pesquise por nome, telefone ou email e seleccione um cliente já registado.",
        { side: "bottom", demo: "normal-client-existing" },
      ),
      tourStep(
        "normal-invoice-client",
        "Novo cliente",
        "Segundo cenário: quando o cliente não existir, escreva o nome e utilize a opção de criação no selector.",
        { side: "bottom", demo: "normal-client-new" },
      ),
      tourStep(
        "normal-invoice-client-details",
        "Dados do novo cliente",
        "Depois de introduzir o nome no selector, preencha o NIF, o telefone e o endereço antes de emitir a factura.",
        { side: "bottom", demo: "normal-client-details" },
      ),
      tourStep(
        "normal-invoice-item-select",
        "Item existente",
        "Primeiro cenário: pesquise um produto ou serviço já cadastrado para reaproveitar preço, stock e impostos.",
        { side: "top", demo: "normal-product-existing" },
      ),
      tourStep(
        "normal-invoice-item-select",
        "Novo produto ou serviço",
        "Segundo cenário: se o item ainda não existir, escreva o nome e crie-o directamente na factura.",
        { side: "top", demo: "normal-product-new" },
      ),
      tourStep(
        "normal-invoice-new-item-fields",
        "Dados do novo item",
        "Para itens novos, indique a quantidade, o preço, o tipo e o imposto antes de os adicionar à factura.",
        { side: "top", demo: "normal-product-details" },
      ),
      tourStep(
        "normal-invoice-summary",
        "Lista e totais",
        "Depois de adicionar itens, acompanhe aqui a lista, os descontos, a retenção e o total a pagar.",
        { side: "top" },
      ),
      tourStep(
        "normal-invoice-notes",
        "Observações",
        "Use este campo para notas comerciais ou instruções que devam acompanhar o documento.",
        { side: "top" },
      ),
      tourStep(
        "normal-invoice-submit",
        "Criar factura",
        "Quando todos os dados estiverem validados, este botão emite a factura. O tour não clica nem submete o formulário.",
        { side: "top", align: "end" },
      ),
    ],
  }),

  stock: defineTour("stock", {
    title: "Gestão de stock",
    group: "operation",
    type: "core",
    priority: 6,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Smart",
    steps: [
      tourStep(
        "stock-summary",
        "Resumo do stock",
        "Veja totais, disponibilidade, reservas e alertas de baixo stock antes de agir.",
        { side: "bottom" },
      ),
      tourStep(
        "stock-chart",
        "Níveis de inventário",
        "O gráfico separa stock adequado, baixo e esgotado para ajudar a priorizar a reposição.",
        { side: "top" },
      ),
      tourStep(
        "stock-filters",
        "Filtros",
        "Filtre por produto, loja, stock baixo, itens esgotados, reservas e intervalos avançados.",
        { side: "bottom" },
      ),
      tourStep(
        "stock-table",
        "Tabela e acções",
        "Abra o menu de acções para consultar detalhes, ajustar o stock, criar reservas ou libertá-las.",
        { side: "top" },
      ),
    ],
  }),

  "pos-invoice": defineTour("pos-invoice", {
    title: "Facturar no POS",
    group: "operation",
    type: "core",
    priority: 7,
    roles: TOUR_ROLES.cashier,
    minPlan: "Smart",
    steps: [
      tourStep(
        "pos-categories",
        "Categorias",
        "Use as categorias para filtrar rapidamente o menu de produtos do POS.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-document-tabs",
        "Factura ou proforma",
        "Escolha se a venda será emitida como factura-recibo ou se deve ficar apenas como proforma.",
        { side: "left" },
      ),
      tourStep(
        "pos-products",
        "Produtos no POS",
        "No POS, os produtos vêm da base de dados. Use a pesquisa para localizar rapidamente o item antes de adicioná-lo.",
        { side: "right", demo: "pos-products-search" },
      ),
      tourStep(
        "pos-product-add",
        "Adicionar ao carrinho",
        "Seleccione o produto ou o botão de adição para o colocar no carrinho.",
        { side: "left" },
      ),
      tourStep(
        "pos-product-quantity",
        "Quantidade do produto",
        "Depois de adicionar um produto, ajuste a quantidade no próprio cartão antes de concluir a venda.",
        { side: "left" },
      ),
      tourStep(
        "pos-cart",
        "Carrinho",
        "Aqui revê os itens da venda, as quantidades e o documento que será emitido.",
        { side: "left" },
      ),
      tourStep(
        "pos-cart-remove",
        "Remover item",
        "Use esta acção apenas quando um produto tiver sido adicionado por engano.",
        { side: "left" },
      ),
      tourStep(
        "pos-payment-summary",
        "Resumo",
        "O POS calcula subtotal, impostos, descontos e total antes da confirmação.",
        { side: "left" },
      ),
      tourStep(
        "pos-customer",
        "Cliente existente no POS",
        "Primeiro cenário: abra Cliente Opcional e pesquise um cliente já cadastrado para associá-lo à venda.",
        { side: "left", demo: "pos-client-existing" },
      ),
      tourStep(
        "pos-customer",
        "Novo cliente no POS",
        "Segundo cenário: se o cliente não existir, escreva o nome e crie o registo no seletor.",
        { side: "left", demo: "pos-client-new" },
      ),
      tourStep(
        "pos-new-customer-phone",
        "Telefone do novo cliente",
        "No POS, o dado complementar do novo cliente é o telefone. Preencha-o antes de confirmar o pagamento.",
        { side: "left", demo: "pos-client-details" },
      ),
      tourStep(
        "pos-payment-methods",
        "Pagamento",
        "Escolha o método de pagamento e, para pagamentos em numerário, introduza o valor recebido para calcular o troco.",
        { side: "left" },
      ),
      tourStep(
        "pos-payment-cash-received",
        "Valor entregue",
        "Quando o pagamento for em dinheiro, indique o valor recebido para calcular o troco.",
        { side: "left" },
      ),
      tourStep(
        "pos-payment-change",
        "Troco",
        "Confirme o troco antes de abrir a pré-visualização e concluir a venda.",
        { side: "left" },
      ),
      tourStep(
        "pos-submit",
        "Confirmar pagamento",
        "Este botão abre a confirmação da venda. O tour apenas explica o passo, sem emitir documentos.",
        { side: "top" },
      ),
    ],
  }),

  "pos-settings": defineTour("pos-settings", {
    title: "Definições do POS",
    group: "operation",
    type: "core",
    priority: 8,
    roles: TOUR_ROLES.cashier,
    minPlan: "Smart",
    steps: [
      tourStep(
        "pos-settings-header",
        "Definições do POS",
        "Use esta área para acompanhar a sessão de caixa e ajustar preferências da estação de trabalho.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-settings-tabs",
        "Áreas de configuração",
        "Geral concentra a operação do caixa. Workspace guarda preferências locais. Aparência ajusta o aspecto visual quando disponível.",
        { side: "right" },
      ),
      tourStep(
        "pos-settings-actions",
        "Acções da sessão",
        "Aqui estão abertura, fecho e registo de despesas. O tour apenas explica estes botões e nunca executa a acção por si.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-settings-open-session",
        "Abertura de caixa",
        "Inicie uma sessão apenas quando estiver autorizado e tiver o fundo de maneio correcto.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-settings-close-session",
        "Fecho de caixa",
        "Feche a sessão no fim do turno, depois de conferir vendas, despesas e valores recebidos.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-settings-register-expense",
        "Despesas do caixa",
        "Registe saídas manuais apenas quando existir uma sessão aberta e o motivo estiver documentado.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-settings-session-metrics",
        "Resumo da sessão",
        "Leia total vendido, tempo decorrido, fundo de maneio e responsável antes de fechar ou continuar a operar.",
        { side: "top" },
      ),
      tourStep(
        "pos-settings-tab-workspace",
        "Workspace",
        "Abra esta aba para configurar preferências locais desta estação, como teclado virtual e dispositivos.",
        { side: "right" },
      ),
      tourStep(
        "pos-settings-workspace",
        "Preferências locais",
        "Estas opções afectam apenas este navegador e ajudam a adaptar o POS ao equipamento usado no balcão.",
        { side: "top" },
      ),
      tourStep(
        "pos-settings-virtual-keyboard",
        "Teclado virtual",
        "Active ou oculte o teclado virtual conforme o tipo de dispositivo usado no atendimento.",
        { side: "top" },
      ),
      tourStep(
        "pos-settings-external-scanner",
        "Scanner externo",
        "Esta área prepara a configuração de leitores externos quando o equipamento estiver disponível.",
        { side: "top" },
      ),
      tourStep(
        "pos-settings-tab-appearance",
        "Aparência",
        "Use esta aba para rever opções visuais permitidas pelo plano e pela configuração da empresa.",
        { side: "right" },
      ),
      tourStep(
        "pos-settings-content-appearance",
        "Aspecto visual",
        "Ajuste a apresentação do POS sem interferir com vendas, pagamentos ou sessões de caixa.",
        { side: "top" },
      ),
    ],
  }),

  "pos-movements": defineTour("pos-movements", {
    title: "Movimentos de caixa",
    group: "operation",
    type: "core",
    priority: 9,
    roles: TOUR_ROLES.cashier,
    minPlan: "Smart",
    steps: [
      tourStep(
        "pos-movements-header",
        "Movimentos",
        "Acompanhe documentos emitidos no POS e notas de crédito associadas.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-movements-tabs",
        "Tipos de movimento",
        "Alterne entre facturas-recibo, proformas e notas de crédito do caixa.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-movements-list",
        "Listagem",
        "Utilize as acções da lista para consultar, descarregar ou acompanhar os documentos emitidos.",
        { side: "top" },
      ),
    ],
  }),

  "pos-management": defineTour("pos-management", {
    title: "Gestão de POS",
    group: "advanced",
    type: "advanced",
    priority: 10,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Pro",
    steps: [
      tourStep(
        "pos-management-summary",
        "Resumo dos caixas",
        "Veja receitas, pedidos de abertura e sessões para gerir a operação do POS.",
        { side: "bottom" },
      ),
      tourStep(
        "pos-management-filters",
        "Filtros e visualização",
        "Filtre sessões e alterne entre grelha e tabela para acompanhar terminais.",
        { side: "bottom", demo: "pos-management-filters" },
      ),
      tourStep(
        "pos-management-view-toggle",
        "Alternar visualização",
        "Troque entre cartões e tabela para rever sessões com mais detalhe.",
        { side: "left", demo: "pos-management-view" },
      ),
      tourStep(
        "pos-management-list",
        "Sessões de caixa",
        "Abra detalhes, pedidos e acções administrativas sem afectar as vendas em curso.",
        { side: "top" },
      ),
    ],
  }),

  suppliers: defineTour("suppliers", {
    title: "Fornecedores",
    group: "advanced",
    type: "advanced",
    priority: 11,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Pro",
    steps: [
      tourStep(
        "suppliers-header",
        "Fornecedores",
        "Centralize contactos e relações de fornecimento para reposição e histórico.",
        { side: "bottom" },
      ),
      tourStep(
        "suppliers-create",
        "Novo fornecedor",
        "Cadastre fornecedores antes de associar entradas de stock ou consultar histórico.",
        { side: "left" },
      ),
      tourStep(
        "suppliers-list",
        "Lista e detalhes",
        "Abra detalhes, edite dados e acompanhe o histórico de stock ligado ao fornecedor.",
        { side: "top" },
      ),
    ],
  }),

  reservations: defineTour("reservations", {
    title: "Reservas",
    group: "advanced",
    type: "advanced",
    priority: 12,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Pro",
    steps: [
      tourStep(
        "reservations-header",
        "Gestão de reservas",
        "Gira as reservas através do calendário e acompanhe a disponibilidade.",
        { side: "bottom" },
      ),
      tourStep(
        "reservations-calendar",
        "Calendário",
        "Use o calendário para visualizar, criar e acompanhar reservas por data.",
        { side: "top", demo: "reservations-calendar-view" },
      ),
    ],
  }),

  "reports-sales": defineTour("reports-sales", {
    title: "Relatórios de vendas",
    group: "reporting",
    type: "reporting",
    priority: 13,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Base",
    steps: [
      tourStep(
        "reports-sales-header",
        "Análise de vendas",
        "Acompanhe receitas, volume e evolução por período para tomar decisões com dados.",
        { side: "bottom" },
      ),
      tourStep(
        "reports-sales-filters",
        "Filtros",
        "Ajuste período e datas para comparar resultados com o intervalo correto.",
        { side: "bottom" },
      ),
      tourStep(
        "reports-sales-summary",
        "Indicadores e gráfico",
        "Os cartões e o gráfico mostram desempenho comercial e tendências.",
        { side: "top" },
      ),
      tourStep(
        "reports-sales-export",
        "Exportação fiscal",
        "Quando estiver disponível no plano, utilize a exportação para apoiar o cumprimento das obrigações fiscais.",
        { side: "left" },
      ),
    ],
  }),

  "reports-clients": defineTour("reports-clients", {
    title: "Relatórios de clientes",
    group: "reporting",
    type: "reporting",
    priority: 14,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Smart",
    steps: [
      tourStep(
        "reports-clients-header",
        "Análise de clientes",
        "Identifique clientes de maior valor, frequência de compra e ticket médio.",
        { side: "bottom" },
      ),
      tourStep(
        "reports-clients-filters",
        "Filtros",
        "Ajuste datas, tipo de cliente e limite de resultados para focar a análise.",
        { side: "bottom" },
      ),
      tourStep(
        "reports-clients-summary",
        "Métricas",
        "Leia receita, ticket médio, total de clientes e indicadores de fidelização.",
        { side: "top" },
      ),
      tourStep(
        "reports-clients-details",
        "Detalhes",
        "Gráficos e tabelas mostram principais clientes, receita mensal e produtos preferidos.",
        { side: "top" },
      ),
    ],
  }),

  "reports-access-control": defineTour("reports-access-control", {
    title: "Acesso e auditoria",
    group: "reporting",
    type: "reporting",
    priority: 15,
    roles: TOUR_ROLES.ownerManager,
    minPlan: "Pro",
    steps: [
      tourStep(
        "reports-access-header",
        "Auditoria",
        "Acompanhe acções, entidades alteradas, utilizadores e a origem das operações.",
        { side: "bottom" },
      ),
      tourStep(
        "reports-access-filters",
        "Filtros de auditoria",
        "Filtre por acção, entidade, utilizador e período para analisar os eventos.",
        { side: "bottom" },
      ),
      tourStep(
        "reports-access-list",
        "Registos",
        "Abra os detalhes para comparar dados anteriores e atuais quando estiverem disponíveis.",
        { side: "top" },
      ),
    ],
  }),

  plans: defineTour("plans", {
    title: "Planos e subscrição",
    group: "setup",
    type: "setup",
    priority: 16,
    roles: TOUR_ROLES.owner,
    minPlan: "Base",
    steps: [
      tourStep(
        "plans-header",
        "Escolha de plano",
        "Compare planos, limites e funcionalidades para perceber qual se adapta melhor à empresa.",
        { side: "bottom" },
      ),
      tourStep(
        "plans-grid",
        "Cartões de planos",
        "Cada cartão mostra preço, benefícios e funcionalidades incluídas.",
        { side: "top" },
      ),
      tourStep(
        "plans-inclusions",
        "Incluído nos planos",
        "Benefícios globais e regras de acesso ajudam a perceber quando vale a pena fazer upgrade.",
        { side: "top" },
      ),
    ],
  }),
};

export function toDriveStep(step: TourStepDefinition): OnboardingDriveStep {
  return {
    element: step.selector,
    selector: step.selector,
    demo: step.demo,
    disableActiveInteraction: true,
    popover: {
      title: step.title,
      description: step.description,
      side: step.side,
      align: step.align,
    },
  };
}
