-- ============================================================
-- PMOSite — Schema v2
-- Autenticação via Supabase Auth (auth.users)
-- RLS baseado em auth.uid() e role (is_manager)
-- ============================================================

-- Tabela de colaboradores
create table if not exists collaborators (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text not null,      -- cargo/função (ex: "Desenvolvedor Frontend")
  email        text not null unique,
  github       text not null,
  avatar_url   text,
  is_manager   boolean not null default false,  -- true = gestor, pode aprovar férias
  user_id      uuid unique references auth.users(id) on delete set null  -- vinculo com login
);

-- Tabela de férias
create table if not exists vacations (
  id              uuid primary key default gen_random_uuid(),
  collaborator_id uuid not null references collaborators(id) on delete cascade,
  start_date      date not null,
  end_date        date not null,
  status          text not null default 'intention'
                  check (status in ('intention','approved','denied','confirmed')),
  backup_id       uuid references collaborators(id),
  fluig_status    text not null default 'not_sent'
                  check (fluig_status in ('not_sent','pending','approved','denied')),
  fluig_protocol  text,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- INDEXES — performance para 50+ colaboradores
-- ============================================================
create index if not exists idx_vacations_collaborator_id on vacations(collaborator_id);
create index if not exists idx_vacations_status          on vacations(status);
create index if not exists idx_vacations_dates           on vacations(start_date, end_date);
create index if not exists idx_collaborators_is_manager  on collaborators(is_manager);
create index if not exists idx_collaborators_user_id     on collaborators(user_id);

-- ============================================================
-- Habilitar RLS
-- ============================================================
alter table collaborators enable row level security;
alter table vacations     enable row level security;

-- ============================================================
-- Helper: verifica se o usuário autenticado é gestor
-- ============================================================
create or replace function is_manager()
returns boolean
language sql stable
as $$
  select coalesce(
    (select is_manager from collaborators where user_id = auth.uid() limit 1),
    false
  );
$$;

-- ============================================================
-- POLICIES — collaborators
-- ============================================================

-- Todos os autenticados podem ver todos os colaboradores (necessário para selects de backup etc.)
create policy "collaborators: autenticados leem tudo"
  on collaborators for select
  to authenticated
  using (true);

-- Gestores podem inserir colaboradores
create policy "collaborators: gestores inserem"
  on collaborators for insert
  to authenticated
  with check (is_manager());

-- Gestores podem editar qualquer colaborador; colaborador edita apenas o próprio
create policy "collaborators: gestores editam todos / colaborador edita si mesmo"
  on collaborators for update
  to authenticated
  using (is_manager() or user_id = auth.uid());

-- Apenas gestores podem deletar colaboradores
create policy "collaborators: gestores deletam"
  on collaborators for delete
  to authenticated
  using (is_manager());

-- ============================================================
-- POLICIES — vacations
-- ============================================================

-- Todos os autenticados podem ver todas as férias (necessário para detecção de conflitos)
create policy "vacations: autenticados leem tudo"
  on vacations for select
  to authenticated
  using (true);

-- Colaborador registra apenas as próprias férias
create policy "vacations: colaborador insere as próprias"
  on vacations for insert
  to authenticated
  with check (
    collaborator_id = (select id from collaborators where user_id = auth.uid() limit 1)
  );

-- Colaborador atualiza apenas as próprias férias (intenção, datas);
-- Gestor pode atualizar qualquer férias (aprovar, confirmar, denegar, fluig)
create policy "vacations: update por dono ou gestor"
  on vacations for update
  to authenticated
  using (
    is_manager()
    or collaborator_id = (select id from collaborators where user_id = auth.uid() limit 1)
  );

-- Apenas o dono (enquanto ainda é intenção) ou gestor pode deletar
create policy "vacations: delete por dono (intenção) ou gestor"
  on vacations for delete
  to authenticated
  using (
    is_manager()
    or (
      status = 'intention'
      and collaborator_id = (select id from collaborators where user_id = auth.uid() limit 1)
    )
  );

-- ============================================================
-- Dados iniciais de exemplo (apenas se não existir)
-- ============================================================
insert into collaborators (name, role, email, github, is_manager) values
  ('Rafael Silva',    'Desenvolvedor Frontend', 'rafael.silva@sidi.org.br',   '@rafaelhdev',        false),
  ('Rebeca Valgueiro','Desenvolvedora Frontend','rv.teixeira@sidi.org.br',    '@rebecavalgueiro',   false),
  ('Gestor PMO',      'Gerente de Projetos',    'gestor.pmo@sidi.org.br',     '@gestorpmo',         true)
on conflict (email) do nothing;
