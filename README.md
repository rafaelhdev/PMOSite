# PMOSite

Projeto em desenvolvimento colaborativo.

## Colaboradores

- rafael.silva
- rv.teixeira

## Fluxo de branches

- `main` — produção (código estável)
- `dev` — integração (PRs das branches individuais vão aqui antes de ir para main)
- `rafael.silva` — branch de desenvolvimento individual
- `rv.teixeira` — branch de desenvolvimento individual

## Fluxo do Board

| Etapa | Gatilho |
|---|---|
| **Backlog** | Issue criada e aguardando priorização |
| **In Progress** | Issue atribuída e em desenvolvimento |
| **Blocked** | Issue com impedimento que impede o avanço |
| **In Review** | PR aberta para `dev` |
| **Testing** | PR aprovada pelo revisor |
| **Done** | PR mergeada na `main` |

## Objetivo

Desenvolver um **Calendário de Férias** para o time, com as seguintes funcionalidades:

- Registro de intenções de férias para o ano
- Confirmação pelo próprio colaborador quando as férias forem aprovadas
- Registro de backup durante o período de férias
- Abertura de solicitação no Fluig

## Stack Tecnológica

- **Frontend:** React + Vite
- **Estilização:** TailwindCSS

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [Git](https://git-scm.com/)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/rafaelhdev/PMOSite.git
cd PMOSite
```

**2. Crie sua branch de trabalho**
```bash
git checkout dev
git checkout -b seu.nome
```

**3. Instale as dependências**
```bash
npm install
```

**4. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`.

**5. Para gerar o build de produção**
```bash
npm run build
```

## Status

Em desenvolvimento.
