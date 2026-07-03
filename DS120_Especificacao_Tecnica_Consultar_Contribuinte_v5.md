# DS.120 — Especificação Técnica de Serviço
**Consultar Dados de Contribuinte – V5**

> **OUM · DS.120 Design Services Construction**
> Serviço de Tecnologias de Informação e Comunicação das Finanças Públicas (SETIC-FP)

| Campo | Valor |
|---|---|
| Data de Criação | Agosto 14, 2025 |
| Última Actualização | Agosto 15, 2025 |
| Referência | Perfil de Produtores de Software |

---

## 1. Controle do Documento

### 1.1 Histórico de Alterações

| Data | Autor | Versão | Comentários |
|---|---|---|---|
| 14/08/2025 | Osvaldo de Jesus / Pedro Domingos | 5.0.1 | Criação do Documento. |

### 1.2 Revisores

| Nome | Cargo |
|---|---|
| Eduardo Cordeiro Alves | Lider de Equipa de Integração de Sistemas |

---

## 2. Introdução

Este documento tem como objectivo apresentar a estratégia de análise técnica de integração através de uma visão lógica de componentes e de infraestrutura, tomando como base a especificação funcional da integração fornecida. Descreve também as estruturas de dados de entrada/saída das interfaces, quais suas políticas de segurança, suas características e limitações e tecnologias utilizadas na implementação. As informações contidas neste documento servem de referência para as equipes de desenvolvimento alinhar o entendimento da arquitetura macro estabelecida para o processo de integração.

---

## 3. Escopo

O serviço foi criado para permitir consulta de dados do contribuinte.

O serviço será disponibilizado para consumo de duas maneiras:

- **WebService SOAP** disponibilizado no barramento de serviço OSB via proxy service HTTPS com autenticação de segurança via OWSM.
- **WebService REST** disponibilizado no barramento de serviço OSB via proxy service HTTPS com autenticação de segurança via OWSM.

### 3.1 Objetivo

Fornecer os recursos necessários para satisfazer as seguintes necessidades dos produtores de Software:

- Consultar dados do contribuinte.

### 3.2 Definições, Acrônicos e Abreviaturas

**Tecnologia:** A interface será construída utilizando o conceito de Arquitetura Baseado em Serviço (SOA).

| Sigla / Termo | Descrição |
|---|---|
| **BPEL PM (BPEL)** | *Business Process Execution Language Process Manager* é o padrão para uma linguagem executável que permite especificar mecanismos de interação utilizando Web Services. BPEL PM é o produto Oracle (BPEL Process Manager) responsável por executar programas na linguagem BPEL. |
| **CAE** | *Código de Actividade Económica* é o código da actividade que a entidade está autorizada a executar. |
| **Endpoint** | É o endereço físico de um provedor ou consumidor de serviço. No caso de uma interface exposta pelo Service Bus, indica o caminho relativo dentro daquele ambiente. Quando o endPoint é cadastrado em um Business Service, indica o caminho completo do provedor de serviço (e.g. `http://osb.minfin.co.ao/taxa`). |
| **ESS** | *Enterprise Scheduler Service*, funcionalidade do fusion application para scheduler de aplicações. |
| **MDS** | Sigla de *MetaData Service*, banco de dados utilizado pela plataforma SOA para retenção de informações – composites instalados, fault policies, XML schemas, WSDLs, entre outros. |
| **OSB** | Oracle Service Bus — Barramento de serviços da Oracle. |
| **OWSM** | Oracle Web Services Manager, produto do pacote SOA Suite que oferece uma estrutura para gerenciamento de políticas de segurança de serviços de forma centralizada. |
| **Pipeline** | Agrupa os stages dentro de um proxy, separando-os em pipeline de request e response – as ações do pipeline de request são executadas antes da chamada ao provedor de serviço (validação e transformação, por exemplo). No response pipeline podemos manipular a resposta recebida do provedor de serviço, antes de enviá-la ao consumidor original. |
| **Proxy Service** | Um serviço exposto pelo barramento sempre será do tipo "proxy service". O proxy é o ponto onde as instruções necessárias para processamento de uma requisição de entrada são codificadas – transformações e validações, por exemplo — dentro de seu pipeline. |
| **SOA** | Estratégia para a construção de sistemas de software com foco no negócio a partir de serviços interoperáveis e com baixo acoplamento, que podem ser combinados e reutilizados de forma ágil dentro ou entre corporações, para atender às necessidades de negócio. |
| **SOAP** | *Simple Object Access Protocol*, é a especificação de um protocolo para troca de informações de forma estruturada, utilizado pelas implementações de Web Services. |
| **SIFP** | Sistema Integrado das Finanças Públicas. |
| **Transporte** | É o termo utilizado para descrever a forma como uma requisição é recebida pelo barramento quando expondo um proxy service, ou como ela deve ser enviada a um provedor de serviço no caso de um business service. Alguns transportes entendidos pelo Service Bus: HTTP, JMS, EJB, FTP. |
| **Web Service** | Sistema de software projetado para suportar interoperabilidade entre computadores através de uma rede. |
| **WSDL** | *Web Services Description Language* é uma linguagem baseada em XML utilizada para descrever Web Services funcionando como um contrato do serviço. Trata-se de um documento escrito em XML que, além de descrever o serviço, especifica como acessá-lo e quais as operações estão disponíveis. |

### 3.3 Referências

| Documento | URL |
|---|---|
| EA-075_SOA_REFERENCE_ARCHITECTURE | |
| TA-010_SOA_TECHNICAL_GUIDE | |
| ISIGT - Levantamento das informações dos Serviços | |
| SIGT – BP Serviço Consulta NIF_v.14 (AGT) | |

---

## 4. Contribuinte

### 4.1 Obter

#### 4.1.1 Interface do Serviço

##### SOAP

**Endpoint:**
```
https://sifphml.minfin.gov.ao/sigt/contribuinte/consultarNIF/ws/v5?WSDL
```

**Request Exemplo:**
```xml
<v5:ObterContribuinteRequest>
  <v5:tipoDocumento>string</v5:tipoDocumento>
  <v5:numeroDocumento>string</v5:numeroDocumento>
</v5:ObterContribuinteRequest>
```

**Response Exemplo:**
```xml
<ns0:ObterContribuinteResponse>
  <ns0:ObterContribuinte>
    <ns0:mensagem>Consulta realizada com sucesso.</ns0:mensagem>
    <ns0:contribuinte>
      <Q2:numeroNIF>string</Q2:numeroNIF>
      <Q2:nome>string</Q2:nome>
      <Q2:tipoContribuinte>string</Q2:tipoContribuinte>
      <Q2:estadoContribuinte>string</Q2:estadoContribuinte>
      <Q2:regimeIva>string</Q2:regimeIva>
      <Q2:indicadorNaoResidente>string</Q2:indicadorNaoResidente>
    </ns0:contribuinte>
  </ns0:ObterContribuinte>
</ns0:ObterContribuinteResponse>
```

##### REST

**Endpoint:**
```
https://sifphml.minfin.gov.ao/sigt/contribuinte/consultarNIF/v5/obter?tipoDocumento=<parametro>&numeroDocumento=<parametro>
```

**Response Exemplo (`Accept: application/json`):**
```json
{
  "ObterContribuinte": {
    "mensagem": "string",
    "contribuinte": {
      "numeroNIF": "string",
      "nome": "string",
      "tipoContribuinte": "string",
      "estadoContribuinte": "string",
      "regimeIva": "string",
      "indicadorNaoResidente": "boolean"
    }
  }
}
```

#### 4.1.2 Tipo de Comunicação

- [x] Síncrono
- [ ] Assíncrono
- [ ] One Way

#### 4.1.3 Protocolo de Transporte

HTTPS

#### 4.1.4 Formato da Mensagem

SOAP e REST

#### 4.1.5 Parâmetros de Cabeçalho

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| Username | String | S | Identificador do Usuário que invocou o serviço. |
| Password | String | S | Token de acesso ao serviço. |

#### 4.1.6 Parâmetros de Entrada

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| tipoDocumento | String | S | Tipo de documento: `NIF` – Número identificação fiscal; `AID` – Bilhete de Identidade; `REF` – Cartão de refugiado; `RES` – Cartão de residente; `BCER` – Certidão de Nascimento; `PASS` – Passaporte; `FID` – Identificação de Cidadão Estrangeiro; `ONIF` – Número de Identificação Fiscal Antigo (NIF já descontinuado); `OTHR` – Outro tipo de Identificação. |
| numeroDocumento | String | S | Número de documento. |

#### 4.1.7 Parâmetros de Saída

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| mensagem | String | S | Resultado execução da consulta. |
| Contribuinte | ContribuinteConsultar | S | Objecto de retorno com os dados do contribuinte. |
| &nbsp;&nbsp;numeroNIF | String | S | NIF do contribuinte. |
| &nbsp;&nbsp;tipoContribuinte | String | S | Tipo de contribuinte de acordo a tipologia anterior ao decreto 366/17: `COLLECTIVE` ou `SINGULAR`. |
| &nbsp;&nbsp;nome | String | S | Denominação do contribuinte. |
| &nbsp;&nbsp;estadoContribuinte | String | S | Estado do contribuinte: `A` – Ativo; `C` – Cessado; `D` – Falecido; `E` – Herança; `F` – Anulado; `G` – Suspenso. |
| &nbsp;&nbsp;regimeIva | String | S | Valores possíveis do IVA: `GNAD` – Regime Geral; `TRAG` – Regime Transitório (descontinuado); `SIMP` – Regime Simplificado; `NBND` – Regime de Não Sujeição (descontinuado); `EXCL` – Regime de Exclusão. O Regime Transitório passa a ser utilizado a partir de 31/01/2021 só para situações temporárias relativas a registos oficiosos. O Regime de Não Sujeição a partir de 31/01/2021 só poderá aparecer para situações de actividade de IVA cessada. |

---

### 4.2 Listar

#### 4.2.1 Interface do Serviço

##### SOAP

**Endpoint:**
```
https://sifphml.minfin.gov.ao/sigt/contribuinte/consultarNIF/ws/v5?WSDL
```

**Request Exemplo:**
```xml
<v5:ListarContribuinteRequest>
  <v5:dataInicio>2018-09-03</v5:dataInicio>
  <v5:dataFim>2018-09-03</v5:dataFim>
</v5:ListarContribuinteRequest>
```

**Response Exemplo:**
```xml
<ns0:ListarContribuinteResponse>
  <ns0:mensagem>Consulta realizada com sucesso.</ns0:mensagem>
  <ns0:ListarContribuinte>
    <ns0:dataOperacao>2018-09-03</ns0:dataOperacao>
    <ns0:numeroNIF>string</ns0:numeroNIF>
    <ns0:nomeContribuinte>string</ns0:nomeContribuinte>
    <ns0:estadoContribuinte>A</ns0:estadoContribuinte>
    <ns0:tipoContribuinte>string</ns0:tipoContribuinte>
    <ns0:operacao>ACTUALIZACAO</ns0:operacao>
  </ns0:ListarContribuinte>
  <ns0:ListarContribuinte>
    <ns0:dataOperacao>2018-09-03</ns0:dataOperacao>
    <ns0:numeroNIF>string</ns0:numeroNIF>
    <ns0:nomeContribuinte>string</ns0:nomeContribuinte>
    <ns0:estadoContribuinte>A</ns0:estadoContribuinte>
    <ns0:tipoContribuinte>string</ns0:tipoContribuinte>
    <ns0:operacao>ACTUALIZACAO</ns0:operacao>
  </ns0:ListarContribuinte>
</ns0:ListarContribuinteResponse>
```

##### REST

**Endpoint:**
```
https://sifphml.minfin.gov.ao/sigt/contribuinte/consultarNIF/v5/listar?dataInicio=<parametro>&dataFim=<parametro>
```

**Response Exemplo (`Accept: application/json`):**
```json
{
  "mensagem": "Consulta realizada com sucesso.",
  "ListarContribuinte": [
    {
      "dataOperacao": "2018-09-03",
      "numeroNIF": "string",
      "nomeContribuinte": "string",
      "estadoContribuinte": "A",
      "tipoContribuinte": "string",
      "operacao": "ACTUALIZACAO"
    },
    {
      "dataOperacao": "2018-09-03",
      "numeroNIF": "string",
      "nomeContribuinte": "string",
      "estadoContribuinte": "A",
      "tipoContribuinte": "string",
      "operacao": "ACTUALIZACAO"
    }
  ]
}
```

**Response Exemplo (`Accept: application/xml`):**
```xml
<ns0:ListarContribuinteResponse>
  <ns0:mensagem>Consulta realizada com sucesso.</ns0:mensagem>
  <ns0:ListarContribuinte>
    <ns0:numeroNIF>string</ns0:numeroNIF>
    <ns0:nomeContribuinte>string</ns0:nomeContribuinte>
    <ns0:estadoContribuinte>A</ns0:estadoContribuinte>
    <ns0:tipoContribuinte>string</ns0:tipoContribuinte>
    <ns0:operacao>ACTUALIZACAO</ns0:operacao>
    <ns0:dataOperacao>2018-09-03</ns0:dataOperacao>
  </ns0:ListarContribuinte>
  <ns0:ListarContribuinte>
    <ns0:numeroNIF>string</ns0:numeroNIF>
    <ns0:nomeContribuinte>string</ns0:nomeContribuinte>
    <ns0:estadoContribuinte>A</ns0:estadoContribuinte>
    <ns0:tipoContribuinte>string</ns0:tipoContribuinte>
    <ns0:operacao>ACTUALIZACAO</ns0:operacao>
    <ns0:dataOperacao>2018-09-03</ns0:dataOperacao>
  </ns0:ListarContribuinte>
</ns0:ListarContribuinteResponse>
```

#### 4.2.2 Tipo de Comunicação

- [x] Síncrono
- [ ] Assíncrono
- [ ] One Way

#### 4.2.3 Protocolo de Transporte

HTTPS

#### 4.2.4 Formato da Mensagem

SOAP e REST

**Parâmetros de Cabeçalho:**

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| Username | String | S | Identificador do Usuário que invocou o serviço. |
| Password | String | S | Token de acesso ao serviço. |

#### 4.2.5 Parâmetros de Entrada

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| dataInicio | String | S | Data da alteração/cadastro (AAAA-MM-DD). |
| dataFim | String | S | Data da alteração/cadastro (AAAA-MM-DD). \*\*D-1 — Período inferior a 30 dias. |

#### 4.2.6 Parâmetros de Saída

| Nome | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| mensagem | String | S | Resultado execução da consulta. |
| ListaItemListaNifs | Array | S | Array de linhas de NIFs. |
| &nbsp;&nbsp;ItemListaNif | ItemNifs | N | Item da lista de NIFs. |
| &nbsp;&nbsp;&nbsp;&nbsp;numeroNif | String | S | Numero NIF. |
| &nbsp;&nbsp;&nbsp;&nbsp;nomeContribuinte | String | S | Nome do contribuinte. |
| &nbsp;&nbsp;&nbsp;&nbsp;estadoContribuinte | String | S | Estado do contribuinte: `A` – Ativo; `C` – Cessado; `D` – Falecido; `E` – Herança; `F` – Anulado; `G` – Suspenso. |
| &nbsp;&nbsp;&nbsp;&nbsp;tipoContribuinte | String | S | Tipo de contribuinte de acordo a tipologia anterior ao decreto 366/17: `SINGULAR` ou `COLLECTIVE`. |
| &nbsp;&nbsp;&nbsp;&nbsp;operacao | String | S | Operação efectuada. |
| &nbsp;&nbsp;&nbsp;&nbsp;dataOperacao | Date | S | Data da operação. |

#### 4.2.7 Limitação de Operações

À luz das normas estatuídas nos instrumentos jurídicos abaixo mencionados:

- a) Decreto Presidencial n.º 66/11, de 18 de Abril, Medidas Excepcionais de Controlo de Contribuintes em Circunstância de Irregularidade Reiterada;
- b) Decreto Executivo n.º 111/16, de 1 de Março, Atribui competência a AGT, com periodicidade trimestral a elaboração e o envio de uma lista onde constam os contribuintes em situação de irregularidade fiscal;
- c) Decreto Executivo n.º 366/17, de 27 de Julho, Regime Jurídico do Número de Contribuinte.

Os estados de **Cessado**, **Falecido**, **Anulado** e **Suspenso** previstos para o campo estado do contribuinte, indicam aplicação de restrições ou limitação na esfera jurídica do contribuinte singular, colectivo ou entidade equiparada. Nesta conformidade as instituições públicas e entidades privadas deverão garantir o cumprimento e aplicação das restrições seguintes:

1. Limitação ou impossibilidade de realizar operações financeiras ou operações bancárias, tais como: abertura de conta bancária, compra de moedas estrangeiras, transferências ou pagamento sobre o exterior, aplicações nos mercados regulamentados ou de capitais, etc.
2. Limitação ou impossibilidade de emitir facturas e documentos equivalentes.
3. Limitação ou impossibilidade de licenciar facturas para realização de operações de importações ou exportações.
4. Limitação ou impossibilidade de realização de operações aduaneiras, importação ou exportação, participação em leilão, etc.
5. Limitação ou impossibilidade de licenciar junto de órgãos públicos actividade (sejam elas lucrativas ou não) para efeito de obtenção de qualquer tipo de alvarás, licenças, título ou autorização oficial.
6. Limitação ou impossibilidade de receber qualquer liquidação ou pagamentos pelo Estado, por serviços prestados ou bens vendidos.
7. Limitação ou impossibilidade de requerer a Emissão, Concessão ou Renovação de Vistos de Trabalho a um expatriado ou ainda solicitar a emissão do título de residência temporária ou permanente.
8. Limitação ou impossibilidade na utilização e acesso dos portais públicos (SIGFE, SEPE, Portal da Contratação Pública, etc.).
9. Limitação ou impossibilidade de realizar os demais actos que nos termos da lei seja obrigatória a menção do Número de Identificação Fiscal.

**Nota:**

- a) As restrições acima referidas não são aplicadas apenas se forem para liquidação e pagamentos devidos de tributos aos cofres do Estado.
- b) Os estados cessados (para pessoas colectivas e entidades equiparadas), falecidos (para singulares) e Anulado (para ambos), em regra representam extinção ou morte da pessoa jurídica bem como cancelamento daquele cadastro ou NIF do Registo Geral de Contribuinte.
- c) O estado suspenso (oficiosamente ou sem actividade) representa o estado transitório e aplicado aos contribuintes que estejam em incumprimento tributário ou tenham cometido qualquer irregularidade fiscal. Este estado pode evoluir a qualquer momento para activo quando o contribuinte regularize a sua situação junto da AGT, ou para uns dos estados referidos na alínea b).

> Recomenda-se que órgãos públicos e privados adaptem os seus sistemas informáticos, a fim de os mesmos possam interpretar os estados acima referidos e apliquem as restrições inerentes de acordo com sua área de actuação.

---

### 4.3 Tipo de Processamento

- [x] Online
- [ ] Batch

#### 4.3.8 Requisitos de QoS

| Parâmetro | Valor |
|---|---|
| Throughput estimado | 100 acessos por dia |
| Tamanho da mensagem | 750 kbytes |
| Disponibilidade | 99% de 24x7 |

#### 4.3.9 Indisponibilidade do Serviço

Entrar em contato com a equipe responsável pelo serviço.

#### 4.3.10 Suporte para Compensação de Transação

Entrar em contato com a equipe técnica responsável pelo serviço, enviar o número de Protocolo para identificar em qual camada ocorreu o erro. O fusion middleware tem a funcionalidade de executar recovery de instâncias com erro ou até mesmo reprocessamento manual.

#### 4.3.11 Segurança

| Necessita de Segurança? | Detalhes |
|---|---|
| **SIM** | Autenticação: **Sim** / Autorização: **Sim** / Criptografia: Não |

#### 4.3.12 Serviços Relacionados

Não aplicável.

#### 4.3.13 Schedule Serviço

Não aplicável.

#### 4.3.14 Notificações

Correio electrónico destino das notificações de erro, pessoa ou área a ser notificada em caso de erro:

- [sifp@minfin.gov.ao](mailto:sifp@minfin.gov.ao)

---

## 5. Gerenciamento e Registro

### 5.1 Monitoramento e Execução de SLA

Não haverá monitoramento de SLAs.

### 5.2 Gerenciamento de Exceção

Não existem ações automáticas a serem tomadas em caso de falha de SLA ou em caso de situações não esperadas. Em casos de falhas na camada OSB poderá ser executado o reprocessamento manual. Em caso de falhas na camada SOA Suite poderá ser executado o reprocessamento manual (recovery).

### 5.3 Logging

As informações do serviço serão armazenadas em dois momentos:

1. Camada OSB armazenará os dados em arquivos de log default da ferramenta.
2. Camada SOA Suite armazenará os dados nas tabelas de infra-estrutura default da ferramenta.

---

## 6. Infra-Estrutura

Ambiente service BUS e SOA Suite MINFIN.

### 6.1 Infra Necessária

N/A

### 6.2 Deploy/Instalação

Seguir o documento "MD120_Deployment".

---

## 7. Pendências

### 7.1 Abertas

| ID | Pendência | Resolução | Responsável | Data Alvo | Data Impacto |
|---|---|---|---|---|---|
| | | | | | |

### 7.2 Fechadas

| ID | Pendência | Resolução | Responsável | Data Alvo | Data Impacto |
|---|---|---|---|---|---|
| | | | | | |
