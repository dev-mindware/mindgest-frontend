# Plano Base - Itens Pendentes

## 1. Módulo de Reports

O módulo de relatórios deverá ser usado também para alimentar dashboards, especialmente para planos superiores. Para o **plano base**, são necessárias as seguintes métricas:

* **Número de produtos vendidos**

  * Incluir mensagens predefinidas indicando **tendência alta ou baixa**.
  * A tendência deve ser avaliada mensalmente, conforme apresentado no card do front-end.

* **Número de serviços prestados**

  * Mesmo formato das métricas de produtos, com avaliação mensal.

* **Gráfico de evolução mensal das vendas**

  * Representação visual da performance ao longo do tempo.

* **Vendas por produtos e por serviços**

  * Detalhamento das vendas segmentadas por tipo de item.

---

## 2. Microserviço em Python para geração de ficheiros

* Criar um microserviço responsável por gerar:

  1. **Facturas**
  2. **Relatórios de vendas simplificados** (mês e ano) em PDF
  3. **Ficheiro SAF-T**

* Disponibilizar uma **rota pública** `fetch by id` para consulta de todos os tipos de documentos:

  * Factura
  * Factura-Recibo
  * Factura-Proforma
  * Recibo

* A consulta deve ser acessível através do **scan do QR code** presente no documento.

---

## 3. Análise de módulos existentes

* **Módulo de notificações**

  * Revisão da implementação atual e possíveis melhorias.

* **Módulo de pagamento de subscrições**

  * Verificação da integração e funcionalidades para o plano base.

---

## 4. Resumo das pendências

| Item                     | Descrição                                                                       |
| ------------------------ | ------------------------------------------------------------------------------- |
| Stats                    | Número de produtos e serviços vendidos, gráficos mensais e vendas segmentadas   |
| Microserviço Python      | Geração de facturas, relatórios simplificados, SAF-T e rota pública via QR code |
| Módulo de notificações   | Análise e possíveis ajustes                                                     |
| Pagamento de subscrições | Revisão e integração no plano base                                              |

---

Este documento serve como checklist para finalizar a implementação do **plano base**, garantindo que todos os módulos essenciais estão contemplados.
