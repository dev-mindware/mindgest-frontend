Aqui está o **Markdown formatado de forma profissional**, claro e pronto para enviar ao **time de backend**. Mantive linguagem técnica, objetiva e orientada a requisitos.

---

# 📌 Requisitos e Melhorias — Módulo de Vendas / Produtos

## 1. Scanner de Produtos (Venda) [X]

* Ao **escanear um produto**, mesmo que **não exista na API**, deve ser possível **adicioná-lo manualmente à venda**.
* Deve existir um **endpoint específico para busca por código de barras**:

  * Retornar o produto caso exista
  * Caso não exista, permitir fallback para cadastro rápido/manual

---

## 2. Categorias por Empresa [X]

* Cada **empresa** deve poder **criar e gerir as suas próprias categorias**, de acordo com:

  * Tipo de negócio
  * Necessidades de venda
* Categorias **não são globais**, são **isoladas por empresa**.

---

## 3. Categorias com Quantidade de Itens [X]

* Ao listar categorias, a API deve retornar:

  * ✔️ Nome da categoria
  * ✔️ Identificador
  * ✔️ **Quantidade de itens/produtos associados**

Exemplo de payload esperado:

```json
{
  "id": "category-1",
  "name": "Cosméticos",
  "itemsCount": 42
}
```

---

## 4. Estrutura Empresa → Loja → Categoria [X]

Cada empresa pode possuir múltiplas lojas, e cada loja pode possuir suas próprias categorias.

### Exemplo conceitual:

```ts
company: {
  stores: [
    {
      id: "store-1",
      name: "Store 1",
      location: "1º de Maio",
      categories: [
        {
          id: "category-1",
          name: "Cosméticos"
        },
        {
          id: "category-2",
          name: "Comida"
        }
      ]
    }
  ]
}
```

---

## 5. Regra de Stock / Reservas (Scanner)

* Produtos **sem stock disponível (reservas = 0)**:

  * ❌ **Não podem ser adicionados à venda via scanner**
  * ✔️ Devem ser bloqueados ou retornar erro de validação pela API

## 6. Gestão de Gerentes e Lojas [X]

* Ao adicionar um **gerente**, deve ser possível:

  * Selecionar **uma ou mais lojas** que ele gerencia
* Implementação esperada no front:

  * **Multiselect**
* Backend deve:

  * Suportar relação **N:N** (gerente ↔ lojas)