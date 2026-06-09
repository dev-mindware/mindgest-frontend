# Guia de Gestão Avançada: Estoque, Reservas e POS

Este guia detalha as funcionalidades avançadas do Mindgest, focadas em controlo de inventário rigoroso, agendamentos e operações de ponto de venda (PDV), com foco na interface e experiência do utilizador.

---

## 1. Gestão de Estoque
A tela de Gestão de Estoque centraliza o monitoramento de inventário multi-loja e permite intervenções rápidas.

**Caminho de Acesso**: Sidebar -> **Gestão** -> **Estoque**.

### 1.1 Interface e Indicadores
A listagem de itens apresenta colunas fundamentais para o negócio:
*   **Quantidade**: Total bruto de itens físicos.
*   **Reservado**: Itens bloqueados para clientes (agendamentos).
*   **Disponível**: Saldo real para novas vendas (`Total - Reservado`).
*   **Status de Nível**: Badges visuais (🔴 Fora de Estoque, 🟡 Estoque Baixo, 🟢 Em Estoque).

### 1.2 Fluxo de Reserva a partir do Estoque
Para garantir itens para um cliente específico sem faturar de imediato:
1.  Na linha do produto, clique no ícone de **três pontos (Ações)**.
2.  Selecione a opção **"Reservar"**.
3.  O modal **Reservar Stock** será aberto:
    *   Selecione o **Cliente**.
    *   Defina a **Quantidade** (limitada ao disponível).
    *   Ajuste o **Período** (Data/Hora de Início e Fim).
    *   Adicione uma **Descrição** opcional.
4.  Clique no botão **"Reservar Stock"** para confirmar.

> [!NOTE]
> Após confirmar a reserva, o sistema realiza um **redirecionamento automático** para a tela de Gestão de Reservas (Calendário).

---

## 2. Gestão de Reservas
Apresentada em formato de calendário interativo para visualização temporal dos agendamentos.

**Caminho de Acesso**: Sidebar -> **Gestão** -> **Reservas**.

### 2.1 O Calendário de Reservas
*   Permite ver os blocos de reserva por dia/hora.
*   **Ação**: Clique num bloco de reserva para abrir os detalhes.

### 2.2 Modal: Detalhes da Reserva
Ao abrir uma reserva existente, o sistema apresenta o modal **Detalhes da Reserva** com as seguintes ações:
*   **Badge de Status**: Indica se a reserva está `Agendada`, `Ativa`, `Concluída` ou `Cancelada`.
*   **Botão Cancelar Reserva**: (Destaque Vermelho) Liberta os itens de volta para o estoque disponível.
*   **Botão Editar Reserva**: Permite alterar datas ou quantidades.
*   **Botão Fechar**: Encerra a visualização de detalhes.

---

## 3. Gestão de POS
Módulo para proprietários monitorizarem e configurarem os terminais de venda.

**Caminho de Acesso**: Sidebar -> **Gestão** -> **POS**.

### 3.1 Gestão de Caixas
*   **Ação "Gerenciar Caixas"**: Abre o modal para configurar terminais, capital inicial e tempo de expediente.
*   **Dashboard**: Cartões métricos interativos para **Receitas**, **Despesas** e **Solicitações** de abertura de caixa.

---

## 4. Ponto de Venda Operacional (Counter)
Interface otimizada para o operador de caixa realizar vendas rápidas.

**Caminho de Acesso**: Sidebar -> **Ponto de Venda** -> **Ponto de Venda**.

### 4.1 Funções de Checkout
*   **Busca Rápida**: Pesquisa instantânea por nome ou scanner.
*   **Categorias**: Filtros visuais por tipo de item.
*   **Checkout**: Finalização com escolha de pagamentos e emissão de fatura-recibo.

---
*Gerado por Antigravity - Março 2026*
