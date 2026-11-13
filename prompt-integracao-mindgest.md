# Prompt: integrar o MindGest com o MindPrint

> Colar numa sessão do Claude Code aberta na raiz do repositório do MindGest
> (branch de testes). Tudo o que está abaixo da linha é o prompt.

---

## Contexto

Estás no repositório do **MindGest** (Next.js), o software de gestão e POS da
Mindware (Luanda). Hoje o POS (`/pos/counter`) imprime a **Factura Recibo**
como página HTML com `window.print()`. Nos balcões, o diálogo do Chrome abre,
a impressora térmica USB (Xprinter, 80 mm, ESC/POS) aparece, mas o papel não
sai. Isto é lento e frágil, e não controla o corte nem a gaveta.

Para resolver, criámos o **MindPrint**: um agente local para Windows (Go,
ícone junto ao relógio) que corre no PC do balcão, escuta só em
`http://127.0.0.1:17321` e envia bytes ESC/POS em bruto à impressora (USB pela
fila do Windows, ou rede pela porta 9100). O agente é só um tubo: **não
interpreta os bytes**. O MindGest é que tem de montar o talão em ESC/POS.

A tua tarefa é a parte do MindGest:

1. um cliente TypeScript para a API do agente e um hook `usePrinter()`;
2. o talão da Factura Recibo em ESC/POS, com o mesmo conteúdo legal que o HTML
   actual;
3. ligar o botão Imprimir do POS ao agente, mantendo `window.print()` como
   alternativa;
4. uma área de definições "Impressora" para emparelhar e escolher a impressora.

## Regras de trabalho

- **Primeiro explora, depois apresenta um plano, e só escreves código depois
  de eu aprovar.** No plano, assinala decisões arriscadas.
- Segue as convenções deste repositório (CLAUDE.md, estrutura por features,
  helpers e componentes existentes, Zod + React Hook Form nos formulários,
  estado mínimo). Reutiliza o que já existe antes de criar.
- Código, identificadores e commits em inglês. Textos para o utilizador em
  **português de Angola, ortografia pré-AO90** ("actualização", "selecção",
  "por omissão", "ficheiro", "utilizador", "Factura").
- Nada disto pode correr no servidor: o agente está no PC do utilizador. Só em
  componentes cliente, sem tocar em `window`/`localStorage` durante o SSR.
- Tudo atrás de uma flag `NEXT_PUBLIC_MINDPRINT_ENABLED` (por omissão `false`
  em produção). Com a flag desligada, o comportamento actual fica igual.
- Não alteres a forma como a factura é calculada ou guardada. Só a forma de a
  imprimir.

## O que explorar primeiro

- Onde está o componente/página do talão HTML da Factura Recibo e de onde vêm
  os dados (tipo do objecto da factura, campos disponíveis).
- Onde está o botão Imprimir do POS e o que acontece depois da venda (impressão
  automática? botão "Reimprimir"?).
- Onde ficam as definições do utilizador/loja no MindGest.
- Se `@point-of-sale/receipt-printer-encoder` já está instalado e em que versão.
- Como o projecto guarda preferências no browser e como mostra notificações.

## API do agente MindPrint (contrato estável)

Base: `http://127.0.0.1:17321` (porta configurável; guarda-a nas definições,
por omissão 17321). O browser envia sempre o cabeçalho `Origin`; o agente só
aceita `https://mindgest.mindware.ao`, `https://mindgesttest.mindware.ao` e
`http://localhost:3000`. Pedidos de uma página HTTPS para `http://127.0.0.1`
são permitidos pelo Chrome/Edge (loopback não conta como conteúdo misto), mas
as versões recentes podem pedir ao utilizador autorização para "aceder a
dispositivos na rede local": o utilizador tem de carregar em **Permitir**.

Autenticação: cabeçalho `X-Token: <token>` em `/printers`, `/print` e
`/test-print`.

| Método | Caminho | Token | Corpo | Resposta 200 |
|---|---|---|---|---|
| GET | `/health` | não | — | `{ status: "ok", version: string, paired: boolean }` |
| POST | `/pair` | não | `{ code: "482913" }` (aceita espaços/hífen) | `{ token: string }` |
| GET | `/printers` | sim | — | `{ printers: [{ id, name, type: "windows" \| "tcp", default: boolean }] }` |
| POST | `/print` | sim | `{ printer?: string, data: base64, jobId: string }` | `{ jobId, printer, status: "spooled" \| "sent", duplicate: boolean }` |
| POST | `/test-print` | sim | `{ printer?: string }` ou vazio | `{ printer, status }` |

- `printer`: o `id` devolvido por `/printers` (ex.: `windows:XP-80C`,
  `tcp:192.168.1.50:9100`). Vazio = impressora por omissão do agente.
- `data`: bytes ESC/POS em base64. Corpo máximo 1 MB (≈ 750 KB de dados).
- `jobId`: obrigatório, até 128 caracteres, sem espaços. **O mesmo `jobId` nos
  10 minutos seguintes não volta a imprimir** (responde `duplicate: true`). Usa
  o id do documento na impressão automática (protege contra duplo clique) e um
  `jobId` novo numa reimpressão pedida pelo operador
  (ex.: `${docId}-r${Date.now()}`).
- `status` `spooled`/`sent` quer dizer que o Windows ou a impressora aceitou o
  trabalho, não que o papel saiu.

Emparelhamento: o operador escolhe "Mostrar código de emparelhamento" no ícone
do MindPrint e aparece um código de 6 dígitos (válido 5 minutos, uso único,
anulado após 5 tentativas erradas; `/pair` aceita no máximo 5 pedidos por
minuto). O MindGest envia o código para `/pair` e guarda o token devolvido no
`localStorage` (o token é por browser; Chrome e Edge emparelham em separado).
O agente aceita até 10 tokens.

Erros: `{ "error": { "code": string, "message": string } }`. A `message` já
vem em português e pode ser mostrada ao utilizador. Os `code` são estáveis:

| code | HTTP | O que o MindGest deve fazer |
|---|---|---|
| `ORIGIN_NOT_ALLOWED` | 403 | Erro de configuração: mostrar mensagem e usar `window.print()` |
| `HOST_NOT_ALLOWED` | 403 | Idem |
| `NOT_PAIRED` | 401 | Estado "não emparelhado": pedir emparelhamento |
| `INVALID_TOKEN` | 401 | Apagar o token guardado e pedir emparelhamento |
| `NO_PAIRING_CODE` | 409 | "Peça um código no ícone do MindPrint" |
| `INVALID_CODE` | 401 | Código errado |
| `CODE_EXPIRED` | 410 | Pedir código novo |
| `RATE_LIMITED` | 429 | Aguardar `Retry-After` segundos |
| `INVALID_REQUEST` / `INVALID_DATA` / `PAYLOAD_TOO_LARGE` | 400/413 | Bug do MindGest: registar e usar `window.print()` |
| `INVALID_PRINTER` / `PRINTER_NOT_FOUND` | 400/404 | Impressora escolhida já não existe: pedir nova selecção |
| `NO_DEFAULT_PRINTER` | 400 | Pedir que escolha uma impressora |
| `PRINTER_NOT_ALLOWED` | 403 | Impressora de rede não autorizada |
| `PRINTER_UNREACHABLE` | 504 | Impressora de rede desligada / IP errado |
| `PRINTER_TYPE_UNSUPPORTED` | 501 | Versão do agente antiga |
| `JOB_IN_PROGRESS` | 409 | O mesmo talão já está a imprimir: ignorar |
| `PRINT_FAILED` | 502 | Mostrar mensagem e oferecer "Imprimir pelo browser" |
| `PRINTER_LIST_FAILED` | 500 | Mostrar mensagem |

Se o `fetch` falhar com erro de rede (agente não instalado, parado, ou o
utilizador recusou a autorização de rede local), o estado é "agente
indisponível" e o MindGest usa `window.print()`.

## O que construir

### 1. Cliente e hook

- `mindprintClient`: `health()`, `pair(code)`, `printers()`, `print({ printer,
  data: Uint8Array, jobId })`, `testPrint(printer?)`. Timeouts com
  `AbortController` (≈ 1,5 s no `health`, ≈ 20 s no `print`). Erros tipados
  com o `code` do agente, mais um código próprio para erro de rede
  (`AGENT_UNAVAILABLE`).
- Base64 a partir de `Uint8Array` sem estourar a pilha (por blocos).
- `usePrinter()`: estado (`checking` | `unavailable` | `unpaired` | `ready`),
  versão do agente, lista de impressoras, impressora escolhida (guardada no
  browser), `pair(code)`, `unpair()` (esquece o token local), `print(bytes,
  jobId)`, `testPrint()`, `refresh()`. Verifica o `health` ao montar e quando a
  janela volta a ter foco; não fazer polling agressivo.

### 2. Talão ESC/POS da Factura Recibo

Função pura `buildInvoiceReceipt(invoice, options) => Uint8Array` com
`@point-of-sale/receipt-printer-encoder` (confirma a API no README da versão
instalada; os nomes abaixo são os da v3):

- `language: 'esc-pos'`, 48 colunas para 80 mm (32 para 58 mm, opção nas
  definições), código de página com acentos portugueses (`cp860`, ou a
  detecção automática do encoder; testar "ç ã õ é ê º ª" no papel).
- Conteúdo igual ao talão HTML actual, pela mesma ordem:
  logótipo da empresa (`.image()` a partir de um canvas, a preto e branco,
  largura múltipla de 8, até ~384 px), título "FACTURA RECIBO", n.º do
  documento, data de emissão, período contabilístico, bloco DE (empresa: nome,
  e-mail, telefone, morada, NIF), bloco PARA (cliente e NIF), tabela
  Descrição / Taxa/Imp / Total com a quantidade × preço por baixo, quadro de
  impostos (Imposto/Taxa, Incidência, Valor Imp.), Subtotal, Impostos,
  **TOTAL** (negrito, tamanho duplo), "Emitido por", Notas/Condições de
  Pagamento (com quebra de linha por palavras), **código QR** (`.qrcode()`,
  modelo 2; se a impressora não o suportar, imprimir o QR como imagem), Hash,
  "Processado por programa certificado n.º FE/241/AGT/2026", rodapé com
  contactos, avanço e `cut('partial')`.
- Os campos exigidos pela AGT (hash, n.º de certificação, QR, NIF) têm de sair
  iguais aos do HTML: usa a mesma fonte de dados, não recalcules.
- Valores com o formato do MindGest (ex.: `1 450,00`), alinhados à direita.
- Testes unitários: o texto descodificado do talão contém os campos
  obrigatórios; linhas nunca passam das colunas configuradas.

### 3. Botão Imprimir

- Flag ligada e `usePrinter()` em `ready`: monta os bytes e envia ao agente.
  Mostra "A imprimir…" e depois sucesso ou o `message` do erro.
- Em erro de impressão ou agente indisponível: mantém o fluxo actual
  (`window.print()`) como alternativa, oferecido num botão "Imprimir pelo
  browser" (não abrir o diálogo automaticamente depois de um erro).
- Impressão automática depois da venda: `jobId` = id do documento.
  Reimpressão: `jobId` novo.

### 4. Definições → Impressora

- Estado do agente (instalado / versão / emparelhado), com instrução para
  instalar quando indisponível.
- Emparelhar: campo de 6 dígitos (aceita "482 913"), mensagens para
  `INVALID_CODE`, `CODE_EXPIRED`, `NO_PAIRING_CODE`, `RATE_LIMITED`.
- Lista de impressoras do agente com selecção; "Impressora por omissão do
  agente" como opção.
- Largura do papel (80 mm / 58 mm).
- Botões "Imprimir talão de teste" (usa `/test-print`) e "Imprimir factura de
  exemplo" (usa o talão ESC/POS com dados fictícios).
- "Desligar deste browser" (apaga o token local).

## Verificação

- Lint, typecheck e testes do projecto a passar.
- Teste manual com o agente em modo de teste, sem impressora (no PC de
  desenvolvimento com Go): `go run ./cmd/mindprint -no-tray -fake-printer
  -fake-dir .\tmp\jobs` no repositório do MindPrint; os talões ficam em
  `.\tmp\jobs\*.bin`. Ou com o `mindprint.exe` e a Xprinter real.
- No fim: resumo, lista de ficheiros alterados e passos de teste manual.
