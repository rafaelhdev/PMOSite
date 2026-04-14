# Guia de Contribuição — PMOSite

## Fluxo de branches

```
rafael.silva / rv.teixeira → dev → main
```

- Todo desenvolvimento deve ser feito na branch individual de cada colaborador
- O merge para `dev` requer **1 aprovação** do outro colaborador
- O merge para `main` requer **1 aprovação do outro colaborador** (o autor do PR não pode aprovar o próprio PR)

## Regras do board (GitHub Projects)

### Status das tarefas

| Status | Quando usar |
|---|---|
| `Backlog` | Tarefa identificada mas ainda não iniciada |
| `Ready` | Tarefa pronta para ser iniciada |
| `In progress` | Tarefa em desenvolvimento ativo |
| `In review` | PR aberta aguardando revisão |
| `Blocked` | Tarefa bloqueada aguardando dependência ou decisão |
| `Done` | Tarefa concluída e mergeada |

### Automações ativas

- **PR aberta ou revisão solicitada** → item movido automaticamente para `In review`
- **PR mergeada** → item movido automaticamente para `Done`
- **Issue fechada** → item fechado automaticamente no board

### Convenções

- Toda tarefa no board deve ser uma **issue real** (não draft) para ter numeração e facilitar a comunicação
- Ao abrir um PR, vincule-o à issue correspondente usando `Closes #<número>` na descrição
- O assignee da tarefa no board deve refletir quem está responsável pela revisão ou execução

## Configuração do ambiente local

Após clonar o repositório, execute o comando abaixo para instalar o hook de validação de commits:

```bash
cp .github/hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg
```

## Padrão de commits

Todo commit deve referenciar a issue associada usando `#número`:

```
Add vacation calendar feature #4
Fix approval flow bug #6
```

Commits sem referência a uma issue serão rejeitados localmente pelo hook e bloqueados no PR pelo GitHub Action.

## Revisão de código

- As revisões são cruzadas: **rafael.silva revisa rv.teixeira** e vice-versa
- Isso é garantido pelo arquivo `.github/CODEOWNERS`
- Aprovações são descartadas automaticamente se novos commits forem adicionados ao PR

## Comunicação

- Usar os números das issues/PRs (#4, #5...) para referenciar tarefas nas conversas
- Decisões relevantes devem ser registradas em `docs/decisoes.md`
- Atas de reunião devem ser registradas em `docs/reunioes.md`
- Ações de follow-up devem ser registradas em `docs/acoes.md`
