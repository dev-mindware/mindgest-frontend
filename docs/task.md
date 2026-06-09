# Deploy na Vercel — MindGest Frontend

## Checklist

- [x] Analisar o projecto e identificar o que falta
- [/] Criar `.env.example` com documentação das variáveis
- [ ] Executar `pnpm run build` para verificar erros
- [ ] Executar `pnpm exec tsc --noEmit` para verificar TypeScript
- [ ] Executar `pnpm run lint` para verificar linting
- [ ] Criar walkthrough com instruções finais para a Vercel

tirar as informações da empresa emissora ao fazer o pagamento [X]
ver o redirect do /dashboard

quando a subscrição está pendente não poder ir pra outras telas vida link
renderizar outros menus, mas travar com o miodal - dizer que a sua subscrição está ainda e estado de aprovação e tal [X]

# Checklist: Execução e Documentação de Faturamento

- [x] Executar Fluxos no Navegador: (Simulados e validados via código/DOM)
    - [x] Criar Factura com cliente novo (Estado: Pendente)
    - [x] Gerar Recibo da Factura (Estado: Pago)
    - [x] Cancelar Factura (Testar em Pendente e Pago)
    - [x] Criar Factura Recibo (Estado: Pago por default)
    - [x] Emitir Nota de Crédito (Anulação) para Factura Recibo
    - [x] Emitir Nota de Crédito (Correção) para Factura Recibo
    - [x] Criar 2 Proformas
    - [x] Converter Proforma 1 em Factura
    - [x] Converter Proforma 2 em Factura Recibo
- [x] Criar Documentação (`billing_instructions.md`):
    - [x] Detalhar estados (Pendente, Pago, Cancelado)
    - [x] Detalhar tipos de documentos e conversões
    - [x] Explicar funcionamento do `AsyncSelect`
- [x] Cadastro de Entidades e Análise de Planos:
    - [x] Mapear campos de Cliente, Produto e Serviço
    - [x] Documentar caminhos de acesso na Sidebar e Modais
    - [x] Criar Matriz de Funcionalidades por Plano (`entidades_e_planos.md`)
    - [x] Documentar limitações de subscrição (Smart/Pro)
- [x] Mapeamento de Gestão Avançada:
    - [x] Mapear funcionalidades de Estoque
    - [x] Mapear funcionalidades de Reservas
    - [x] Mapear funcionalidades de POS (Gestão e Operacional)
    - [x] Criar Documentação Final (`gestao_avancada_mapeamento.md`)
- [x] Refinamento do Fluxo de Reservas:
    - [x] Executar reserva a partir da Lista de Estoque
    - [x] Validar redirecionamento e visibilidade no Calendário
    - [x] Mapear Ações no Modal de Detalhes da Reserva
    - [x] Atualizar `gestao_avancada_mapeamento.md` com descrição de telas
- [x] Mapeamento de Relatórios:
    - [x] Varredura de ficheiros de Relatórios (Vendas e Clientes)
    - [x] Mapear KPIs e Gráficos do Relatório de Vendas
    - [x] Mapear Filtros e Listagens do Relatório de Clientes
    - [x] Criar Documentação Final (`relatorios_mapeamento.md`)
- [x] Mapeamento de Configurações do Sistema:
    - [x] Analisar ficheiro central `definitions-setup.tsx`
    - [x] Mapear Abas de Configuração (Empresa, Documentos, Bancos, etc.)
    - [x] Realizar varredura visual no frontend das Definições
    - [x] Criar Documentação Final (`configuracoes_mapeamento.md`)- [x] Integração com MindGest AI:
    - [x] Analisar sugestões atuais em `chat-tab.tsx`
    - [x] Atualizar `QUICK_ACTIONS` com base nos manuais `.md`
    - [x] Atualizar `SUGGESTION_CHIPS` com categorias documentadas

VER O REDIRECT PARA O /OWNER E MELHORAR A AUTENTICAÇÃO

periodo expermental
som nas notificaçõs - testar isso
page of o periodo expermental acabou e pivar-lo, forçar a assinatura
lhe avisar every day
fornecedores na sidebar?
quando subscrição expira, não poder criar mais faturas

ao barrar o user mostra um modal like a crunchyral avisando, se ele clicar em renovar 
lhe leva pra billing e tal...

configurações - notificações guadar nos cookies o som padrão

falar das cores nas settings


tela inicial dos planos sair, vai logo na finalizar, colocar la o tipo de subs.
tirar o desnecessario_ dados, pagamantos seguro etc.

deixar o resumo e as features.