# Relatório de Conformidade — Notas de Crédito vs. Decreto Presidencial n.º 71/25

> Cruza, requisito a requisito, o que o **Decreto Presidencial n.º 71/25** exige para notas de
> crédito (NC) com o que o **frontend do MindGest** faz hoje.
>
> **Âmbito:** apenas o que é **verificável neste repositório frontend**. Requisitos puramente
> server-side / de layout do PDF legal (hash, certificação AGT, série, ano económico, valor por
> extenso, dados do fornecedor, numeração sequencial) estão no [Apêndice](#apêndice--fora-de-âmbito-a-confirmar-no-backend), não no corpo.
>
> **Complementa:** [credit-notes-investigation.md](./credit-notes-investigation.md) (análise técnica geral do fluxo).
>
> Data: 2026-06-18 · Legenda: ✅ cumpre · ⚠️ parcial / a melhorar · ❌ não cumpre

---

## 1. Veredicto executivo

| Área | Estado |
|---|---|
| Vínculo ao documento original / rastreabilidade | ✅ |
| Direção do crédito (só reduz valor) | ✅ |
| Cliente imutável face ao original | ✅ |
| **Conhecimento do adquirente (secção 4 do decreto)** | ❌ **inexistente** |
| **Autorização do gerente (managerBarcode)** | ❌ **enviado mas nunca capturado** |
| Justificação obrigatória | ⚠️ opcional |
| Cobertura de motivos (devolução/desconto/variação) | ⚠️ só 2 motivos |
| Caminho de NC para faturas emitidas-não-pagas | ⚠️ só faturas PAID |
| Terminologia «anulação»/«rectificação» | ⚠️ inconsistente |
| Impostos por item | ⚠️ taxa global única |

**Resumo:** a **base mecânica está correta** (a NC refere o original, só reduz valor, mantém o
cliente). Os desvios sérios face ao decreto são **dois requisitos legais ausentes no frontend** —
a **prova de conhecimento do cliente** e a **autorização do gerente** (que é enviada mas nunca
recolhida) — e um conjunto de **alinhamentos parciais** (justificação opcional, poucos motivos,
NC limitada a faturas pagas, terminologia). Nenhum bloqueia a emissão, mas em conjunto deixam o
fluxo **aquém do exigido** pelo Decreto 71/25.

---

## 2. Matriz de conformidade por secção do decreto

### Secção 1 — Definição e enquadramento

| Requisito | Estado no frontend | Classe |
|---|---|---|
| NC é documento distinto, **não é fatura** | Rota, tipos, lista e template próprios; nunca substitui a fatura | ✅ |
| Finalidade: anular/retificar fatura anterior | Dois caminhos: `CORRECTION` e `ANNULMENT` | ✅ |
| Emitir quando a operação deixa de ter lugar **ou** o valor é reduzido (devoluções, variação de serviço, descontos) | Só "Correção" genérica e "Anulação Total"; **sem motivos de devolução/desconto/variação** | ⚠️ |

### Secção 2 — Regras de emissão e de negócio

| Requisito | Estado no frontend | Classe |
|---|---|---|
| Faturas só anuladas/retificadas **via NC** | Faturas **PAID** → "Emitir Nota"; faturas emitidas **não pagas** não têm caminho de NC (só "Gerar Recibo") — ver [Gap 4](#gap-4--nc-só-disponível-para-faturas-pagas) | ⚠️ |
| **Justificação obrigatória** do motivo | `reason` (enum) sempre definido, mas a justificação em texto (`notes`) é **opcional** | ⚠️ |
| Expressão **«anulação»/«rectificação»** explícita | Termos inconsistentes ("Correção" vs «rectificação»; "Anulação Total"/"Cancelamento" vs «anulação») | ⚠️ |
| **Rastreabilidade** do documento original | `invoiceId` na rota + endpoint + "Ref. da factura" no template | ✅ |
| Faturas de **adiantamento** regularizadas via NC | Sem fluxo específico de adiantamento no frontend | ⚠️ |

### Secção 3 — Requisitos estruturais (campos) — *parte verificável no frontend*

| Requisito | Estado no frontend | Classe |
|---|---|---|
| **Discriminação de itens com quantidades** | Presente, mas o template mostra `itemsId` (id) em vez do **nome** do item | ⚠️ |
| Preço unitário e total em moeda nacional | `formatCurrency` em todo o lado | ✅ |
| **Taxas de imposto aplicáveis e montante** | IVA tratado como **taxa global única**, sem taxa por item | ⚠️ |
| **Língua portuguesa** + data de emissão | Sim | ✅ |
| *(hash, certificação, série, ano económico, valor por extenso, dados do fornecedor)* | **Fora de âmbito** → [Apêndice](#apêndice--fora-de-âmbito-a-confirmar-no-backend) | — |

### Secção 4 — Validação do conhecimento do cliente

| Requisito | Estado no frontend | Classe |
|---|---|---|
| Anexar **prova de que o adquirente tomou conhecimento** | **Inexistente** | ❌ |
| Confirmação **eletrónica** pelo adquirente | Inexistente | ❌ |
| Validação **offline** (carta/e-mail/assinatura+NIF/carimbo) | Inexistente | ❌ |
| Presunção legal (cliente regulariza o imposto) | Não modelado | ❌ |

### Secção 5 — Exceções (anular sem emitir NC)

| Requisito | Estado no frontend | Classe |
|---|---|---|
| Anulação direta permitida só p/ fatura **não distribuída** | Cancelamento direto exposto **só para `DRAFT`** (≈ não distribuída) — alinhamento razoável | ⚠️ |
| Anulação direta p/ **erro só nos dados de identificação** | Não há caminho dedicado; o form manda corrigir o cliente em `/clients` e reemitir | ⚠️ |
| Cancelamento captura/regista motivo | Não captura motivo no modal | ⚠️ |

---

## 3. Gaps detalhados

### Gap 1 — Conhecimento do cliente totalmente ausente ❌ (P0)
O decreto (secção 4) exige **prova de que o adquirente tomou conhecimento** da anulação/retificação,
por via eletrónica ou offline. Nada disto existe no fluxo: nem campo de confirmação, nem upload de
prova, nem estado "pendente de confirmação do cliente". É o desvio legal mais relevante.
- **Evidência:** sem ocorrências de "conhecimento"/acknowledgment no fluxo de NC.

### Gap 2 — Autorização do gerente enviada mas nunca recolhida ❌ (P0)
O payload de anulação inclui `managerBarcode`, mas **não existe nenhum input na UI** que o preencha —
vai **sempre vazio**. Para comparação, a abertura de POS exige-o (`min(1)`).
- **Evidência:** [credfit-notes-form.tsx:154](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L154) envia `data.managerBarcode`; as secções [ReasonNotesSection](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx) e [ClientDocumentSection](../src/components/client/documents/credits-notes/sections/ClientDocumentSection.tsx) **não têm** esse campo; default `""` em [credit-notes.ts:36](../src/utils/credit-notes.ts#L36); schema opcional em [add-credit-note.ts:6](../src/schemas/add-credit-note.ts#L6).

### Gap 3 — Justificação obrigatória não imposta ⚠️ (P0/P1)
O decreto torna a justificação obrigatória. O `reason` (enum) está sempre definido, mas o texto livre
`notes` (a justificação efetiva) é **opcional** no schema — é possível emitir uma NC sem qualquer
descrição do motivo.
- **Evidência:** [add-credit-note.ts:5](../src/schemas/add-credit-note.ts#L5) (`notes: z.string().trim().optional()`).

### Gap 4 — NC só disponível para faturas pagas ⚠️ (P0)
"Emitir Nota" só aparece quando `status === "PAID"`. Uma fatura **emitida e já entregue ao cliente,
mas ainda não paga**, não tem caminho de retificação por NC — só "Gerar Recibo". O decreto exige que
qualquer fatura distribuída só seja retificada **via NC**.
- **Evidência:** [invoice-list.tsx:114-131](../src/components/client/documents/invoice-normal/invoice-list.tsx#L114-L131) (NC só em `PAID`); cancelamento direto só em `DRAFT` em [invoice-list.tsx:94-103](../src/components/client/documents/invoice-normal/invoice-list.tsx#L94-L103).

### Gap 5 — Motivos demasiado genéricos ⚠️ (P1)
O decreto enumera devoluções, descontos e variação de serviço. O sistema só oferece `CORRECTION` e
`ANNULMENT`. Ironicamente, o **filtro** da lista já lista "Desconto" (`DISCOUNT`), mas **não há forma
de criar** uma NC com esse motivo — incoerência.
- **Evidência:** opções de criação em [ReasonNotesSection.tsx:24-29](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx#L24-L29); filtro com `DISCOUNT` em [credit-note-filters.tsx:52-59](../src/components/client/documents/credits-notes/credit-note-filters.tsx#L52-L59).

### Gap 6 — Terminologia «anulação»/«rectificação» inconsistente ⚠️ (P1)
O decreto exige a expressão explícita. O form usa "Correção" e "Anulação Total"; o template de
pré-visualização traduz `ANNULMENT` como **"Cancelamento"**. Falta uniformizar para os termos legais.
- **Evidência:** form [ReasonNotesSection.tsx:26-28](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx#L26-L28); template [credit-note-template.tsx:50](../src/components/common/dynamic-drawer/templates/credit-note-template.tsx#L50).

### Gap 7 — IVA como taxa global única ⚠️ (P1)
A taxa é derivada globalmente (`taxAmount/subtotal`) e aplicada proporcionalmente, assumindo que
**todos os itens têm a mesma taxa**. Se a fatura misturar taxas, o crédito por item fica mal
distribuído face às "taxas de imposto aplicáveis e respetivo montante".
- **Evidência:** [credit-note-correction.ts:30-35](../src/utils/credit-note-correction.ts#L30-L35).

### Gap 8 — Discriminação do item mostra o id, não o nome ⚠️ (P1/P2)
No template, a coluna "Item" imprime `item.itemsId` (o identificador) em vez do nome legível,
enfraquecendo a "discriminação clara dos bens/serviços".
- **Evidência:** [credit-note-template.tsx:67](../src/components/common/dynamic-drawer/templates/credit-note-template.tsx#L67).

### Gap 9 — Exceção de anulação direta parcialmente alinhada ⚠️ (P2)
O cancelamento direto sem NC está corretamente **restrito a `DRAFT`** (≈ "não distribuída"), o que
cobre uma das duas exceções do decreto. Falta o caso "erro **apenas** nos dados de identificação" e o
modal não captura/regista o motivo do cancelamento.
- **Evidência:** [cancel-invoice-modal.tsx](../src/components/client/documents/modals/cancel-invoice-modal.tsx) (sem campo de motivo; mostra `clientId` cru na linha 61).

### Gap 10 — Adiantamentos ⚠️ (a confirmar)
O decreto exige regularizar faturas de adiantamento via NC. Não há fluxo específico de adiantamento no
frontend — confirmar se o conceito existe no sistema.

---

## 4. O que já cumpre ✅

- **Vínculo ao original / rastreabilidade:** NC sempre contra `invoiceId` (rota, endpoint
  `POST /credit-note/{id}/correction` em [invoice-service.ts:24-25](../src/services/invoice-service.ts#L24-L25), e "Ref. da factura" no template).
- **NC distinta da fatura:** estrutura própria de rota/tipos/lista/template.
- **Cliente imutável:** o form força o cliente do documento original via `useEffect` + inputs hidden
  ([credfit-notes-form.tsx:111-119](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L111-L119)).
- **Direção do crédito:** crédito = `max(0, original − corrigido)` ([credit-note-correction.ts:66](../src/utils/credit-note-correction.ts#L66)) e bloqueio de total > original ([credfit-notes-form.tsx:157-163](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L157-L163)).
- **Língua portuguesa**, **data de emissão** e **itens com quantidades** presentes.

### Robustez / qualidade (não estritamente legal)
- Correção "no-op" (crédito 0) não é bloqueada; subir o preço de um item é permitido (sem teto).
- Copy enganadora: "Nota de crédito anulada com sucesso!" quando na verdade **cria** uma NC de anulação ([use-invoice.ts:82](../src/hooks/invoice/use-invoice.ts#L82)).
- Possível código morto: `updateCreditNote` + `useUpdateCreditNote` não ligados ao fluxo.
- Typo no ficheiro `credfit-notes-form.tsx`; `console.log` no handler de erros ([linha 182](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L182)).

---

## 5. Backlog de correção priorizado (fase seguinte)

| Prioridade | Itens |
|---|---|
| **P0 — crítico legal** | Gap 1 (conhecimento do cliente), Gap 2 (capturar managerBarcode), Gap 3 (justificação obrigatória), Gap 4 (NC para faturas não pagas) |
| **P1 — alinhamento legal** | Gap 5 (motivos), Gap 6 (terminologia), Gap 7 (IVA por item), Gap 8 (nome do item), bloquear no-op/subida de preço |
| **P2 — robustez/UX** | Gap 9 (motivo no cancelamento + clientId), copy "anulada", dead code, typo, coerência do filtro DISCOUNT |

---

## Apêndice — fora de âmbito (a confirmar no backend)

Requisitos do decreto **não verificáveis neste repo frontend**, dependentes do backend / gerador do
PDF legal. Não foram avaliados; devem ser confirmados com a equipa de backend:

- Código **hash**, n.º de **certificação** AGT e identificação do software validado.
- **Série**, **ano económico** e **numeração sequencial e cronológica** por tipo de documento.
- **Valor por extenso**.
- Dados cadastrais completos do **fornecedor** (e NIF/endereço do adquirente) no documento legal.
- Dispensa legal de **data/hora/local** de disponibilização (alínea g do art. 10.º).
- Reversão automática de stock/contabilidade na anulação.

> Nota: o download do PDF legal usa `/credit-note/{id}/download-pdf` ([download-invoice-service.ts](../src/services/download-invoice-service.ts)); é nesse PDF gerado no backend que estes campos legais devem constar.
