# Sharkin: Report

Serviço em Python que gera o **relatório semanal de plantões** em PDF e o envia por e-mail. Roda de forma agendada (sem API REST), consulta diretamente o PostgreSQL e usa o mesmo banco do serviço `services`.

- Calcula o período da semana (segunda-feira até o dia da execução)
- Busca os plantões no banco de dados
- Gera um PDF estilizado a partir de um template HTML
- Envia o PDF por e-mail, com imagens embutidas no corpo

> **Terminologia:** o código usa `duty` para designar **plantão**. Esta documentação usa "plantão" em todo o texto.

---

## Sumário

1. [Pré-requisitos](#1-pré-requisitos)
2. [Como rodar localmente](#2-como-rodar-localmente)
3. [Variáveis de ambiente](#3-variáveis-de-ambiente)
4. [Agendamento](#4-agendamento)
5. [Fluxo de execução](#5-fluxo-de-execução)
6. [Regras de negócio](#6-regras-de-negócio)
7. [Dependências externas](#7-dependências-externas)
8. [Estrutura de pastas](#8-estrutura-de-pastas)
9. [Pendências conhecidas](#9-pendências-conhecidas)

---

## 1. Pré-requisitos

- Python 3.12 ou superior
- Acesso ao PostgreSQL do serviço `services` (tabelas `duties` e `users`)
- Bibliotecas de sistema exigidas pelo WeasyPrint (Pango, entre outras). Veja a documentação oficial do WeasyPrint para o seu sistema operacional.

## 2. Como rodar localmente

```bash
cd report
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # preencha os valores (ver seção 3)
python app.py
```

> Ajuste os comandos conforme o gerenciador de dependências usado no projeto. O processo precisa ficar **em execução** para o agendador disparar o envio (ver seção 4).

Para testar sem esperar a sexta-feira, chame a função `main()` diretamente.

## 3. Variáveis de ambiente

O arquivo `.env` fica em `/report/.env` e **nunca deve ser versionado**. Use o `.env.example` como modelo.

| Variável           | Descrição                                                        |
| ------------------ | ---------------------------------------------------------------- |
| `DATABASE_URL`     | URL de conexão com o PostgreSQL (a mesma do serviço `services`). |
| `SMTP_HOST`        | Servidor SMTP (ex.: `smtp.gmail.com`).                           |
| `SMTP_PORT`        | Porta SMTP (padrão `587`, com STARTTLS).                         |
| `SMTP_USER`        | Usuário SMTP, também usado como remetente.                       |
| `SMTP_PASSWORD`    | Senha de aplicativo do provedor de e-mail.                       |
| `REPORT_RECIPIENT` | Destinatário do relatório semanal.                               |

> **Segurança:** `DATABASE_URL` e `SMTP_PASSWORD` são segredos. Se algum deles já foi exposto (commit, print, chat), troque-o imediatamente.

## 4. Agendamento

O agendamento é feito com **APScheduler**.

| Item           | Valor                         |
| -------------- | ----------------------------- |
| Dia e horário  | Toda **sexta-feira às 18:20** |
| Fuso horário   | `America/Sao_Paulo`           |
| Função chamada | `main()` em `app.py`          |

O agendador vive dentro do processo Python. Se o processo estiver parado no horário, **o relatório não é enviado** e não há reexecução automática. Em produção, rode-o sob um gerenciador de processos (systemd, Docker com `restart: always`, PM2 etc.).

## 5. Fluxo de execução

1. **Disparo:** o APScheduler chama `main()`.
2. **Período:** a data de início é a segunda-feira da semana (`today - timedelta(days=today.weekday())`) e a data de fim é o dia da execução.
3. **Busca:** `fetchDuties(start_date, end_date)` faz um `JOIN` entre `duties` e `users` e retorna `dateTime_in`, `dateTime_out` e o nome do usuário.
4. **Formatação:** `formatDays(duties)` organiza os dados em uma `list[dict]` por dia, no formato esperado pelo template.
5. **PDF:** `genPdf(days)` renderiza o template Jinja2 com título, dias e logo (em data URI), converte para PDF com WeasyPrint usando o CSS do relatório e salva em `pdf/reports/`.
6. **E-mail:** `send_report(pdfPath)` monta a mensagem, anexa o PDF e envia via SMTP com STARTTLS.

## 6. Regras de negócio

**Período do relatório**

- Início: segunda-feira da semana atual.
- Fim: dia da execução (sexta-feira, no agendamento normal).
- O filtro é inclusivo nas duas pontas e compara apenas a **data** de entrada: `duties."dateTime_in"::date >= start_date AND duties."dateTime_in"::date <= end_date`.
- Um plantão é considerado da semana pela data de **entrada**.

**E-mail**

- Remetente: `SMTP_USER`. Destinatário: `REPORT_RECIPIENT`.
- Assunto: `Relatório semanal de plantões: DD/MM/AAAA - DD/MM/AAAA`.
- O corpo tem versão em texto puro (fallback) e versão HTML, com as imagens do topo e do rodapé embutidas via `cid` (`topo` e `rodape`).
- O PDF vai como anexo.

**Arquivos gerados**

- Nome do PDF: `report-AAAA-MM-DD_HH-MM-SS.pdf`.
- Os PDFs são salvos em `pdf/reports/` e **não são apagados automaticamente**.

## 7. Dependências externas

| Serviço    | Uso                  | Se estiver fora do ar                               |
| ---------- | -------------------- | --------------------------------------------------- |
| PostgreSQL | Leitura dos plantões | A execução falha e nenhum relatório é gerado.       |
| SMTP       | Envio do relatório   | O PDF é gerado e salvo, mas o e-mail não é enviado. |

> Não há tratamento de falha nem reenvio automático. Veja as pendências.

## 8. Estrutura de pastas

```
report/
├── app.py                    # Entry-point, agendador e função main()
├── database/                 # Acesso ao banco
│   ├── connection.py         # Engine SQLAlchemy criada com DATABASE_URL
│   └── query.py              # fetchDuties: JOIN entre duties e users
├── emails/                   # Envio de e-mail
│   ├── sender.py             # send_report: monta a mensagem (texto, HTML, PDF)
│   └── template/
│       ├── email_template.html   # Corpo HTML do e-mail
│       └── assets/           # Imagens usadas via cid (topo e rodapé)
├── pdf/                      # Geração do PDF
│   ├── format/
│   │   └── format_entries.py # formatDays: organiza os dados por dia
│   ├── pdf_gen.py            # genPdf: HTML para PDF com WeasyPrint
│   ├── template/             # Template HTML (Jinja2), CSS e assets do PDF
│   └── reports/              # PDFs gerados
├── .env.example              # Modelo de variáveis de ambiente
└── requirements.txt
```

## 9. Pendências conhecidas

- [ ] Renomear as imagens `Linha (1).jpg` e `Linha (5).jpg` para nomes sem espaços e parênteses (ex.: `topo.jpg` e `rodape.jpg`).
- [ ] Tratar falhas (banco, WeasyPrint, SMTP) com log e reenvio, para que uma falha não passe despercebida.
- [ ] Limpar PDFs antigos de `pdf/reports/`.
