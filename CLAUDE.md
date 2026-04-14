# PMOSite — Guia para Claude

## Visão Geral
Plataforma web de gerenciamento de férias para o time de PMO.
Stack: React + Vite + TypeScript + TailwindCSS.

## Estrutura de Pastas

```
src/
  components/
    layout/    → Header, Footer, Layout
    ui/        → Componentes reutilizáveis (StatusBadge, etc.)
  context/     → AppContext (estado global com React Context)
  pages/       → Uma página por rota
  types/       → Tipos TypeScript globais
```

## Branches

| Branch | Uso |
|--------|-----|
| `main` | Produção — código estável |
| `dev` | Integração — PRs das branches individuais vão aqui antes da main |
| `rafael.silva` | Branch de desenvolvimento do Rafael |
| `rv.teixeira` | Branch de desenvolvimento da Rebeca |

**Fluxo:** `rafael.silva` / `rv.teixeira` → PR para `dev` → PR para `main`

## Regras de Commit

Toda mensagem de commit **deve** referenciar uma issue:

```
Descrição da mudança #<número-da-issue>
```

Exemplos válidos:
- `Add vacation calendar component #19`
- `Fix conflict validation logic #23`
- `Configurar TailwindCSS #12`

O hook em `.github/hooks/commit-msg` valida isso automaticamente.

## Regras de PR

- PRs sempre vão para `dev` (nunca direto para `main`)
- Requer 1 aprovação de outro membro
- Não é possível aprovar o próprio PR
- Issues com PR aberta não podem ser fechadas manualmente

## Paleta de Cores

Definida em `tailwind.config.js` como `primary`:

| Token | Hex | Uso |
|-------|-----|-----|
| `primary-600` | `#1F4E79` | Cor principal (header, títulos) |
| `primary-500` | `#2E75B6` | Cor secundária (links, badges) |
| `primary-50`  | `#e8f0f9` | Fundo suave |

## Status de Férias

| Status | Descrição |
|--------|-----------|
| `intention` | Intenção registrada, aguardando aprovação |
| `approved` | Aprovado pelo gestor |
| `confirmed` | Confirmado pelo próprio colaborador |
| `denied` | Negado |

## Status Fluig

| Status | Descrição |
|--------|-----------|
| `not_sent` | Ainda não enviado ao Fluig |
| `pending` | Aguardando resposta do Fluig |
| `approved` | Aprovado no Fluig |
| `denied` | Negado no Fluig |

## Rotas

| Rota | Página |
|------|--------|
| `/` | Dashboard |
| `/calendar` | Calendário Anual |
| `/collaborators` | Listagem de Colaboradores |
| `/collaborators/new` | Cadastro de Colaborador |
| `/collaborators/:id` | Perfil do Colaborador |
| `/vacations` | Gestão de Férias (intenção, aprovação, Fluig) |

## Comandos

```bash
npm install       # instalar dependências
npm run dev       # servidor de desenvolvimento (http://localhost:5173)
npm run build     # build de produção
npm run lint      # lint
```
