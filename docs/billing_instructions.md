# Manual de Instruções: Fluxos de Faturamento e Documentos Mindgest

Este guia detalha os processos operacionais de faturamento, gestão de documentos e o funcionamento técnico dos componentes de seleção assíncrona.

---

## 1. Configuração de Tesouraria (Bancos)
Antes de emitir faturas a crédito (FT), é recomendável configurar os dados bancários para que apareçam no rodapé do documento.
*   **Localização**: Menu **Configurações > Espaço de Trabalho**.
*   **Ação**: Adicionar novo banco.
*   **Banco Padrão**: Defina um banco como "Padrão" para que o sistema o selecione automaticamente em novos documentos.
*   **Validação**: O IBAN deve seguir o padrão `AO06` + 21 dígitos.

---

## 2. Fluxo de Clientes e Faturamento
O Mindgest permite a criação rápida de clientes sem sair do formulário de faturamento.

### 2.1 Criar Factura com Cliente Novo
1.  Aceda a **Documentos > Criar Documento > Factura (FT)**.
2.  No campo "Cliente", digite o nome. Se não existir, selecione **"➕ Criar [Nome]"**.
3.  **Schema de NIF**: O sistema aceita 10 dígitos (Empresa) ou 9 dígitos + 2 letras + 3 dígitos (Singular).
4.  **Estado Inicial**: A Factura é criada no estado **Pendente**.

### 2.2 Ciclo de Vida do Pagamento
*   **Gerar Recibo**: Nas ações (`...`) da Factura, selecione "Gerar Recibo". Após confirmar, o estado muda para **Pago**.
*   **Cancelamento**: 
    *   É possível cancelar uma Factura **Pendente** (anulação direta).
    *   Para Facturas **Pagas**, o cancelamento gera automaticamente os movimentos de estorno necessários.

---

## 3. Tipos Especiais de Documentos

### 3.1 Factura Recibo (FR)
*   **Estado por Omissão**: Ao contrário da FT, a Factura Recibo nasce no estado **Pago** (pronto pagamento).
*   **Anulação**: Use a ação "Emitir Nota" para anular o documento por completo.
*   **Retificação**: Use a ação "Emitir Nota" para correções parciais de valores ou itens.

### 3.2 Proformas (OR) e Conversão
A Proforma é um documento de orçamento que não movimenta stock nem contas correntes até ser convertida.
*   **Itens Externos**: Pode adicionar itens que não estão na base de dados pesquisando o nome e clicando em "Adicionar [Item]". Deverá definir o preço e imposto manualmente.
*   **Conversão**:
    *   **Proforma -> Factura**: Transforma o orçamento numa venda a crédito (Estado: Pendente).
    *   **Proforma -> Factura Recibo**: Transforma o orçamento numa venda a pronto pagamento (Estado: Pago).

---

## 4. Componente Técnico: AsyncCreatableSelectField
O componente `src/components/common/input-fetch/async-select.tsx` é utilizado para buscas dinâmicas (Clientes, Itens).

### 4.1 Funcionamento
*   **Busca Assíncrona**: Realiza chamadas à API (ex: `/items`, `/clients`) conforme o utilizador digita.
*   **Debounce**: Aguarda 300ms após a última tecla para evitar excesso de pedidos ao servidor.
*   **Criação Dinâmica (`Creatable`)**: Se o item pesquisado não existir, o componente oferece a opção de criar um novo registo (`__isNew__`), disparando a lógica de formulário ad-hoc.
*   **Paginação**: O menu de sugestões inclui controlos de página para navegar em listas longas sem sobrecarregar a interface.

---
*Gerado automaticamente pela Inteligência Mindgest - Março 2026*
