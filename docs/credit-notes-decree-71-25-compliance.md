# Conformidade das Notas de Crédito — Decreto Presidencial n.º 71/25

> Análise do fluxo de **notas de crédito (NC)** do frontend MindGest contra o **texto legal real** do
> **Decreto Presidencial n.º 71/25, de 20 de Março** (Regime Jurídico das Facturas), publicado no
> Diário da República I Série n.º 52. **Já em vigor** (art. 42.º: 6 meses após publicação → ~20/09/2025).
> Revoga o D.P. 292/18.
>
> **Âmbito:** o que é **verificável neste repositório frontend**. Requisitos de geração do PDF legal /
> backend (hash, certificação, série, ano económico, por extenso, dados do fornecedor) estão no
> [Apêndice](#apêndice--backend--pdf-legal-a-confirmar-com-a-equipa), com a referência de artigo.
>
> Data: 2026-06-18 · Legenda: ✅ cumpre · ⚠️ parcial · ❌ não cumpre

---

## 1. Veredicto executivo

A base está correta (a NC refere o documento original, só reduz valor, mantém o cliente), mas o fluxo
**não cumpre vários requisitos já em vigor** do Decreto 71/25. Os desvios mais sérios:

- ❌ **Prova de conhecimento do adquirente** (art. 8.º n.os 5-7 + art. 21.º) — inexistente.
- ❌ **Autorização (managerBarcode)** enviada mas **nunca recolhida** na UI.
- ⚠️ **Motivo obrigatório** (art. 8.º n.º 4) — a justificação em texto é opcional.
- ⚠️ **Expressão «anulação»/«rectificação»** (art. 8.º n.º 5) — terminologia inconsistente.
- ⚠️ **Taxas de imposto diferentes descritas em separado** (art. 10.º n.º 2) — usa-se taxa global única.
- ⚠️ **Só faturas PAID** podem gerar NC — uma fatura já enviada mas não paga fica sem caminho legal.

> ⚖️ **Risco real:** o art. 35.º n.º 8 prevê coima de **5%** do valor do documento por omissão de
> preço/NIF/endereço/nome/programa validado e **1%** por outros requisitos em falta — por cada documento.

---

## 2. O que preciso melhorar / adicionar / mudar

### ➕ ADICIONAR (não existe hoje)
| # | Ação | Base legal |
|---|---|---|
| A1 | **Fluxo de conhecimento do adquirente**: registar a manifestação (carta/e-mail/assinatura+NIF/carimbo) ou a confirmação eletrónica; estado "pendente de confirmação"; presunção quando regulariza o imposto | art. 8.º n.os 5-7, art. 21.º |
| A2 | **Captura do `managerBarcode`** na UI da NC (hoje vai sempre vazio) | (autorização interna) |
| A3 | **Motivos de devolução / variação de serviço / desconto** na criação de NC | art. 3.º l) |
| A4 | **Cálculo de imposto por item / por taxa** (separar taxas diferentes) | art. 10.º n.º 2 |
| A5 | **Caminho de NC para faturas emitidas e enviadas mas não pagas** (não só PAID) | art. 8.º n.º 4 |
| A6 | **Regularização de faturas de adiantamento via NC** — *se* o negócio emitir faturas de adiantamento (hoje não existe esse tipo no sistema) | art. 8.º n.º 10 |

### 🔁 MUDAR (existe, mas fora de conformidade)
| # | Ação | Base legal |
|---|---|---|
| M1 | Tornar a **justificação do motivo obrigatória** (campo `notes` é opcional no schema) | art. 8.º n.º 4 |
| M2 | Uniformizar a terminologia para **«anulação»/«rectificação»** (form e template usam "Cancelamento"/"Correção") | art. 8.º n.º 5 |
| M3 | Template da NC: mostrar o **nome do item** em vez do `itemsId` | art. 10.º n.º 1 c) |
| M4 | **Bloquear correção no-op (crédito 0)** e a subida de preço por item | art. 3.º l) (NC só reduz) |
| M5 | Corrigir a **copy** "Nota de crédito anulada" (cria, não anula) | (clareza) |

### 🔧 MELHORAR (robustez/UX, não estritamente legal)
- Modal de cancelamento mostra `clientId` cru em vez do nome.
- Coerência: o filtro lista "Desconto" (`DISCOUNT`) mas não há criação com esse motivo.
- Remover possível código morto (`updateCreditNote`/`useUpdateCreditNote`), o `console.log` e o typo do ficheiro `credfit-notes-form.tsx`.
- Registar o **motivo no cancelamento direto** de fatura (hoje não captura).

---

## 3. Matriz de conformidade por artigo

| Artigo | Exigência | Estado | Classe |
|---|---|---|---|
| 3.º e) / l) | NC é documento fiscalmente relevante (não é fatura), p/ anular/rectificar quando a operação cessa ou o valor reduz | Modelo conceptual correto; só cobre "Correção"/"Anulação", sem devolução/variação/desconto explícitos | ⚠️ |
| 8.º n.º 4 | Anular/rectificar **por NC, indicando o motivo** | NC usada, mas justificação textual **opcional** | ⚠️ |
| 8.º n.º 5 | NC contém **«anulação»/«rectificação»** + **identificação do doc original** + **prova de conhecimento** | Identificação ✅; terminologia ⚠️; prova de conhecimento ❌ | ❌ |
| 8.º n.os 6-7 | Manifestação offline (carta/e-mail/assinatura+NIF/carimbo) e presunção por regularização do imposto | Inexistente | ❌ |
| 8.º n.º 8 | Erro **só de identificação** (art. 10.º n.º 1 a) → anular via software **sem NC** | Não há caminho dedicado (manda corrigir cliente e reemitir NC) | ⚠️ |
| 8.º n.º 9 | Faturas **não enviadas** → anular sem NC | Cancelamento direto restrito a `DRAFT` (≈ não enviada) | ✅ |
| 8.º n.º 10 | Faturas de **adiantamento** regularizadas por NC | Sem tipo "factura adiantamento" no sistema | ⚠️ (N/A?) |
| 10.º n.º 1 c) | Discriminação dos itens c/ quantidades | Presente; template mostra `itemsId` em vez do nome | ⚠️ |
| 10.º n.º 1 e) + n.º 2 | Taxas aplicáveis e montante; **taxas diferentes descritas em separado** | Taxa **global única** (ignora `taxId` por item) | ⚠️ |
| 10.º n.º 1 h)/i) | Língua portuguesa + data de emissão | Presentes | ✅ |
| 10.º n.º 5 | NC respeita o art. 10.º n.º 1 **exceto g)** (data/hora/local) | Campos legais completos dependem do PDF backend → Apêndice | — |
| 21.º | Manifestação **eletrónica** do destinatário (NC eletrónica) | Inexistente | ❌ |

---

## 4. Gaps detalhados (com evidência em código)

### Gap 1 — Conhecimento do adquirente ❌ · art. 8.º n.os 5-7, art. 21.º (P0)
A NC tem de conter **prova de que o adquirente tomou conhecimento** da anulação/rectificação. O decreto
admite três vias: (i) **manifestação eletrónica** (art. 21.º n.º 1); (ii) **offline** — carta, e-mail,
assinatura+NIF ou carimbo (art. 8.º n.º 6); (iii) **presunção** quando o adquirente regulariza o imposto
(art. 8.º n.º 7). Nada disto existe no fluxo de NC do frontend.

### Gap 2 — Autorização do gerente nunca recolhida ❌ (P0)
O payload inclui `managerBarcode`, mas **nenhum input na UI** o preenche → vai sempre vazio.
- **Evidência:** envio em [credfit-notes-form.tsx:154](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L154); ausente em [ReasonNotesSection](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx) e [ClientDocumentSection](../src/components/client/documents/credits-notes/sections/ClientDocumentSection.tsx); default `""` em [credit-notes.ts:36](../src/utils/credit-notes.ts#L36); schema opcional em [add-credit-note.ts:6](../src/schemas/add-credit-note.ts#L6).

### Gap 3 — Motivo/justificação não obrigatório ⚠️ · art. 8.º n.º 4 (P0/P1)
"As facturas devem ser anuladas ou rectificadas por notas de crédito, a qual deve indicar o motivo."
O `reason` (enum) está sempre definido, mas a justificação em texto `notes` é **opcional**.
- **Evidência:** [add-credit-note.ts:5](../src/schemas/add-credit-note.ts#L5).

### Gap 4 — NC só para faturas pagas ⚠️ · art. 8.º n.º 4 (P0)
"Emitir Nota" só aparece quando `status === "PAID"`. Uma fatura **emitida e já entregue, mas não paga**
não tem caminho de retificação por NC (só "Gerar Recibo"), contrariando a regra de que qualquer fatura
(que não caia na exceção dos n.os 8-9) só se retifica por NC.
- **Evidência:** [invoice-list.tsx:114-131](../src/components/client/documents/invoice-normal/invoice-list.tsx#L114-L131) (NC só em `PAID`); cancelamento direto só em `DRAFT` em [invoice-list.tsx:94-103](../src/components/client/documents/invoice-normal/invoice-list.tsx#L94-L103).

### Gap 5 — Motivos demasiado genéricos ⚠️ · art. 3.º l) (P1)
A definição legal de NC cita **devoluções de bens, variação do nível do serviço e descontos**. O sistema
só oferece `CORRECTION` e `ANNULMENT`. O filtro até lista "Desconto" (`DISCOUNT`), mas **não há criação**.
- **Evidência:** opções em [ReasonNotesSection.tsx:24-29](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx#L24-L29); filtro com `DISCOUNT` em [credit-note-filters.tsx:52-59](../src/components/client/documents/credits-notes/credit-note-filters.tsx#L52-L59).

### Gap 6 — Terminologia «anulação»/«rectificação» ⚠️ · art. 8.º n.º 5 (P1)
A NC "deve conter a expressão «anulação» ou «rectificação»". O form usa "Correção"/"Anulação Total"; o
template traduz `ANNULMENT` como **"Cancelamento"**. Falta uniformizar com os termos legais exatos.
- **Evidência:** [ReasonNotesSection.tsx:26-28](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx#L26-L28); [credit-note-template.tsx:50](../src/components/common/dynamic-drawer/templates/credit-note-template.tsx#L50).

### Gap 7 — Imposto como taxa global única ⚠️ · art. 10.º n.º 2 (P1)
"Quando os bens e serviços sejam sujeitos a taxas de imposto diferentes, a sua descrição é efectuada de
forma separada." A correção deriva uma **única taxa** (`taxAmount/subtotal`) e aplica-a a tudo, ignorando
o `taxId` que cada item já transporta — distribuição incorreta quando há taxas mistas.
- **Evidência:** taxa global em [credit-note-correction.ts:30-35](../src/utils/credit-note-correction.ts#L30-L35); item com `taxId` em [credit-note.ts:82](../src/types/credit-note.ts#L82) e [items.ts:52](../src/types/items.ts#L52).

### Gap 8 — Item mostra o id, não o nome ⚠️ · art. 10.º n.º 1 c) (P1/P2)
O template imprime `item.itemsId` na coluna "Item" em vez do nome legível.
- **Evidência:** [credit-note-template.tsx:67](../src/components/common/dynamic-drawer/templates/credit-note-template.tsx#L67).

### Gap 9 — Adiantamentos ⚠️ · art. 8.º n.º 10 (a confirmar)
Não existe tipo "factura adiantamento" no frontend. Se o negócio emitir adiantamentos, falta a sua
regularização por NC; caso contrário, é N/A. **A confirmar com o negócio.**

### Gap 10 — Exceção de anulação direta parcial ⚠️ · art. 8.º n.os 8-9 (P2)
O cancelamento direto sem NC está corretamente restrito a `DRAFT` (cobre o n.º 9 — não enviadas). Falta o
caso do n.º 8 (corrigir **apenas** dados de identificação via função do sistema, sem NC) e o modal não
regista o motivo.
- **Evidência:** [cancel-invoice-modal.tsx](../src/components/client/documents/modals/cancel-invoice-modal.tsx) (sem motivo; mostra `clientId` na linha 61).

---

## 5. O que já cumpre ✅
- **Identificação do documento original** (art. 8.º n.º 5): NC sempre contra `invoiceId` (rota, endpoint `POST /credit-note/{id}/correction` em [invoice-service.ts:24-25](../src/services/invoice-service.ts#L24-L25), "Ref. da factura" no template).
- **NC distinta da fatura** (art. 3.º e)): estrutura própria de rota/tipos/lista/template.
- **Cliente imutável**: o form força o cliente do original ([credfit-notes-form.tsx:111-119](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L111-L119)).
- **NC só reduz valor** (art. 3.º l)): crédito = `max(0, original − corrigido)` ([credit-note-correction.ts:66](../src/utils/credit-note-correction.ts#L66)) + bloqueio de total > original ([credfit-notes-form.tsx:157-163](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L157-L163)).
- **Anulação direta restrita a `DRAFT`** (art. 8.º n.º 9), **língua portuguesa**, **data de emissão** e **itens com quantidades** (art. 10.º n.º 1 c/h/i).

---

## 6. Backlog priorizado
| Prioridade | Itens |
|---|---|
| **P0 — crítico legal** | A1 (conhecimento), A2 (managerBarcode), M1 (motivo obrigatório), A5 (NC p/ faturas não pagas) |
| **P1 — alinhamento legal** | A3 (motivos), M2 (terminologia), A4 (imposto por item), M4 (no-op/preço), M3 (nome do item) |
| **P2 — robustez/UX** | Gap 10 (motivo no cancelamento + clientId), M5 (copy), dead code, typo, coerência do filtro DISCOUNT, A6 (adiantamento — a confirmar) |

---

## Apêndice — backend / PDF legal (a confirmar com a equipa)
Requisitos que a NC deve conter (**art. 10.º n.º 5**: tudo o do art. 10.º n.º 1 **exceto** a alínea g),
data/hora/local), mas que dependem do **gerador do PDF / backend** e não são verificáveis neste repo:

| Artigo | Requisito |
|---|---|
| 10.º n.º 1 a) | Nome, NIF e sede do **fornecedor e do adquirente** |
| 10.º n.º 1 b) | Numeração sequencial e cronológica por tipo + **série** + **ano económico** |
| 10.º n.º 1 d) | Preço unitário e total em moeda nacional + **valor por extenso** |
| 10.º n.º 1 f) | Motivo/norma legal da **não liquidação** do imposto, quando aplicável |
| 10.º n.º 1 j) | Identificação do **software validado pela AGT**, código **hash**, gráfica e **n.º de certificação** |
| 7.º / 17.º / 25.º | Software certificado, comunicação à AGT, SAF-T; **bloqueio de emissão** se falha de comunicação > 60 dias (art. 17.º n.º 5) |

> O download do PDF usa `/credit-note/{id}/download-pdf` ([download-invoice-service.ts](../src/services/download-invoice-service.ts)) — é nesse PDF gerado no backend que estes campos legais têm de constar. **Recomenda-se validar com a equipa de backend** que o PDF da NC inclui todos os itens acima.

---

*Complementa a análise técnica geral em [credit-notes-investigation.md](./credit-notes-investigation.md).*
