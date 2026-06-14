# Entidades, itens e planos Mindgest

Este documento mapeia os principais recursos de clientes, produtos, serviços, fornecedores, stock e POS por plano de subscrição.

## Planos oficiais

O frontend trabalha com três planos oficiais:

- **Base**
- **Smart**
- **Pro**

O plano **Pro** inclui todos os recursos do Base e do Smart.

## Base

O Base cobre a operação essencial de uma empresa que precisa emitir documentos e organizar clientes, produtos e serviços.

### Recursos

- Cadastro de clientes.
- Cadastro de produtos.
- Cadastro de serviços.
- Categorias de itens.
- Impostos associados a itens.
- Notas de crédito.
- Bancos e configurações fiscais.
- Relatórios básicos de vendas.
- Notificações do sistema.
- Assistente MIND com 10 mensagens.
- Acesso web multiplataforma.
- Documentos ilimitados quando a faturação está ativa no plano.

## Smart

O Smart adiciona operação em balcão e controlo de stock. Ele é o plano indicado para empresas que vendem no POS e precisam acompanhar quantidades.

### Recursos

- Tudo do plano Base.
- POS operacional para operadores de caixa.
- Movimentos de caixa.
- Configurações POS do operador.
- Gestão de stock.
- Stock mínimo e máximo.
- Código de barras manual.
- Relatórios de clientes.
- Personalização de aparência.
- Assistente MIND com 15 mensagens.

### Nota sobre POS

O Smart dá acesso ao POS operacional. Isso significa vender no balcão, gerir carrinho, consultar produtos, emitir documentos e acompanhar movimentos básicos do caixa.

O Smart não inclui Gestão avançada de POS. A área administrativa de gestão de POS pertence ao plano Pro.

## Pro

O Pro adiciona gestão avançada, fornecedores, reservas, auditoria e campos logísticos completos para produtos.

### Recursos

- Tudo do plano Smart.
- Gestão de fornecedores.
- Fornecedor associado ao produto.
- Reservas de stock.
- Gestão avançada de POS.
- Scanner de código de barras por câmara.
- Unidade de medida.
- Data de validade.
- Peso e dimensões.
- Relatórios avançados.
- Relatórios de acesso e auditoria.
- Gestão multi-loja avançada.
- Assistente MIND com 20 mensagens.
- Exportação SAF-T quando suportada pelo plano.
- Impressão em A4 e talão quando suportada pelo plano.

## Campos de produto por plano

| Campo/Recurso | Base | Smart | Pro |
| --- | :---: | :---: | :---: |
| Nome | Sim | Sim | Sim |
| Descrição | Sim | Sim | Sim |
| Categoria | Sim | Sim | Sim |
| Preço de venda | Sim | Sim | Sim |
| Custo | Sim | Sim | Sim |
| Quantidade inicial | Sim | Sim | Sim |
| Imposto | Sim | Sim | Sim |
| Código de barras manual | Não | Sim | Sim |
| Stock mínimo/máximo | Não | Sim | Sim |
| Fornecedor | Não | Não | Sim |
| Unidade de medida | Não | Não | Sim |
| Data de validade | Não | Não | Sim |
| Peso | Não | Não | Sim |
| Dimensões | Não | Não | Sim |
| Scanner por câmara | Não | Não | Sim |

## Módulos por plano

| Módulo | Base | Smart | Pro |
| --- | :---: | :---: | :---: |
| Gestão de cliente | Sim | Incluído no Base | Incluído no Smart |
| Documentos | Sim | Sim | Sim |
| Items | Sim | Sim | Sim |
| Notificações | Sim | Sim | Sim |
| Definições gerais | Sim | Sim | Sim |
| POS operacional | Não | Sim | Sim |
| Movimentos de caixa | Não | Sim | Sim |
| Gestão de stock | Não | Sim | Sim |
| Relatórios de clientes | Não | Sim | Sim |
| Aparência | Não | Sim | Sim |
| Fornecedores | Não | Não | Sim |
| Reservas | Não | Não | Sim |
| Gestão avançada de POS | Não | Não | Sim |
| Relatórios de auditoria | Não | Não | Sim |
| Limite de mensagens MIND | 10 | 15 | 20 |

## Regras de bloqueio

- Utilizadores sem subscrição ativa ficam limitados por `ProtectedAction`.
- Recursos por plano são controlados por `FeatureGate`, `PlanGate`, menu com `minPlan` e validação de rota.
- Operadores de caixa também devem respeitar o plano da empresa para aceder ao POS.
- Fornecedores são exclusivos do Pro, incluindo listagem, filtros e associação ao produto.
