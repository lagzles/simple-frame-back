# Simple Frame Back

Backend do MVP para modelagem de galpoes com porticos planos.

Stack:

- Node.js
- Express
- TypeScript
- Prisma
- MySQL

## Requisitos

- Node.js 20+
- MySQL
- npm

## Setup

Instale dependencias:

```powershell
npm install
```

Crie o `.env`:

```powershell
copy .env.example .env
```

Configure:

```env
DATABASE_URL="mysql://root:password@localhost:3306/simple_frame"
JWT_SECRET="replace-this-with-a-long-random-secret"
PORT=3000
NODE_ENV="development"
FRONTEND_ORIGIN="http://localhost:5173"
```

Gere o Prisma Client:

```powershell
npm run prisma:generate
```

Crie as tabelas:

```powershell
npm run prisma:migrate
```

Suba o servidor:

```powershell
npm run dev
```

Health check:

```http
GET /health
```

## Scripts

```powershell
npm run dev
npm run build
npm start
npm test
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## Autenticacao

Autenticacao usa email/senha e cookie `httpOnly`.

Token:

- validade: 1 hora;
- cookie: `auth_token`;
- sessoes persistidas em `auth_sessions`;
- logout revoga sessao e limpa cookie.

Endpoints:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Cadastro/login:

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

Erros principais:

- `EMAIL_ALREADY_EXISTS`
- `INVALID_CREDENTIALS`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `VALIDATION_ERROR`

## Ownership

Todo dado operacional pertence direta ou indiretamente a um usuario.

Rotas protegidas usam `requireAuth`.

Regras:

- frontend nunca envia `userId`;
- backend extrai usuario do token;
- consultas filtram por `user_id`;
- usuario nao acessa predios, porticos, cargas, jobs ou resultados de outro usuario.

## Predios

Endpoints:

```http
GET  /api/buildings
POST /api/buildings
```

Criar predio:

```json
{
  "name": "Galpao 01",
  "frameSpacing": 6,
  "frameCount": 10,
  "freeHeight": 7,
  "roofType": "double_slope",
  "roofSlopePercent": 10
}
```

`roofType`:

- `single_slope`
- `double_slope`

## Projetos

Projetos existem, mas o MVP pode usar predios diretamente como tela principal.

Endpoints:

```http
GET  /api/projects
POST /api/projects
```

## Modulacoes

Endpoint:

```http
POST /api/buildings/:buildingId/modulations
```

Exemplo:

```json
{
  "name": "Modulacao A",
  "orderIndex": 0,
  "repeatCount": 5,
  "frameSpacing": 6
}
```

## Porticos

Endpoint:

```http
POST /api/modulations/:modulationId/frames/generate
```

Exemplo:

```json
{
  "name": "Portico tipo A",
  "spanList": [12, 12],
  "freeHeight": 7,
  "ridgeX": 12,
  "roofSlopePercent": 10,
  "influenceWidth": 6,
  "minimumWebHeight": 400,
  "hasSteelColumns": true,
  "roofType": "double_slope"
}
```

O gerador cria:

- nos;
- barras de viga;
- colunas se `hasSteelColumns = true`;
- apoios basicos;
- ponto de cumeeira se estiver dentro de um vao.

## Cargas

Endpoint:

```http
PUT /api/frames/:frameId/load-cases
```

Exemplo:

```json
{
  "surfaceLoads": {
    "cp": 25,
    "sc": 15,
    "su": 10,
    "cv": 40
  }
}
```

Gera 9 casos:

1. `pp`
2. `cp`
3. `sc`
4. `su`
5. `cv 0`
6. `cv 90 i`
7. `cv 90 ii`
8. `cv 270 i`
9. `cv 270 ii`

## Analise

Analise roda como job assincrono.

Endpoints:

```http
POST /api/analysis-jobs
GET  /api/analysis-jobs/:jobId
GET  /api/analysis-jobs/:jobId/events
GET  /api/analysis-jobs/:jobId/results
```

Criar job:

```json
{
  "buildingId": "uuid",
  "frameId": "uuid",
  "options": {
    "runChecks": true,
    "optimizeProfiles": false
  }
}
```

Estados:

- `queued`
- `running`
- `completed`
- `failed`
- `cancelled`

SSE:

```http
GET /api/analysis-jobs/:jobId/events
```

Eventos:

- `queued`
- `started`
- `progress`
- `completed`
- `failed`
- `heartbeat`

Resultado:

```http
GET /api/analysis-jobs/:jobId/results
```

Se job ainda nao terminou, retorna `409 ANALYSIS_NOT_COMPLETED`.

## Banco de Dados

Schema Prisma em:

```text
prisma/schema.prisma
```

Entidades principais:

- `users`
- `auth_sessions`
- `projects`
- `buildings`
- `modulations`
- `frames`
- `nodes`
- `members`
- `profiles`
- `load_cases`
- `analysis_jobs`
- `analysis_snapshots`
- `analysis_results`
- `member_results`
- `support_reactions`
- `profile_check_results`

## Testes

Rodar:

```powershell
npm test
```

Cobertura atual:

- validacao de auth;
- validacao de predios;
- validacao de jobs;
- geracao de portico;
- geracao de cargas.

## Status Atual

Implementado:

- API base;
- auth;
- ownership;
- predios;
- projetos;
- modulacoes;
- geracao inicial de portico;
- geracao de cargas;
- jobs assincronos;
- SSE;
- schema MySQL.

Ainda placeholder:

- motor real de analise matricial;
- verificacao ELU/ELS real;
- otimizacao de perfis;
- resultados estruturais reais.

O job de analise hoje simula etapas e salva um resumo `completed_without_calculation_engine`.
