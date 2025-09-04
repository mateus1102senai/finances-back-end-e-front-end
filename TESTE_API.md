# 🚀 Guia de Testes da API - Thunder Client

## 📋 Pré-requisitos
1. **Servidor rodando**: `npm run dev` (porta 5000)
2. **Thunder Client**: Extensão instalada no VS Code
3. **Banco de dados**: Prisma configurado

---

## 🔗 URL Base
```
http://localhost:5000
```

---

## 📂 **1. USUÁRIOS (`/api/users`)**

### ✅ Verificar API funcionando
```http
GET http://localhost:5000/
```

### 👤 Criar Usuário
```http
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com", 
  "password_hash": "senha123hash"
}
```

### 📋 Listar Usuários
```http
GET http://localhost:5000/api/users
```

### 🔍 Buscar Usuário por ID
```http
GET http://localhost:5000/api/users/1
```

### ✏️ Atualizar Usuário
```http
PUT http://localhost:5000/api/users/1
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "joao.novo@email.com"
}
```

### 🗑️ Deletar Usuário
```http
DELETE http://localhost:5000/api/users/1
```

---

## 💰 **2. TRANSAÇÕES (`/api/transactions`)**

### 💵 Criar Receita
```http
POST http://localhost:5000/api/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "income",
  "amount": 3000,
  "description": "Salário",
  "category": "Trabalho",
  "date": "2025-09-04"
}
```

### 💸 Criar Despesa
```http
POST http://localhost:5000/api/transactions
Content-Type: application/json

{
  "userId": 1,
  "type": "expense",
  "amount": 150,
  "description": "Mercado",
  "category": "Alimentação",
  "date": "2025-09-04"
}
```

### 📋 Listar Transações
```http
GET http://localhost:5000/api/transactions?userId=1
```

### 🔍 Buscar Transação por ID
```http
GET http://localhost:5000/api/transactions/1
```

### 📊 Resumo Financeiro
```http
GET http://localhost:5000/api/transactions/summary?userId=1
```

### 🏷️ Transações por Categoria
```http
GET http://localhost:5000/api/transactions/category/Alimentação?userId=1
```

### 📈 Transações por Tipo - Receitas
```http
GET http://localhost:5000/api/transactions/type/income?userId=1
```

### 📉 Transações por Tipo - Despesas
```http
GET http://localhost:5000/api/transactions/type/expense?userId=1
```

### ✏️ Atualizar Transação
```http
PUT http://localhost:5000/api/transactions/1
Content-Type: application/json

{
  "amount": 180,
  "description": "Mercado + Farmácia"
}
```

### 🗑️ Deletar Transação
```http
DELETE http://localhost:5000/api/transactions/1
```

---

## 🎯 **3. METAS (`/api/goals`)**

### 🎯 Criar Meta
```http
POST http://localhost:5000/api/goals
Content-Type: application/json

{
  "userId": 1,
  "title": "Viagem para Europa",
  "target_amount": 10000,
  "current_amount": 1500,
  "deadline": "2025-12-31"
}
```

### 📋 Listar Metas
```http
GET http://localhost:5000/api/goals?userId=1
```

### 🔍 Buscar Meta por ID
```http
GET http://localhost:5000/api/goals/1
```

### 📊 Progresso da Meta
```http
GET http://localhost:5000/api/goals/1/progress
```

### ✏️ Atualizar Progresso
```http
PUT http://localhost:5000/api/goals/1/progress
Content-Type: application/json

{
  "amount": 2000
}
```

### ➕ Adicionar ao Progresso
```http
POST http://localhost:5000/api/goals/1/add-progress
Content-Type: application/json

{
  "amount": 500
}
```

### ⏰ Metas Próximas do Prazo
```http
GET http://localhost:5000/api/goals/upcoming?userId=1&days=30
```

### ✅ Metas Concluídas
```http
GET http://localhost:5000/api/goals/completed?userId=1
```

### ✏️ Atualizar Meta
```http
PUT http://localhost:5000/api/goals/1
Content-Type: application/json

{
  "title": "Viagem para Europa - Atualizada",
  "target_amount": 12000
}
```

### 🗑️ Deletar Meta
```http
DELETE http://localhost:5000/api/goals/1
```

---

## 🔄 **Ordem Recomendada para Testes**

1. **Verificar API** → `GET /`
2. **Criar Usuário** → `POST /api/users`
3. **Criar Transações** → `POST /api/transactions` (receitas e despesas)
4. **Ver Resumo** → `GET /api/transactions/summary`
5. **Criar Meta** → `POST /api/goals`
6. **Ver Progresso** → `GET /api/goals/1/progress`
7. **Adicionar Progresso** → `POST /api/goals/1/add-progress`

---

## 📝 **Códigos de Resposta Esperados**

- **200** - Sucesso (GET, PUT)
- **201** - Criado (POST)
- **204** - Sem conteúdo (DELETE)
- **400** - Erro de validação
- **404** - Não encontrado
- **500** - Erro interno

---

## 🐛 **Dicas de Troubleshooting**

1. **Servidor não responde**: Verifique se `npm run dev` está rodando
2. **Erro 404**: Verifique a URL e se as rotas estão corretas
3. **Erro 400**: Verifique se o JSON está bem formatado
4. **Erro 500**: Verifique os logs do servidor no terminal

---

## 🎉 **Funcionalidades Testadas**

- ✅ CRUD completo de usuários
- ✅ CRUD completo de transações
- ✅ CRUD completo de metas
- ✅ Resumo financeiro automático
- ✅ Filtros por categoria e tipo
- ✅ Progresso de metas
- ✅ Validações e tratamento de erros
