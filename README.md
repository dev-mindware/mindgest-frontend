# MINDGEST FRONTEND

## Descrição do Projeto
O **MindGest** é uma solução avançada de gestão empresarial focada na eficiência operacional, oferecendo ferramentas robustas para faturação, controlo de inventário e gestão de clientes, potencializada por um assistente de Inteligência Artificial.

## Requisitos Funcionais

### 1. Autenticação e Gestão de Utilizadores
- **Registo de Empresas**: Criação de contas empresariais com detalhes fiscais (NIF), endereço e dados de contacto.
- **Acesso Seguro**: Login protegido e sistema de recuperação de palavra-passe.
- **Gestão de Perfil**: Edição de dados do utilizador e configurações da conta.

### 2. Gestão de Clientes e Entidades
- **Registo Centralizado**: Base de dados completa de clientes e fornecedores.
- **Campos Detalhados**: Suporte para NIF, morada, telefone, email e observações.
- **Listagem e Busca**: Filtros avançados para consulta de entidades.

### 3. Inventário e Gestão de Itens
- **Tipos de Itens**: Diferenciação clara entre Produtos e Serviços.
- **Controlo de Stock**: Monitorização de quantidades, definição de stock mínimo/máximo e alertas de rutura.
- **Rastreabilidade**: Suporte para códigos de barras, unidades de medida e datas de validade.
- **Categorização**: Organização hierárquica por categorias e subcategorias.

### 4. Gestão Documental e Faturação
- **Tipos de Documentos**: Emissão de Faturas (FT), Faturas-Recibo (FR), Pró-formas (PP), Recibos (RC) e Notas de Crédito (NC).
- **Multi-Moeda**: Suporte para transações em AOA, USD e EUR.
- **Regras Fiscais**: Cálculo automático de impostos (IVA), retenções na fonte e descontos (linha ou global).
- **Personalização**: Adição de notas em documentos e referências de encomendas.

### 5. Ponto de Venda (POS)
- **Operação de Caixa**: Interface otimizada para vendas rápidas em balcão.
- **Gestão de Turnos**: Abertura e fecho de caixas por operador.
- **Sincronização**: Abate automático de stock no momento da venda.

### 6. Assistente de IA (MIND)
- **Consultas em Linguagem Natural**: Chatbot integrado para interagir com os dados da empresa.
- **Ações Rápidas**: Atalhos para "Visão Geral de Vendas", "Consultar Stock", "Relatórios de Hoje" e "Desempenho da Equipa".
- **Inteligência Contextual**: Respostas baseadas nos dados reais do sistema para apoio à decisão.

### 7. Gestão de Subscrições
- **Planos de Serviço**: Visualização e seleção de planos de subscrição.
- **Estado da Conta**: Acompanhamento do ciclo de vida da subscrição da empresa.

### 8. Relatórios e Análise
- **Dashboard Dinâmico**: Visualização gráfica dos principais KPIs do negócio.
- **Relatórios Analíticos**: Extração de dados detalhados sobre vendas, stock e performance financeira.

## Como Inicializar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### Pré-requisitos
- **PNPM**: O projeto utiliza o `pnpm` como gestor de pacotes. Se não o tiver instalado, execute: `npm install -g pnpm`
- **Node.js**: Versão 18 ou superior.

### Passos para Instalação

1. **Instalar Dependências**:
   ```bash
   pnpm install
   ```

2. **Configurar Variáveis de Ambiente**:
   - Copie o ficheiro `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Preencha as variáveis no ficheiro `.env`:
     - `NEXT_PUBLIC_API_URL`: URL da API do backend.
     - `SESSION_SECRET`: Um segredo seguro para a sessão (mínimo 32 caracteres).

3. **Executar em Desenvolvimento**:
   ```bash
   pnpm dev
   ```
   O projeto estará disponível em `http://localhost:3000`.

### Scripts Disponíveis
- `pnpm dev`: Executa o servidor de desenvolvimento com Turbopack.
- `pnpm build`: Cria o bundle de produção da aplicação.
- `pnpm start`: Inicia o servidor em modo de produção.
- `pnpm lint`: Executa a verificação de linting do código.

---

### Notas de Desenvolvimento
- **Bug Fix**: Resolver problema onde a subscrição da empresa não é carregada ao buscar o utilizador.
- **Otimização**: Chamar o `fetch user` apenas em modificações relevantes (usar dependências do `useEffect`).
- **Arquitetura**: Implementar store (Zustand) para gestão global de categorias e estados recorrentes.