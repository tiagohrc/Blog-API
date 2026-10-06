# Blog-API

API REST para um blog jornalístico, com artigos, comentários e autenticação de usuários. Construída em Node.js/TypeScript seguindo os princípios de Clean Architecture (controllers → use cases → repositórios).

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework web:** Fastify
- **ORM / Banco:** Prisma + PostgreSQL
- **Validação:** Zod
- **Autenticação:** JWT + bcrypt
- **Documentação:** Swagger/OpenAPI
- **Segurança:** `@fastify/cors`, `@fastify/helmet`, `@fastify/rate-limit`

## Arquitetura

O projeto segue Clean Architecture, com camadas bem definidas:

```
Controller → Use Case → Repository (interface) → Prisma Repository (implementação)
```

- **Controllers** — recebem a requisição, validam o body/params/query com Zod, chamam a use case e devolvem a resposta.
- **Use Cases** — contêm a regra de negócio (ex: "só o dono ou admin pode editar um comentário").
- **Repositories** — interfaces que abstraem o acesso a dados, nesse caso, implementadas via Prisma.
- **Factories** — utilização de Factory Pattern que montam as use cases injetando os repositórios concretos.

## Modelo de domínio

- **User** — `id`, `username`, `email`, `password` (hash), `role` (`ADMIN` | `USER`), timestamps.
- **Article** — criado apenas com role ADMIN; leitura pública.
- **Comment** — vinculado a um `User` e a um `Article`; requer autenticação para criar.

## Autenticação e permissões (RBAC)

| Camada | Responsabilidade |
|---|---|
| `authMiddleware` | Valida o JWT (`request.jwtVerify()`) — retorna 401 se ausente/inválido |
| `verifyRole` | Restringe uma rota a roles específicos — retorna 403 se não bater |
| `verifyOwnerOrAdmin` | Permite acesso ao próprio dono do recurso (comparando `id` da URL com `request.user.id`) ou a um ADMIN |

### Regras por entidade

- **Artigos** — leitura pública; criar/editar/deletar restrito a `ADMIN`. Deletar um artigo remove seus comentários em cascata.
- **Comentários** — leitura pública; criar exige login; editar/deletar exige ser o dono do comentário ou `ADMIN`.
- **Usuários** — registro público; listar todos exige `ADMIN`; ver/editar/deletar a própria conta exige ser o próprio usuário ou `ADMIN`. Contas `ADMIN` não podem se autoexcluir. Deletar um usuário remove seus comentários em cascata.

## Tratamento de erros

Erros de negócio usam classes customizadas (`NotFoundError`, `ForbiddenError`, `ValidationError`)


## Paginação e filtros

As listagens (`GET /articles`, `GET /comments/user/:userId`, `GET /users`) suportam paginação via query string:

```
?page=1&limit=10
```

E filtros de busca parcial (`title`, `content`, `username`, conforme a rota), retornando um envelope padrão:

```json
{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 23, "totalPages": 3 }
}
```

## Variáveis de ambiente

Validadas no startup via Zod (`config/env.ts`) — a aplicação não sobe se alguma estiver ausente ou inválida.

```dotenv
NODE_ENV=development
PORT=3000
HOST="0.0.0.0"
HASH_SALT_ROUNDS=10

POSTGRES_HOST=localhost
POSTGRES_USER=teste
POSTGRES_PASSWORD=tiago19
POSTGRES_DB=postgres
POSTGRES_PORT=5432

DATABASE_URL="postgresql://teste:tiago19@localhost:5432/postgres?schema=public"

JWT_SECRET="gere-um-valor-aleatorio-com-openssl-rand--base64-32"
```

## Como rodar

```bash
# entrar na pasta do backend
cd backend

# instalar dependências
npm install

# subir o banco (se estiver usando Docker)
docker compose up -d

# aplicar as migrations
npx prisma migrate dev

# subir o servidor em modo dev
npm run dev
```

A documentação com Swagger fica disponível em:

```
http://localhost:3000/docs
```

## Endpoints

### Auth

| Método | Rota | Acesso |
|---|---|---|
| POST | `/login` | Público (rate limit: 5 tentativas/min) |

### Articles

| Método | Rota | Acesso |
|---|---|---|
| GET | `/articles` | Público — paginação e filtro (`title`, `isDestaque`) |
| GET | `/articles/:id` | Público |
| POST | `/articles` | ADMIN |
| PUT | `/articles/:id` | ADMIN |
| DELETE | `/articles/:id` | ADMIN (cascata: remove comentários) |

### Comments

| Método | Rota | Acesso |
|---|---|---|
| GET | `/comments` | Público |
| GET | `/comments/:id` | Público |
| GET | `/comments/user/:userId` | Público — paginação e filtro (`content`) |
| POST | `/comments` | Autenticado |
| PUT | `/comments/:id` | Dono ou ADMIN |
| DELETE | `/comments/:id` | Dono ou ADMIN |

### Users

| Método | Rota | Acesso |
|---|---|---|
| POST | `/users` | Público (registro) |
| GET | `/users` | ADMIN — paginação e filtro (`username`) |
| GET | `/users/:id` | Dono ou ADMIN |
| GET | `/users/username/:username` | Público |
| PUT | `/users/:id` | Dono ou ADMIN |
| DELETE | `/users/:id` | Dono ou ADMIN (ADMIN não pode se autoexcluir; cascata: remove comentários) |
