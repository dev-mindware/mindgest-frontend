# Deadline Frontend - Plano Base (4 semanas)

## 👥 Alocação de Equipe
- **Mauro Tarefas complexas, integrações críticas e lógica de negócio
- **John: Implementação de UI, componentes visuais e testes básicos

---

## 🗓️ Cronograma Semanal

### Semana 1 (11-17 Ago): Autenticação & Cadastros
| Tarefa                              | Responsável | Prioridade | Status |
|-------------------------------------|-------------|------------|--------|
<<<<<<< HEAD
| Página de login com validação       | Você        | Alta       | [ V ]    |
| Dashboard inicial (placeholders)    | John        | Média      | [ V ]    |
| CRUD clientes (listagem/formulário) | Você        | Alta       | [ ]    |
| CRUD produtos (listagem básica)     | John        | Alta       | [ V ]    |
| Validação de formulários genéricos  | John        | Baixa      | [ ]    |
=======
| Página de login com validação       | Mauro       | Alta       | [X]    |
| Dashboard inicial (placeholders)    | John        | Média      | [X]    |
| CRUD clientes (listagem/formulário) | Mauro       | Alta       | [X]    |
| CRUD produtos (listagem básica)     | John        | Alta       | [X]    |
| Validação de formulários genéricos  | John        | Baixa      | [X]    |
>>>>>>> base-plan

### Semana 2 (18-24 Ago): Faturação Core
| Tarefa                              | Responsável | Prioridade | Status |
|-------------------------------------|-------------|------------|--------|
| Seletor de tipo documento           | Mauro       | Alta       | [X]    |
| Formulário criação documentos       | Mauro       | Crítica    | [X]    |
| Adição dinâmica de itens            | Mauro       | Alta       | [X]    |
| Cálculos automáticos (totais)       | Mauro       | Crítica    | [X]    |
| Header contextual dinâmico          | John        | Média      | [X]    |
| Integração Sidebar com rotas        | John        | Alta       | [X]    |

### Semana 3 (25-31 Ago): Visualização & Relatórios
| Tarefa                              | Responsável | Prioridade | Status |
|-------------------------------------|-------------|------------|--------|
| Template PDF                        | Mauro       | Alta       | [X]    |
| Pré-visualização em tempo real      | John        | Média      | [ ]    |
| Histórico de documentos (listagem)  | John        | Alta       | [ ]    |
| Painel de relatórios mensais        | Mauro       | Alta       | [ ]    |
| Gráficos básicos (Chart.js)         | John        | Média      | [X]    |
| Exportação CSV                      | Mauro       | Baixa      | [ ]    |

### Semana 4 (1-7 Set): Mobile & Polimento
| Tarefa                              | Responsável | Prioridade | Status |
|-------------------------------------|-------------|------------|--------|
| Adaptação mobile (WebView)          | John        | Alta       | [ ]    |
| Testes viewports (iOS/Android)      | John        | Alta       | [ ]    |
| Tratamento de erros global          | Mauro       | Alta       | [ ]    |
| Loaders e estados vazios            | John        | Média      | [ ]    |
| Otimização de performance           | Mauro       | Crítica    | [ ]    |
| Testes de usabilidade               | Ambos       | Alta       | [ ]    |


## 📌 Estratégia de Aceleração
1. **Reúso máximo de componentes**:
   - Utilizar componentes existentes (Inputs, Buttons) em todos os módulos
   - Criar templates padrão para CRUDs

2. **Paralelismo inteligente**:
   - Semana 1: Mauro foca na autenticação enquanto John faz listagens
   - Semana 2: Mauro no core da faturação enquanto John finaliza navegação
   - Semana 4: John testa mobile enquanto Mauro otimiza performance

3. **Priorização rigorosa**:
   - Itens "Crítica" devem ser finalizados primeiro
   - Recursos "Baixa" prioridade podem ser simplificados (ex: validações básicas)

## ✅ Checkpoints Semanais
- **Sextas-feiras 18:00**: Revisão de progresso e ajustes
- **Domingos 20:00**: Planejamento da semana seguinte
```

## Justificativa da Distribuição

1. **Tarefas para Mim**:
   - Lógica complexa (cálculos, formulários dinâmicos)
   - Integrações críticas (geração PDF, exportações)
   - Gestão de erros e performance
   - Arquitetura de estado global

2. **Tarefas para John**:
   - Implementação visual (listagens, headers)
   - Componentes reutilizáveis
   - Testes de responsividade
   - Features auxiliares (placeholders, estados vazios)

3. **Tarefas em Conjunto**:
   - Testes de usabilidade final
   - Revisão de código cruzada
   - Ajustes pós-feedback
