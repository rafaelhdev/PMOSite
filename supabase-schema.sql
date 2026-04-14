-- Tabela de colaboradores
create table if not exists collaborators (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  email text not null unique,
  github text not null,
  avatar_url text
);

-- Tabela de férias
create table if not exists vacations (
  id uuid primary key default gen_random_uuid(),
  collaborator_id uuid not null references collaborators(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status text not null default 'intention',
  backup_id uuid references collaborators(id),
  fluig_status text not null default 'not_sent',
  fluig_protocol text,
  created_at timestamptz not null default now()
);

-- Dados iniciais
insert into collaborators (name, role, email, github) values
  ('Rafael Silva', 'Desenvolvedor Frontend', 'rafael.silva@sidi.org.br', '@rafaelhdev'),
  ('Rebeca Valgueiro', 'Desenvolvedora Frontend', 'rv.teixeira@sidi.org.br', '@rebecavalgueiro')
on conflict (email) do nothing;

-- Habilitar RLS (Row Level Security) com acesso público para desenvolvimento
alter table collaborators enable row level security;
alter table vacations enable row level security;

create policy "public read collaborators" on collaborators for select using (true);
create policy "public insert collaborators" on collaborators for insert with check (true);
create policy "public update collaborators" on collaborators for update using (true);

create policy "public read vacations" on vacations for select using (true);
create policy "public insert vacations" on vacations for insert with check (true);
create policy "public update vacations" on vacations for update using (true);
create policy "public delete vacations" on vacations for delete using (true);
