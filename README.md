# Finances Back-End e Front-End

Este projeto é um sistema de gerenciamento financeiro, incluindo back-end (Node.js, Express, Prisma) e exemplos de requisições para testes.

## Sumário
- [Pré-requisitos](#pré-requisitos)
- [Clonando o repositório](#clonando-o-repositório)
- [Instalando dependências](#instalando-dependências)
- [Configurando o banco de dados](#configurando-o-banco-de-dados)
- [Executando o servidor](#executando-o-servidor)
- [Testando a API](#testando-a-api)
- [Exemplos de requisições](#exemplos-de-requisições)

---

## Pré-requisitos
- Node.js (v16 ou superior)
- npm
- Git

## Clonando o repositório

```bash
git clone https://github.com/mateus1102senai/finances-back-end-e-front-end.git
cd finances-back-end-e-front-end
```

## Instalando dependências

```bash
npm install
```

## Configurando o banco de dados

O projeto utiliza SQLite via Prisma. O arquivo de configuração está em `prisma/schema.prisma`.

Para rodar as migrações e criar o banco de dados:

```bash
npx prisma migrate dev
```

Para popular o banco com dados de teste (opcional):

```bash
node prisma/seed/seed.js
```

## Executando o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000` (ou porta definida no código).

## Testando a API

Você pode testar a API utilizando ferramentas como Thunder Client, Postman ou Insomnia. Há exemplos de requisições no arquivo `thunder-client-requests.json`.

## Exemplos de requisições

### Usuários
- **Criar usuário:**
	- POST `/users`
	- Body:
		```json
		{ "name": "Nome", "email": "email@exemplo.com", "password": "senha" }
		```
- **Listar usuários:**
	- GET `/users`

### Transações
- **Criar transação:**
	- POST `/transactions`
	- Body:
		```json
		{ "userId": 1, "value": 100, "type": "income", "description": "Salário" }
		```
- **Listar transações:**
	- GET `/transactions`

### Metas financeiras
- **Criar meta:**
	- POST `/goals`
	- Body:
		```json
		{ "userId": 1, "title": "Viagem", "targetValue": 2000 }
		```
- **Listar metas:**
	- GET `/goals`

---

Para mais detalhes, consulte os arquivos de rota em `src/routes/` e os exemplos em `thunder-client-requests.json`.
