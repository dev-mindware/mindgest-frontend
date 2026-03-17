# Guia de Entidades e Planos Mindgest

Este documento mapeia os campos de cadastro para Clientes, Produtos e Serviços, destacando as funcionalidades restritas por plano de subscrição.

---

## 1. Cadastro de Clientes
O cadastro de clientes é essencial para a emissão de documentos nominais e gestão de contactos.

**Caminho de Acesso**:
1.  No menu lateral (sidebar), aceda a **Clientes** (ícone de utilizadores).
2.  No canto superior direito da listagem, clique no botão **Novo Cliente**.
3.  Será aberto o modal **Adicionar Cliente**, onde deverá preencher os dados obrigatórios.

*   **Campos Principais**:
    *   **Nome**: Identificação do cliente (mínimo 3 caracteres).
    *   **NIF**: Número de Identificação Fiscal (validado para 9 ou 10 dígitos).
    *   **Telefone**: Validado para operadores de Angola.
    *   **Endereço e Email**: Informações de contacto e faturação.

---

## 2. Cadastro de Itens (Produtos vs. Serviços)
A gestão de itens é centralizada no menu **Items**, dividida por abas para organizar o seu inventário.

**Caminho de Acesso Geral**:
*   No menu lateral (sidebar), aceda a **Items** (ícone de cesto de compras).

### 2.1 Produtos
1.  Na aba **Produtos**, localize o botão **Novo Produto** no topo.
2.  Clique no botão e selecione a opção **Manual**.
3.  O modal **Adicionar Produto** será exibido para preenchimento técnica do item (preços, stocks, etc).

### 2.2 Serviços
1.  Mude para a aba **Serviços** na página de Items.
2.  Clique no botão **Novo Serviço**.
3.  O modal **Adicionar Serviço** será aberto, focado em campos de venda e descrição de mão-de-obra.

### 2.3 Campos Comuns nos Modais
*   **Nome**: Designação comercial do item.
*   **Preço de Venda**: Valor base para faturação.
*   **Categoria**: Agrupamento para relatórios (ex: Consultoria, Hardware).
*   **Imposto (IVA)**: Taxa configurada para o item.

---

## 3. Gestão Avançada (Planos Smart e Pro)
Para funcionalidades de controlo rigoroso e logística, o Mindgest disponibiliza o menu **Gestão** na sidebar e campos adicionais nos modais de itens:

### 3.1 Módulos de Gestão
*   **Estoque**: Consulta detalhada de movimentos, saldos e histórico de entradas e saídas.
*   **Reservas**: (Plano Pro) Gestão de itens reservados para clientes antes da faturação.
*   **POS**: (Plano Pro) Configurações específicas para o Ponto de Venda.

### 3.2 Campos Técnicos de Produto (Gestão Logística)
*   **Custo de Compra**: Essencial para cálculo de margem de lucro.
*   **Quantidade Inicial**: Saldo do inventário no momento do cadastro.
*   **Código de Barras**: Permite a venda rápida via scanner.
*   **Informação de Stock**: Stock Mínimo e Máximo (Smart/Pro) para alertas automáticos.

### 3.3 Detalhes de Serviço
*   **Duração/Quantidade**: Unidades de consultoria ou tempo de execução.
*   **Descrição**: Detalhamento técnico do serviço no modal.

---

## 4. Matriz de Funcionalidades por Plano
O acesso a determinados campos e módulos é controlado via `FeatureGate` e depende da subscrição ativa.

| Funcionalidade / Campo | Plano Grátis | Plano Smart | Plano Pro |
| :--- | :---: | :---: | :---: |
| Faturamento Básico (FT, FR) | ✅ | ✅ | ✅ |
| Cadastro de Clientes/Itens | ✅ | ✅ | ✅ |
| **Stock Mínimo / Máximo** | ❌ | ✅ | ✅ |
| **Alertas de Rutura** | ❌ | ✅ | ✅ |
| **Unidades de Medida** | ❌ | ❌ | ✅ |
| **Peso e Dimensões** | ❌ | ❌ | ✅ |
| **Data de Validade/Lote** | ❌ | ❌ | ✅ |
| **Exportação SAFT** | ❌ | Opcional | ✅ |
| **Gestão Multi-Loja** | ❌ | ❌ | ✅ |

---

## 5. Lógica de Bloqueio e Proteção
*   **Subscription PENDING**: O sistema permite navegação mas bloqueia ações de escrita (botões de salvar) exibindo um modal de "Pagamento Pendente".
*   **Expired/Inactive**: Bloqueia o acesso a módulos operacionais, exigindo a renovação da subscrição.
*   **FeatureGate**: Esconde automaticamente campos avançados na interface caso o plano atual não os suporte, garantindo uma UI limpa e focada no que o utilizador contratou.

---
*Gerado por Antigravity - Março 2026*
