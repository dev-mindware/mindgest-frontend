# Documentação da API de Gestão de POS

Este documento descreve as estruturas de dados necessárias para alimentar a dashboard de Gestão de POS e o payload para abertura de novas sessões.

## 1. Retorno da Dashboard (GET /api/pos/management)

Payload necessário para preencher os indicadores, a lista de caixas e as solicitações pendentes.

```json
{
  "summary": {
    "dailyRevenue": 121000.0,
    "dailyExpenses": 13100.0,
    "pendingRequestsCount": 3,
    "totalSessions": 6
  },
  "cashiers": [
    {
      "id": "1",
      "name": "Caixa n° 02",
      "user": "João Afonso Raimundo",
      "status": "Ativo",
      "totalSold": 3800000.0,
      "activityTime": "05:52",
      "progress": 45
    },
    {
      "id": "2",
      "name": "Caixa n° 03",
      "user": "Maria Oliveira",
      "status": "Inativo",
      "totalSold": 0.0,
      "activityTime": "00:00",
      "progress": 0
    }
  ],
  "openingRequests": [
    {
      "id": 1,
      "message": "O Caixa n°04 solicitou abertura de caixa para começar com as atividades",
      "time": "2 min"
    },
    {
      "id": 2,
      "message": "O Caixa n°03 solicitou abertura de caixa para começar com as atividades",
      "time": "10 min"
    }
  ]
}
```

## 2. Payload para Abertura de Caixa (POST /api/pos/opening)

Estrutura enviada ao submeter o formulário de abertura de caixa feito pelo MANAGER.

```json
{
  "initialCapital": "1500.00",
  "workTime": "08:00",
  "storeId": "uuid-da-loja-selecionada",
  "cashierIds": ["id-do-caixa-1", "id-do-caixa-2"]
}
```

### Detalhes dos Campos (Abertura):

- **`initialCapital`**: Valor inicial em caixa (string para compatibilidade com máscaras de moeda).
- **`workTime`**: Tempo definido para o expediente (formato HH:MM).
- **`storeId`**: Identificador único da loja onde os caixas operam.
- **`cashierIds`**: Lista de IDs dos terminais (caixas físicos) que serão abertos.
