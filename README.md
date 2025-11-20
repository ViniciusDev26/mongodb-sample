# no-sql-project

API RESTful construída com Bun, Express e MongoDB para gerenciamento de usuários.

## Pré-requisitos

- [Bun](https://bun.sh) v1.2.21 ou superior
- [Docker](https://www.docker.com/) e Docker Compose

## Passo a Passo para Rodar o Projeto

### 1. Clonar o repositório (se aplicável)

```bash
git clone <url-do-repositorio>
cd no-sql-project
```

### 2. Instalar as dependências

```bash
bun install
```

### 3. Configurar variáveis de ambiente

O projeto já inclui um arquivo `.env` com a configuração padrão:

```env
MONGODB_URL=mongodb://root:root@localhost:27017/no-sql-project?authSource=admin
```

### 4. Iniciar o MongoDB com Docker

Certifique-se de que o Docker Desktop está rodando e execute:

```bash
docker-compose up -d
```

Isso irá:
- Baixar a imagem do MongoDB (se necessário)
- Criar e iniciar um container MongoDB na porta 27017
- Configurar usuário e senha como `root:root`

### 5. Rodar o servidor

```bash
bun dev
```

O servidor estará disponível em `http://localhost:3000`

## Endpoints da API

- `GET /` - Mensagem de boas-vindas
- `GET /users` - Listar todos os usuários
- `POST /users` - Criar novo usuário
- `PUT /users/:id` - Atualizar usuário existente
- `DELETE /users/:id` - Deletar usuário

## Exemplo de Uso

### Criar um usuário

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "João Silva", "email": "joao@example.com"}'
```

### Listar usuários

```bash
curl http://localhost:3000/users
```

## Parar o ambiente

Para parar o MongoDB:

```bash
docker-compose down
```

## Tecnologias Utilizadas

- **Bun** - Runtime JavaScript rápido e all-in-one
- **Express** - Framework web minimalista
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
