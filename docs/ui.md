# Sharkin: UI

Interface web do Sharkin, consome a API de `services`.

- Login e logout com autenticação JWT
- Cadastro de novos usuários
- Recuperação de senha com código de verificação de 6 dígitos
- Área do usuário logado, com a lista de plantões e o botão para registrar a entrada e saída
- Lista de plantões abertos na tela inicial

> **Terminologia:** o código usa `duty` para designar **plantão**. Esta documentação usa "plantão" em todo o texto.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Como rodar localmente](#2-como-rodar-localmente)
3. [Variáveis de ambiente](#3-variáveis-de-ambiente)
4. [Rotas da aplicação](#4-rotas-da-aplicação)
5. [Integração com a API](#5-integração-com-a-api)
6. [Endpoints consumidos](#6-endpoints-consumidos)
7. [Fluxos principais](#7-fluxos-principais)
8. [Dependências externas](#8-dependências-externas)
9. [Estrutura de pastas](#9-estrutura-de-pastas)
10. [Pendências conhecidas](#10-pendências-conhecidas)

---

## 1. Pré-requisitos

- Bun (ou Nodejs) instalado
- Serviço `services` em execução (por padrão em `http://localhost:3001`), com PostgreSQL e Redis disponíveis para ele. Veja `services.md`.

## 2. Como rodar localmente

```bash
cd ui
bun install        # instala as dependências (primeira vez)
cp .env.example .env
bun dev            # servidor de desenvolvimento
```

Para o modo produção:

```bash
bun start          # NODE_ENV=production
```

A interface fica disponível em `http://localhost:3000`. A API precisa estar rodando em paralelo, ou as telas que dependem dela não funcionam.

## 3. Variáveis de ambiente

O arquivo `.env` fica em `/ui/.env` e não deve ser versionado. Use o `.env.example` como modelo.

| Variável  | Descrição                                              |
| --------- | ------------------------------------------------------ |
| `UI_PORT` | Porta em que a interface será servida (padrão `3000`). |

## 4. Rotas da aplicação

As rotas são configuradas com React Router em `src/frontend.tsx`.

| Rota                | Página                 | Descrição                                          |
| ------------------- | ---------------------- | -------------------------------------------------- |
| `/`                 | `LoginPage`            | Login e lista de plantões abertos.                 |
| `/cadastro`         | `RegisterPage`         | Cadastro de novo usuário.                          |
| `/recuperar-senha`  | `RecoverPasswordPage`  | Passo 1 da recuperação: informar o e-mail.         |
| `/verificar-codigo` | `VerificationCodePage` | Passo 2: informar o código de 6 dígitos.           |
| `/redefinir-senha`  | `ResetPasswordPage`    | Passo 3: definir a nova senha.                     |
| `/usuario`          | `UserPage`             | Área logada: plantões do usuário e botão de saída. |

## 5. Integração com a API

O cliente HTTP é uma instância do **axios** (`sharkinApi`), definida em `src/api/api.ts`, com `baseURL` em `http://localhost:3001`.

### Autenticação

1. O usuário faz login em `/` e a UI chama `POST /auth/sign-in`.
2. Em caso de sucesso, o `accessToken` é salvo em `localStorage` na chave `token`.
3. O token é enviado no header `Authorization: Bearer <token>` nas requisições privadas.
4. A `UserPage` decodifica o token com `jwt-decode` e usa o campo `sub` (ID do usuário) para buscar os plantões e o `username` para exibir o nome.
5. O token expira em **5 minutos** (regra do serviço `services`). Não há refresh token: após expirar, é preciso fazer login novamente.

### Recuperação de senha

O estado do fluxo (`idle`, `email`, `code`, `password`) é controlado pelo `PasswordRecoveryContext`, e o `RecoveryStepRoute` decide qual passo exibir.

### Tratamento de erros

Os erros do axios são tratados com `instanceof AxiosError`, lendo `err.response?.status` e `err.response?.data`.

| Status | Onde é tratado               | Mensagem ao usuário                |
| ------ | ---------------------------- | ---------------------------------- |
| `409`  | `RegisterPage`               | E-mail já cadastrado.              |
| `400`  | `RegisterPage` e `LoginPage` | Dados inválidos.                   |
| `401`  | (não tratado)                | Hoje apenas registrado no console. |
| outros | Páginas em geral             | Mensagem genérica.                 |

Erros de rede são capturados no `catch`, registrados no console e exibidos como mensagem amigável.

## 6. Endpoints consumidos

| Método  | Rota do serviço                  | Uso na UI                                                  | Página                          |
| ------- | -------------------------------- | ---------------------------------------------------------- | ------------------------------- |
| `POST`  | `/auth/sign-in`                  | Login. Retorna o `accessToken`.                            | `LoginPage`                     |
| `POST`  | `/user`                          | Cadastro de usuário.                                       | `RegisterPage`                  |
| `POST`  | `/auth/change-password/generate` | Envia o código de 6 dígitos por e-mail.                    | `RecoverPasswordPage`           |
| `POST`  | `/auth/change-password/verify`   | Valida o código informado.                                 | `VerificationCodePage`          |
| `GET`   | `/duty/open`                     | Lista os plantões abertos.                                 | `LoginPage`                     |
| `GET`   | `/duty/:userId`                  | Lista os plantões do usuário (`userId` vem do `sub`).      | `UserPage`                      |
| `PATCH` | `/duty/:id`                      | Registra a saída (fecha o plantão). `:id` = ID do plantão. | `UserPage` (`DutyToggleButton`) |

Os detalhes de cada endpoint (corpo, respostas, regras) estão no README do `services`.

## 7. Fluxos principais

### Login

1. O usuário acessa `http://localhost:3000` e a `LoginPage` é exibida.
2. Preenche e-mail e senha e envia o formulário.
3. A UI chama `POST /auth/sign-in`.
4. Em sucesso, salva o `accessToken` em `localStorage["token"]` e redireciona para `/usuario`.
5. Em falha, exibe uma mensagem de erro (ex.: e-mail ou senha incorretos).

### Cadastro

1. O usuário clica em "Cadastrar" na `LoginPage` ou acessa `/cadastro`.
2. Preenche nome, e-mail, senha (mínimo de 8 caracteres) e confirmação de senha.
3. A UI chama `POST /user`.
4. Em sucesso, redireciona para `/`. Em falha, exibe mensagens específicas (`409` e-mail duplicado, `400` dados inválidos).

### Recuperação de senha

1. O usuário clica em "Esqueci minha senha" e abre a `RecoverPasswordPage`.
2. Informa o e-mail e a UI chama `POST /auth/change-password/generate`, que envia o código por e-mail.
3. Na `VerificationCodePage`, informa o código e a UI chama `POST /auth/change-password/verify`.
4. Na `ResetPasswordPage`, define a nova senha.
5. Depois de salvar, o usuário faz login com a nova senha.

### Área logada

1. Após o login, o usuário é redirecionado para `/usuario`.
2. A `UserPage` lê o token, decodifica e exibe o nome do usuário.
3. Chama `GET /duty/:sub` e lista os plantões em cards, com data e hora de entrada e a situação (aberto ou fechado).
4. O botão de alternância (`DutyToggleButton`) registra a saída com `PATCH /duty/:id`.
5. Se o token expirar, a requisição falha com `401` e o usuário precisa entrar de novo.

## 8. Dependências externas

| Dependência    | Uso                             | Se estiver fora do ar                           |
| -------------- | ------------------------------- | ----------------------------------------------- |
| API `services` | Todos os dados e a autenticação | Login, cadastro e plantões deixam de funcionar. |

Principais bibliotecas: React 19, React Router, Axios, `jwt-decode`, `react-hook-form` e Tailwind CSS v4.

## 9. Estrutura de pastas

```
ui/
├── src/
│   ├── api/                         # Cliente axios configurado para a API
│   │   └── api.ts
│   ├── assets/                      # Logos, ícones de e-mail e de mostrar/ocultar senha
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── auth/                    # Componentes das telas de autenticação
│   │   │   ├── AuthLayout.tsx       # Layout das telas de auth
│   │   │   ├── AuthButton.tsx       # Botão de envio dos formulários
│   │   │   ├── AuthField.tsx        # Campo de input, com mostrar/ocultar senha
│   │   │   └── RecoveryStepRoute.tsx # Controla os passos da recuperação de senha
│   │   ├── buttons/                 # DutyToggleButton, LoginButton
│   │   ├── cards/                   # ActiveDutyCard, DutyCard, LoginCard
│   │   └── headers/                 # UserHeader, WelcomeHeader
│   ├── contexts/
│   │   └── PasswordRecoveryContext.tsx # Passos da recuperação: idle, email, code, password
│   ├── functions/                   # Funções auxiliares de formatação e ordenação
│   │   ├── formatActiveDutyDate.ts
│   │   ├── formatDutyDate.ts
│   │   └── sortingDuties.ts
│   ├── pages/                       # Páginas da aplicação
│   │   ├── LoginPage.tsx            # Login e plantões abertos
│   │   ├── RegisterPage.tsx         # Cadastro de usuário
│   │   ├── UserPage.tsx             # Área logada
│   │   ├── RecoverPasswordPage.tsx  # Recuperação, passo 1: e-mail
│   │   ├── VerificationCodePage.tsx # Recuperação, passo 2: código
│   │   └── ResetPasswordPage.tsx    # Recuperação, passo 3: nova senha
│   ├── styles/                      # CSS por área (login, user, auth)
│   ├── types/
│   │   └── uiTypes.ts               # JwtPayload, CardData e tipos de resposta
│   ├── frontend.tsx                 # Rotas (React Router) e renderização do root
│   ├── index.css                    # CSS global (Tailwind v4)
│   ├── index.html                   # HTML base servido pelo Bun
│   └── index.ts                     # Entry-point, inicia o servidor Bun
├── .env.example                     # Modelo de variáveis de ambiente
├── bun.lock
├── bunfig.toml                      # Configuração do Bun
├── package.json
└── tsconfig.json
```
