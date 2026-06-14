# Persistência dos guias orientados

## Objectivo

Persistir as preferências e o progresso dos guias por utilizador e empresa. A API é a fonte principal; o `localStorage` permanece como cache e contingência para falhas de rede.

O `userId` e o `companyId` devem ser obtidos através da sessão autenticada e da empresa activa. Estes identificadores não devem ser aceites no corpo dos pedidos.

## Modelo de dados

### `onboarding_preferences`

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | Chave primária |
| `company_id` | UUID | Empresa activa |
| `user_id` | UUID | Utilizador autenticado |
| `auto_start_enabled` | boolean | Valor inicial `true` |
| `tour_button_enabled` | boolean | Valor inicial `true` |
| `created_at` | timestamp | Preenchimento automático |
| `updated_at` | timestamp | Actualização automática |

Índice único: `(company_id, user_id)`.

### `onboarding_tour_definitions`

| Campo | Tipo | Regra |
| --- | --- | --- |
| `tour_id` | varchar | Chave estável do guia |
| `title` | varchar | Nome administrativo |
| `group` | varchar | `setup`, `core`, `operation`, `advanced` ou `reporting` |
| `type` | varchar | `setup`, `core`, `advanced` ou `reporting` |
| `minimum_plan` | varchar | `Base`, `Smart` ou `Pro` |
| `roles` | json/array | Perfis autorizados |
| `version` | integer | Versão funcional do conteúdo |
| `priority` | integer | Ordem recomendada |
| `is_active` | boolean | Permite desactivar sem apagar histórico |

### `onboarding_tour_progress`

| Campo | Tipo | Regra |
| --- | --- | --- |
| `id` | UUID | Chave primária |
| `company_id` | UUID | Empresa activa |
| `user_id` | UUID | Utilizador autenticado |
| `tour_id` | varchar | Referência ao catálogo |
| `status` | enum | `in_progress`, `completed` ou `skipped` |
| `mode` | enum | `normal` ou `demo` |
| `last_step_index` | integer nullable | Último passo apresentado |
| `tour_version` | integer | Versão efectivamente vista |
| `started_at` | timestamp nullable | Primeiro início da versão |
| `completed_at` | timestamp nullable | Conclusão |
| `skipped_at` | timestamp nullable | Guia ignorado |
| `updated_at` | timestamp | Última actividade |

Índice único: `(company_id, user_id, tour_id)`.

## Catálogo actual

```json
[
  { "tourId": "setup", "title": "Configuração inicial", "group": "setup", "type": "setup", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 1, "version": 1 },
  { "tourId": "dashboard", "title": "Leitura do painel", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 2, "version": 1 },
  { "tourId": "clients", "title": "Gestão de clientes", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 2, "version": 1 },
  { "tourId": "items", "title": "Produtos e serviços", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 3, "version": 1 },
  { "tourId": "documents-list", "title": "Documentos", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 4, "version": 1 },
  { "tourId": "normal-invoice", "title": "Criar factura", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 5, "version": 1 },
  { "tourId": "proforma-edit", "title": "Editar proforma", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 6, "version": 1 },
  { "tourId": "credit-note", "title": "Emitir nota de crédito", "group": "core", "type": "core", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 7, "version": 1 },
  { "tourId": "stock", "title": "Gestão de stock", "group": "operation", "type": "core", "minimumPlan": "Smart", "roles": ["OWNER", "MANAGER"], "priority": 6, "version": 1 },
  { "tourId": "pos-invoice", "title": "Facturar no POS", "group": "operation", "type": "core", "minimumPlan": "Smart", "roles": ["CASHIER"], "priority": 7, "version": 1 },
  { "tourId": "pos-settings", "title": "Definições do POS", "group": "operation", "type": "core", "minimumPlan": "Smart", "roles": ["CASHIER"], "priority": 8, "version": 1 },
  { "tourId": "pos-movements", "title": "Movimentos de caixa", "group": "operation", "type": "core", "minimumPlan": "Smart", "roles": ["CASHIER"], "priority": 9, "version": 1 },
  { "tourId": "pos-management", "title": "Gestão de POS", "group": "advanced", "type": "advanced", "minimumPlan": "Pro", "roles": ["OWNER", "MANAGER"], "priority": 10, "version": 1 },
  { "tourId": "suppliers", "title": "Fornecedores", "group": "advanced", "type": "advanced", "minimumPlan": "Pro", "roles": ["OWNER", "MANAGER"], "priority": 11, "version": 1 },
  { "tourId": "supplier-details", "title": "Detalhe do fornecedor", "group": "advanced", "type": "advanced", "minimumPlan": "Pro", "roles": ["OWNER", "MANAGER"], "priority": 14, "version": 1 },
  { "tourId": "supplier-history", "title": "Histórico do fornecedor", "group": "advanced", "type": "advanced", "minimumPlan": "Pro", "roles": ["OWNER", "MANAGER"], "priority": 15, "version": 1 },
  { "tourId": "reservations", "title": "Reservas", "group": "advanced", "type": "advanced", "minimumPlan": "Pro", "roles": ["OWNER", "MANAGER"], "priority": 12, "version": 1 },
  { "tourId": "reports-sales", "title": "Relatórios de vendas", "group": "reporting", "type": "reporting", "minimumPlan": "Base", "roles": ["OWNER", "MANAGER"], "priority": 13, "version": 1 },
  { "tourId": "reports-clients", "title": "Relatórios de clientes", "group": "reporting", "type": "reporting", "minimumPlan": "Smart", "roles": ["OWNER", "MANAGER"], "priority": 14, "version": 1 },
  { "tourId": "reports-access-control", "title": "Acesso e auditoria", "group": "reporting", "type": "reporting", "minimumPlan": "Pro", "roles": ["OWNER", "MANAGER"], "priority": 15, "version": 1 },
  { "tourId": "plans", "title": "Planos e subscrição", "group": "setup", "type": "setup", "minimumPlan": "Base", "roles": ["OWNER"], "priority": 16, "version": 1 }
]
```

O catálogo deve ser carregado por migração ou `seed`. Os passos e selectores permanecem no frontend; a base de dados guarda apenas identidade, elegibilidade administrativa e versão.

## Endpoints

### Obter preferências e progresso

`GET /onboarding`

```json
{
  "data": {
    "preferences": {
      "autoStartEnabled": true,
      "tourButtonEnabled": true
    },
    "tours": {
      "normal-invoice": {
        "status": "completed",
        "mode": "normal",
        "lastStepIndex": 10,
        "tourVersion": 1,
        "completedAt": "2026-06-14T10:04:00Z",
        "updatedAt": "2026-06-14T10:04:00Z"
      }
    },
    "updatedAt": "2026-06-14T10:04:00Z"
  }
}
```

### Alterar preferências

`PATCH /onboarding/preferences`

```json
{
  "autoStartEnabled": false,
  "tourButtonEnabled": true
}
```

Os campos são opcionais, mas o pedido deve conter pelo menos um deles.

### Actualizar progresso

`PUT /onboarding/tours/:tourId`

```json
{
  "status": "in_progress",
  "mode": "demo",
  "lastStepIndex": 4,
  "tourVersion": 1
}
```

O `PUT` deve ser idempotente. Ao receber `completed`, preencher `completed_at`; ao receber `skipped`, preencher `skipped_at`. Uma versão mais recente deve reiniciar as datas da versão anterior.

### Repor um guia

`DELETE /onboarding/tours/:tourId`

Resposta recomendada: `204 No Content`.

### Repor todos os guias

`DELETE /onboarding/tours`

Remove o progresso do utilizador na empresa activa, mas mantém as preferências gerais.

## Regras de segurança

- Validar a pertença do utilizador à empresa activa.
- Não confiar em `companyId`, `userId`, plano ou perfil enviados pelo cliente.
- Validar `tourId` no catálogo activo.
- Aceitar a actualização de progresso apenas para guias permitidos ao perfil e plano actuais.
- Não guardar valores escritos pelas demonstrações, dados de clientes, produtos ou documentos.
- Manter registos separados quando o mesmo utilizador participa em empresas diferentes.

## Comportamento do frontend

1. Carregar `GET /onboarding` ao entrar numa página com guia.
2. Hidratar o Zustand e manter o `localStorage` como contingência.
3. Aguardar a hidratação antes do início automático.
4. Enviar `in_progress` ao iniciar, `completed` ao concluir e `skipped` ao ignorar.
5. Actualizar preferências e reposições de forma optimista.
6. Não bloquear o guia quando a API estiver indisponível.
7. Voltar a apresentar um guia quando a versão local for superior à `tourVersion` concluída na API.
