# Guia de Abertura de Sessão de Caixa (POS)

Este documento detalha os procedimentos técnicos e fluxos de trabalho para iniciar sessões de caixa, diferenciando as interfaces utilizadas por **Owners/Managers** e **Cashiers**, incluindo referências de API.

---

## 1. Fluxo para Owners e Managers

Os proprietários e gestores utilizam uma interface centralizada de gestão para abrir sessões, permitindo a configuração de múltiplos caixas simultaneamente.

- **Componente**: `PosOpeningModal`
- **Endpoint**: `POST /cash-sessions/opening-sessions`

### Exemplo de Payload:

```json
{
  "initialCapital": "5000",
  "workTime": "08:00",
  "storeId": "uuid-da-loja",
  "cashierIds": ["id-caixa-1", "id-caixa-2"],
  "fundType": "Coin"
}
```

---

## 2. Fluxo para Operadores (Cashiers)

### Abertura de Sessão (Presencial)

- **Componente**: `PosOpeningCashierModal`
- **Endpoint**: `POST /cash-sessions/opening-sessions`

### Exemplo de Payload:

```json
{
  "initialCapital": "1500",
  "workTime": "06:00",
  "storeId": "uuid-da-loja",
  "cashierId": "uuid-do-operador",
  "fundType": "Note",
  "managerBarcode": "987654321"
}
```

### Solicitação de Abertura (Remota)

- **Componente**: `PosRequestOpeningModal`
- **Endpoint**: `POST /cash-sessions/request-opening`

### Exemplo de Payload:

```json
{
  "storeId": "uuid-da-loja",
  "message": "Solicito abertura para o turno de reforço."
}
```

---

## Resumo Técnico de Roles

| Role                   | Componente Principal     | Endpoint                    | Autorização         |
| :--------------------- | :----------------------- | :-------------------------- | :------------------ |
| **Owner / Manager**    | `PosOpeningModal`        | `POST .../opening-sessions` | 🔐 Própria          |
| **Cashier** (Abertura) | `PosOpeningCashierModal` | `POST .../opening-sessions` | 🤝 Manager PIN/Code |
| **Cashier** (Pedido)   | `PosRequestOpeningModal` | `POST .../request-opening`  | ☁️ Remota           |

---

> [!IMPORTANT]
> A diferenciação entre estes componentes garante que os gestores mantenham o controlo total sobre o fluxo financeiro, enquanto os operadores têm uma ferramenta ágil e segura para o seu posto de trabalho.
