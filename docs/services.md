# Sharkin: Services

Serviço de backend responsável pela lógica de negócio e persistência dos dados da aplicação.

- Cadastro e consulta de usuários
- Registro de plantões (entrada e saída)
- Autenticação via JWT
- Recuperação de senha com código de verificação por e-mail

> **Terminologia:** o código usa `duty` para designar **plantão**. Esta documentação usa "plantão" em todo o texto.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Como rodar localmente](#2-como-rodar-localmente)
3. [Variáveis de ambiente](#3-variáveis-de-ambiente)
4. [Autenticação](#4-autenticação)
5. [Endpoints](#5-endpoints)
6. [Regras de negócio](#6-regras-de-negócio)
7. [Erros](#7-erros)
8. [Dependências externas](#8-dependências-externas)
9. [Estrutura de pastas](#10-estrutura-de-pastas)

---

## 1. Stack

- Node.js (ou Bun) e um gerenciador de pacotes
- NestJS
- PostgreSQL
- Redis (usado pelo fluxo de recuperação de senha)

## 2. Como rodar localmente

```bash
cd services
cp .env.example .env      # preencha os valores (ver seção 3)
npm install
npx prisma migrate dev    # aplica as migrations no banco
npm run start:dev
```

> Ajuste os comandos conforme os scripts definidos no `package.json` (e o gerenciador usado, `npm` ou `bun`).

O serviço sobe na porta definida em `SERVICES_PORT` (padrão `3001`).

## 3. Variáveis de ambiente

O arquivo `.env` fica em `/services/.env` e **nunca deve ser versionado**. Use o `.env.example` como modelo.

| Variável        | Descrição                                                            |
| --------------- | -------------------------------------------------------------------- |
| `SERVICES_PORT` | Porta do serviço (padrão `3001`).                                    |
| `DATABASE_URL`  | URL de conexão com o PostgreSQL.                                     |
| `SECRET_KEY`    | Chave usada para assinar os JWT. Gere com `openssl rand -base64 32`. |
| `SMTP_HOST`     | Servidor SMTP (ex.: `smtp.gmail.com`).                               |
| `SMTP_PORT`     | Porta SMTP (ex.: `465`).                                             |
| `SMTP_SECURE`   | `true` para conexão TLS direta (porta 465).                          |
| `EMAIL_ADDRESS` | Endereço remetente dos e-mails.                                      |
| `APP_PASSWORD`  | Senha de aplicativo do provedor de e-mail.                           |
| `REDIS_URL`     | URL do Redis (ex.: `redis://localhost:6379`).                        |

> **Segurança:** `SECRET_KEY` e `APP_PASSWORD` são segredos. Se algum deles já foi exposto (commit, print, chat), troque-o imediatamente.

## 4. Autenticação

A API usa **JWT** no header `Authorization`.

**1. Obter o token**

```http
POST /auth/sign-in
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "sua_senha"
}
```

Resposta:

```json
{ "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**2. Usar o token**

```http
Authorization: Bearer <accessToken>
```

**3. Expiração**

O token expira em **5 minutos** (`expiresIn: '5m'` em `auth.module.ts`). Não há refresh token: após expirar, é preciso fazer login novamente.

> **Atenção:** a infraestrutura de JWT está configurada, mas **ainda não há guards** aplicados. Na prática, os endpoints "privados" abaixo estão acessíveis sem token.

## 5. Endpoints

### Públicos

| Método | Rota                             | Descrição                                                                   |
| ------ | -------------------------------- | --------------------------------------------------------------------------- |
| `POST` | `/auth/sign-in`                  | Autentica com e-mail e senha e retorna o `accessToken`.                     |
| `POST` | `/auth/change-password/generate` | Gera um código de 6 dígitos e o envia por e-mail. Recebe `userId` no corpo. |
| `POST` | `/auth/change-password/verify`   | Verifica se o código informado é válido para o usuário.                     |

### Privados (devem exigir JWT)

| Método  | Rota         | Descrição                                                                 |
| ------- | ------------ | ------------------------------------------------------------------------- |
| `GET`   | `/user`      | Lista todos os usuários.                                                  |
| `GET`   | `/user/:id`  | Busca um usuário pelo ID.                                                 |
| `POST`  | `/user`      | Cria um usuário.                                                          |
| `PATCH` | `/user/:id`  | Desativa o usuário (altera o status).                                     |
| `GET`   | `/duty`      | Lista todos os plantões.                                                  |
| `GET`   | `/duty/open` | Lista os plantões com status "aberto".                                    |
| `GET`   | `/duty/:id`  | Lista os plantões de um usuário. **`:id` = ID do usuário.**               |
| `POST`  | `/duty/:id`  | Cria um plantão para um usuário. **`:id` = ID do usuário.**               |
| `PATCH` | `/duty/:id`  | Registra o horário de saída (fecha o plantão). **`:id` = ID do plantão.** |

### Exemplos de corpo de requisição

> Os campos abaixo são ilustrativos. Confira os DTOs em `src/**/dto` e ajuste.

`POST /auth/change-password/generate`

```json
{ "userId": "uuid-do-usuario" }
```

`POST /auth/change-password/verify`

```json
{
  "userId": "uuid-do-usuario",
  "code": "123456"
}
```

Resposta:

```json
{
  "valid": "boolean"
}
```

`POST /user`:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "minimo8chars"
}
```

| Campo      | Tipo   | Obrigatório | Regra                      |
| ---------- | ------ | ----------- | -------------------------- |
| `name`     | string | sim         | Texto.                     |
| `email`    | string | sim         | Deve ser um e-mail válido. |
| `password` | string | sim         | Mínimo de 8 caracteres.    |

`POST /duty/:id`:

Não recebe corpo. O plantão é criado automaticamente para o usuário informado em `:id`, com o horário de entrada registrado pelo servidor e status "aberto".

## 6. Regras de negócio

**Recuperação de senha**

- O código tem **6 dígitos** e é gerado com `crypto.randomInt`.
- É armazenado no Redis na chave `pwd-reset:code:<userId>` com validade de **5 minutos**.
- É de **uso único**: após uma verificação bem-sucedida, é apagado.
- Gerar um novo código para o mesmo usuário substitui o anterior.
- O código é enviado por e-mail usando o template `template/emailRecuperar.html`.

**Plantões**

- Um plantão é criado com status "aberto" e fechado com o registro do horário de saída.
- `GET /duty/open` retorna apenas os plantões ainda abertos.

**Usuários**

- `PATCH /user/:id` desativa o usuário; não há exclusão física.

## 7. Erros

O NestJS retorna erros no formato padrão:

```json
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "error": "Bad Request"
}
```

| Status | Significado                                            |
| ------ | ------------------------------------------------------ |
| `400`  | Requisição inválida (corpo ou parâmetros incorretos).  |
| `401`  | Não autenticado (token ausente, inválido ou expirado). |
| `403`  | Sem permissão para o recurso.                          |
| `404`  | Recurso não encontrado.                                |
| `409`  | Conflito (ex.: e-mail já cadastrado).                  |
| `500`  | Erro interno.                                          |

> Datas e horários devem seguir **ISO 8601** (ex.: `2026-10-02T17:55:09-03:00`), é salvo no banco com o horário GMT+0

## 8. Dependências externas

| Serviço    | Uso                                      | Se estiver fora do ar                                        |
| ---------- | ---------------------------------------- | ------------------------------------------------------------ |
| PostgreSQL | Armazenamento dos dados                  | A API não funciona.                                          |
| Redis      | Códigos de recuperação de senha          | Geração e verificação de código falham; o restante funciona. |
| SMTP       | Envio de e-mails (código de recuperação) | O código é gerado, mas o e-mail não chega.                   |

## 9. Estrutura de pastas

```
/services
  /src
    /auth            # Autenticação e recuperação de senha
      /dto           # DTOs de requisição
      auth.controller.ts
      auth.module.ts
      auth.ts        # Serviço JWT
      change-password.ts
    /user            # Módulo de usuários
      /dto
      user.controller.ts
      user.module.ts
    /duty            # Módulo de plantões
      duty.controller.ts
      duty.module.ts
    /config          # Configurações (ex.: nodemailer)
    /repository      # Camada de acesso ao banco
    /template        # Templates HTML de e-mail
    main.ts          # Entry-point
    app.module.ts
  .env.example       # Modelo de variáveis de ambiente
  package.json
  prisma.config.ts
```
