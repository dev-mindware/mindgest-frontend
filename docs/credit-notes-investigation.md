# Notas de Crédito — Investigação da Implementação

> Documento de análise do fluxo de **notas de crédito** no frontend do MindGest.
> Objetivo: perceber a lógica atual, o que é editável e o que não é, e avaliar se
> está a ser feito da forma correta (do ponto de vista funcional e fiscal).
>
> Data: 2026-06-18

---

## 1. Mapa dos ficheiros envolvidos

| Camada | Ficheiro | Papel |
|---|---|---|
| Rota | [page.tsx](../src/app/(client)/(main)/documents/notes/[invoiceId]/page.tsx) | Recebe `invoiceId` + `invoiceType` (`invoice-normal` \| `invoice-receipt`) |
| Wrapper | [credit-notes.tsx](../src/components/client/documents/credits-notes/credit-notes.tsx) | Faz fetch do documento original e renderiza o form |
| Form | [credfit-notes-form.tsx](../src/components/client/documents/credits-notes/credfit-notes-form.tsx) | Lógica principal: recálculo, submit, validação |
| Secções | [ReasonNotesSection.tsx](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx), [ItemsSummarySection.tsx](../src/components/client/documents/credits-notes/sections/ItemsSummarySection.tsx), [ClientDocumentSection.tsx](../src/components/client/documents/credits-notes/sections/ClientDocumentSection.tsx) | UI por blocos |
| Schema | [add-credit-note.ts](../src/schemas/add-credit-note.ts) | Validação Zod (discriminated union) |
| Cálculo | [credit-note-correction.ts](../src/utils/credit-note-correction.ts) | Calcula o delta a creditar |
| Defaults | [credit-notes.ts](../src/utils/credit-notes.ts) | Mapeia o documento original para os valores iniciais do form |
| Hooks | [use-invoice.ts](../src/hooks/invoice/use-invoice.ts) (`useCreateCreditNote`, `useAnnulationNote`) | Mutations |
| Serviço | [invoice-service.ts](../src/services/invoice-service.ts) | Endpoints HTTP |
| Tipos | [credit-note.ts](../src/types/credit-note.ts), [credit-notes-guards.ts](../src/types/credit-notes-guards.ts) | Tipagem e type guards |
| Testes | [credit-note-correction.test.ts](../tests/unit/utils/credit-note-correction.test.ts) | Cobre só a função de cálculo |

---

## 2. Modelo conceptual — os dois "motivos"

A nota de crédito tem **dois caminhos mutuamente exclusivos**, modelados como uma
*discriminated union* de Zod pelo campo `reason`:

### A. `CORRECTION` (Correção)
- Disponível **apenas para faturas** (`invoice-normal`). Não aparece para faturas-recibo.
- Corrige itens da fatura original: alterar **quantidade**, alterar **preço unitário**,
  **remover** itens, ou **acrescentar** itens do catálogo.
- A nota de crédito gerada representa o **delta** (a diferença a creditar) entre o
  documento original e o documento corrigido.
- Endpoint: `POST /credit-note/{invoiceId}/correction`

### B. `ANNULMENT` (Anulação Total)
- Disponível para faturas **e** faturas-recibo (é a **única** opção para recibos).
- Anula integralmente o documento original. Não envia corpo de itens — só
  `reason`, `notes` e `managerBarcode`.
- Endpoint: `DELETE /credit-note/{invoiceId}/annulment` (com `data` no body).

Seleção do motivo em [ReasonNotesSection.tsx:24-29](../src/components/client/documents/credits-notes/sections/ReasonNotesSection.tsx#L24-L29):
`CORRECTION` só é oferecido quando `isInvoiceDoc === true`.

---

## 3. A lógica de cálculo (o coração da feature)

Tudo passa por [`calculateCreditNoteCorrection`](../src/utils/credit-note-correction.ts).
Recebe os totais **originais** + a lista de **itens corrigidos** e devolve dois blocos:
`invoiceBody` (o documento depois da correção) e `creditNote` (o que vai ser creditado).

```
correctedSubtotal = Σ (qtd_corrigida × preço_corrigido)

taxRate      = taxOriginal      / subtotalOriginal     ← taxa GLOBAL
discountRate = discountOriginal / subtotalOriginal     ← taxa GLOBAL

creditSubtotal = max(0, subtotalOriginal − correctedSubtotal)   ← nunca negativo
creditTax      = creditSubtotal × taxRate
creditTotal    = creditSubtotal × (1 + taxRate − discountRate)
```

Pontos-chave:
- **O crédito é sempre o que se "retira"** ao documento (`max(0, …)`). Logo, uma
  correção só pode **reduzir** valor — nunca pode gerar um crédito negativo.
- A taxa de IVA e de desconto são **derivadas globalmente** do documento original
  (`tax/subtotal`), e depois aplicadas proporcionalmente. **Não há taxa por item.**
- `deltaItems` percorre a **união** de IDs (originais ∪ corrigidos), guardando para
  cada um: preço/qtd/total/IVA original vs. novo. Itens removidos ficam com `quantity: 0`.

O reflexo no form acontece em [credfit-notes-form.tsx:122-140](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L122-L140):
um `useEffect` observa `invoiceBody.items` e reescreve os totais + `creditNote` a cada alteração.

---

## 4. O que é EDITÁVEL e o que NÃO é

| Campo | Editável? | Onde está fixado |
|---|---|---|
| **Motivo** (`reason`) | ✅ Sim (Correção / Anulação) | Select |
| **Cliente** | ❌ Não — forçado ao cliente da fatura original | `useEffect` em [credfit-notes-form.tsx:111-119](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L111-L119) reescreve sempre |
| **Nome do item** | ❌ `readOnly` | [ItemsSummarySection.tsx:129-134](../src/components/client/documents/credits-notes/sections/ItemsSummarySection.tsx#L129-L134) |
| **Quantidade** | ✅ Sim (mínimo 1) | Controller |
| **Preço unitário** | ✅ Sim (≥ 0) | InputCurrency |
| **Acrescentar item do catálogo** | ✅ Sim | Botão "Adicionar" |
| **Remover item** | ✅ Sim | Botão lixo |
| **Data de emissão** | ❌ Não editável — fixada em "hoje" | [credit-notes.ts:24](../src/utils/credit-notes.ts#L24) `new Date().toISOString()` |
| **Subtotal / IVA / Desconto / Total** | ❌ Calculados | `useEffect` de recálculo |
| **Notas** | ✅ Sim | Textarea |
| **Código de barras do gerente** | ✅ Sim (autorização) | `managerBarcode` |

---

## 5. Validações existentes

1. **Schema Zod** ([add-credit-note.ts](../src/schemas/add-credit-note.ts)):
   - Cliente: `id` obrigatório ("Seleccione um cliente registado").
   - Itens: pelo menos 1 (`min(1)`), `quantity` positiva, `price` positivo.
   - `issueDate` tem de ser uma data válida; `dueDate` opcional.
2. **Regra de negócio no submit** ([credfit-notes-form.tsx:157-163](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L157-L163)):
   - `invoiceBody.total` não pode exceder o total original (+0,01 de tolerância).
     → impede uma "correção" que aumente o valor.
3. **Anti-duplicação de itens**: não deixa adicionar um item que já está na lista
   ([ItemsSummarySection.tsx:54-66](../src/components/client/documents/credits-notes/sections/ItemsSummarySection.tsx#L54-L66)).

---

## 6. Avaliação — está a ser feito da forma certa?

### ✅ O que está bem
- **Direção do crédito correta**: o crédito é sempre `max(0, original − corrigido)` e
  o submit bloqueia totais acima do original. Fiscalmente, uma nota de crédito só deve
  **reduzir** valor — esta regra está respeitada.
- **Referência ao documento original**: a nota é sempre emitida contra um `invoiceId`
  concreto (na URL e no endpoint). Boa rastreabilidade.
- **Cliente imutável**: não é possível trocar o cliente da nota face à fatura. Correto.
- **Separação Correção vs. Anulação** via discriminated union — limpo e seguro de tipos.
- **Lógica de cálculo isolada e testada** em [credit-note-correction.test.ts](../tests/unit/utils/credit-note-correction.test.ts).

### ⚠️ Pontos a investigar / riscos

1. **Taxa de IVA única e global (provavelmente o maior risco fiscal).**
   `taxRate = taxOriginal / subtotalOriginal` assume que **todos os itens têm a mesma
   taxa de IVA**. Se a fatura misturar taxas (ex.: 14% + isento), o crédito por item
   fica mal distribuído. Verificar:
   - O backend valida/recalcula o IVA por item, ou confia no que o frontend envia?
   - As faturas deste ERP podem ter itens com taxas diferentes? (Angola/AGT)

2. **"Correção" permite ACRESCENTAR itens** ([ItemsSummarySection.tsx:68-79](../src/components/client/documents/credits-notes/sections/ItemsSummarySection.tsx#L68-L79)).
   Uma nota de crédito que adiciona itens é conceptualmente estranha — só "passa" se,
   no total, ainda reduzir o valor. Confirmar se o domínio fiscal permite isto ou se
   acrescentar itens devia ser uma **nota de débito** / nova fatura, não uma nota de crédito.

3. **Permite "correção" de valor zero (no-op).**
   Não há validação de que `creditNote.total > 0`. É possível submeter uma correção sem
   alterar nada e emitir uma nota de crédito de valor 0. Devia bloquear-se.

4. **Aumentar o preço de um item é permitido.**
   `price` só valida `> 0`, sem limite superior. Pode-se subir o preço de um item desde
   que o total global continue ≤ original. Para uma nota de crédito, faz pouco sentido.

5. **`deltaItems` envia TODOS os itens** (incluindo os que não mudaram, com delta 0).
   Confirmar se o backend espera só os itens efetivamente alterados — senão a nota de
   crédito pode registar linhas a crédito 0.

6. **`managerBarcode` (autorização do gerente) é sempre opcional.**
   No schema nunca é obrigatório, nem para anulação. Se a anulação total exige aprovação
   de um gerente, isto devia ser obrigatório no caminho `ANNULMENT`.

7. **Inconsistência nos motivos.**
   O tipo de filtros [credit-note.ts:103](../src/types/credit-note.ts#L103) prevê
   `CORRECTION | RETURN | DISCOUNT | ANNULMENT`, mas o form só cria `CORRECTION` e
   `ANNULMENT`. `RETURN`/`DISCOUNT` ou são legados ou estão por implementar.

8. **Mensagem de sucesso enganadora.**
   `useAnnulationNote` mostra *"Nota de crédito anulada com sucesso!"*
   ([use-invoice.ts:82](../src/hooks/invoice/use-invoice.ts#L82)), mas a ação **cria** uma
   nota de crédito de anulação — não anula uma nota. Devia ser "Documento anulado".

9. **Código possivelmente morto / inconsistente.**
   - [credit-notes-service.ts](../src/services/credit-notes-service.ts) (`updateCreditNote` → `PUT /invoice/normal/:id`)
     e `useUpdateCreditNote` existem mas **não parecem ligados** ao form atual.
   - Typo no nome do ficheiro: `credfit-notes-form.tsx`.
   - `console.log` de erros de validação deixado em [credfit-notes-form.tsx:182](../src/components/client/documents/credits-notes/credfit-notes-form.tsx#L182).

---

## 7. Perguntas a confirmar com o backend / regras fiscais (AGT)

- [ ] O IVA por item é recalculado no backend ou é confiado o valor do frontend?
- [ ] Podem existir, na mesma fatura, itens com taxas de IVA diferentes?
- [ ] Acrescentar itens numa nota de crédito é legalmente aceitável neste contexto?
- [ ] A nota de crédito de anulação reverte stock e movimentos contabilísticos automaticamente?
- [ ] A anulação total exige autorização de gerente (`managerBarcode` obrigatório)?
- [ ] A série/numeração da nota de crédito é atribuída pelo backend (SAF-T)?
- [ ] Os motivos `RETURN` / `DISCOUNT` devem ser suportados na emissão?

---

## 8. Resumo executivo

A mecânica base **está correta na direção** (crédito = redução, referência ao original,
cliente fixo, cálculo isolado e testado). Os riscos concentram-se em **dois pontos
fiscais**: (1) a **taxa de IVA tratada como global/única** e (2) a possibilidade de
**acrescentar itens e/ou subir preços** numa nota de crédito. Estes dois é que merecem
confirmação com as regras da AGT e com o comportamento do backend antes de se considerar
o fluxo "fiscalmente correto". O resto são melhorias de robustez (bloquear no-op,
managerBarcode obrigatório na anulação, copy, limpeza de código morto).
