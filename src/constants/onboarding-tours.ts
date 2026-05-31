import type { DriveStep, Side, Alignment } from "driver.js";

export type OnboardingTourId = "normal-invoice" | "pos-invoice";

export type OnboardingTourDemo =
  | "normal-client-existing"
  | "normal-client-new"
  | "normal-client-details"
  | "normal-product-existing"
  | "normal-product-new"
  | "normal-product-details"
  | "pos-products-search"
  | "pos-client-existing"
  | "pos-client-new"
  | "pos-client-details";

type TourStepDefinition = {
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
  steps: TourStepDefinition[];
};

export type OnboardingDriveStep = DriveStep & {
  demo?: OnboardingTourDemo;
};

export const onboardingTours: Record<OnboardingTourId, TourDefinition> = {
  "normal-invoice": {
    id: "normal-invoice",
    title: "Criar fatura",
    steps: [
      {
        selector: '[data-tour="normal-invoice-document-type"]',
        title: "Tipo de documento",
        description:
          "Comece pela aba Fatura. As outras abas servem para recibos e proformas.",
        side: "bottom",
        align: "start",
      },
      {
        selector: '[data-tour="normal-invoice-main-fields"]',
        title: "Dados principais",
        description:
          "Confirme a data de vencimento e a moeda antes de avancar com o cliente e os itens.",
        side: "bottom",
      },
      {
        selector: '[data-tour="normal-invoice-client"]',
        title: "Cliente existente",
        description:
          "Primeiro cenario: pesquise pelo nome, telefone ou email e escolha um cliente ja cadastrado.",
        side: "bottom",
        demo: "normal-client-existing",
      },
      {
        selector: '[data-tour="normal-invoice-client"]',
        title: "Novo cliente",
        description:
          "Segundo cenario: quando o cliente nao existe, escreva o nome e use a opcao de criar no select.",
        side: "bottom",
        demo: "normal-client-new",
      },
      {
        selector: '[data-tour="normal-invoice-client-details"]',
        title: "Dados do novo cliente",
        description:
          "Depois de criar o nome no select, complete NIF, telefone e endereco antes de emitir a fatura.",
        side: "bottom",
        demo: "normal-client-details",
      },
      {
        selector: '[data-tour="normal-invoice-item-select"]',
        title: "Item existente",
        description:
          "Primeiro cenario: pesquise um produto ou servico ja cadastrado para reaproveitar preco, stock e impostos.",
        side: "top",
        demo: "normal-product-existing",
      },
      {
        selector: '[data-tour="normal-invoice-item-select"]',
        title: "Novo produto ou servico",
        description:
          "Segundo cenario: se o item ainda nao existe, escreva o nome e crie-o diretamente na fatura.",
        side: "top",
        demo: "normal-product-new",
      },
      {
        selector: '[data-tour="normal-invoice-new-item-fields"]',
        title: "Dados do novo item",
        description:
          "Para itens novos, informe quantidade, preco, tipo e imposto antes de adicionar a fatura.",
        side: "top",
        demo: "normal-product-details",
      },
      {
        selector: '[data-tour="normal-invoice-summary"]',
        title: "Lista e totais",
        description:
          "Depois de adicionar itens, aqui acompanha a lista, descontos, retencao e total a pagar.",
        side: "top",
      },
      {
        selector: '[data-tour="normal-invoice-notes"]',
        title: "Observacoes",
        description:
          "Use este campo para notas comerciais ou instrucoes que devam acompanhar o documento.",
        side: "top",
      },
      {
        selector: '[data-tour="normal-invoice-submit"]',
        title: "Criar fatura",
        description:
          "Quando tudo estiver validado, este botao emite a fatura. O tour nao clica nem submete por si.",
        side: "top",
        align: "end",
      },
    ],
  },
  "pos-invoice": {
    id: "pos-invoice",
    title: "Faturar no POS",
    steps: [
      {
        selector: '[data-tour="pos-categories"]',
        title: "Categorias",
        description:
          "Use as categorias para filtrar rapidamente o menu de produtos do POS.",
        side: "bottom",
      },
      {
        selector: '[data-tour="pos-products"]',
        title: "Produtos no POS",
        description:
          "No POS, os produtos vem da base de dados. Use a busca para localizar rapidamente o item antes de adicionar.",
        side: "right",
        demo: "pos-products-search",
      },
      {
        selector: '[data-tour="pos-product-add"]',
        title: "Adicionar ao carrinho",
        description:
          "Clique no produto ou no botao de adicionar para enviar o item para o carrinho.",
        side: "left",
      },
      {
        selector: '[data-tour="pos-cart"]',
        title: "Carrinho",
        description:
          "Aqui reve os itens da venda, quantidades e o documento que sera emitido.",
        side: "left",
      },
      {
        selector: '[data-tour="pos-payment-summary"]',
        title: "Resumo",
        description:
          "O POS calcula subtotal, impostos, descontos e total antes da confirmacao.",
        side: "left",
      },
      {
        selector: '[data-tour="pos-customer"]',
        title: "Cliente existente no POS",
        description:
          "Primeiro cenario: abra Cliente Opcional e pesquise um cliente ja cadastrado para associar a venda.",
        side: "left",
        demo: "pos-client-existing",
      },
      {
        selector: '[data-tour="pos-customer"]',
        title: "Novo cliente no POS",
        description:
          "Segundo cenario: se o cliente nao existir, escreva o nome e crie o registo no select.",
        side: "left",
        demo: "pos-client-new",
      },
      {
        selector: '[data-tour="pos-new-customer-phone"]',
        title: "Telefone do novo cliente",
        description:
          "No POS, o dado complementar do novo cliente e o telefone. Preencha-o antes de confirmar o pagamento.",
        side: "left",
        demo: "pos-client-details",
      },
      {
        selector: '[data-tour="pos-payment-methods"]',
        title: "Pagamento",
        description:
          "Escolha o metodo de pagamento e, em dinheiro, informe o valor entregue para calcular o troco.",
        side: "left",
      },
      {
        selector: '[data-tour="pos-submit"]',
        title: "Confirmar pagamento",
        description:
          "Este botao abre a confirmacao da venda. O tour apenas explica o passo, sem emitir documentos.",
        side: "top",
      },
    ],
  },
};

export function toDriveStep(step: TourStepDefinition): OnboardingDriveStep {
  return {
    element: step.selector,
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
