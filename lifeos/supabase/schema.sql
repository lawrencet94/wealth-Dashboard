-- LifeOS — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.
-- Every table is scoped to a single user via user_id + Row Level Security.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Areas — life domains
-- ---------------------------------------------------------------------------
create table if not exists areas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  icon text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  area_id uuid references areas (id) on delete set null,
  name text not null,
  status text not null default 'active' check (status in ('active', 'waiting', 'someday', 'done')),
  target_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tasks
-- ---------------------------------------------------------------------------
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  project_id uuid references projects (id) on delete set null,
  area_id uuid references areas (id) on delete set null,
  title text not null,
  notes text,
  due_date date,
  due_time time,
  priority int not null default 0 check (priority between 0 and 3),
  status text not null default 'open' check (status in ('open', 'waiting', 'done', 'dropped')),
  waiting_on text,
  recurrence_rule text,
  reminder_offsets int[] not null default '{}', -- minutes before due
  created_via text not null default 'web' check (created_via in ('voice', 'web', 'email', 'system')),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tasks_due_idx on tasks (user_id, status, due_date);

-- ---------------------------------------------------------------------------
-- Captures — raw inbound items (the trust ledger: nothing ever vanishes)
-- ---------------------------------------------------------------------------
create table if not exists captures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  raw_text text not null,
  source text not null default 'shortcut' check (source in ('shortcut', 'web', 'email')),
  parsed_json jsonb,
  confidence numeric,
  routed_to_table text,
  routed_to_id uuid,
  status text not null default 'inbox' check (status in ('routed', 'inbox', 'dismissed')),
  created_at timestamptz not null default now()
);
create index if not exists captures_inbox_idx on captures (user_id, status);

-- ---------------------------------------------------------------------------
-- Contacts — lightweight CRM
-- ---------------------------------------------------------------------------
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  relationship text,
  context_notes text,
  last_touch date,
  next_touch_due date,
  linked_area uuid references areas (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Trips
-- ---------------------------------------------------------------------------
create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  destination text,
  start_date date,
  end_date date,
  status text not null default 'idea' check (status in ('idea', 'booked', 'packing', 'done')),
  checklist_json jsonb not null default '[]', -- [{item, done}]
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Decisions — structured decision logs (car purchase, flat offer…)
-- ---------------------------------------------------------------------------
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  area_id uuid references areas (id) on delete set null,
  name text not null,
  options_json jsonb not null default '[]',  -- ["DB11", "911"]
  criteria_json jsonb not null default '[]', -- [{criterion, weight, scores: {option: n}}]
  status text not null default 'open' check (status in ('open', 'decided', 'abandoned')),
  outcome text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Habits + logs
-- ---------------------------------------------------------------------------
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  schedule text not null default 'daily',
  streak_current int not null default 0,
  streak_best int not null default 0,
  notify_time time, -- missed-routine nudge time
  track_value boolean not null default false, -- e.g. chess rating
  value_label text,
  created_at timestamptz not null default now()
);

create table if not exists habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id uuid not null references habits (id) on delete cascade,
  date date not null,
  done boolean not null default true,
  value numeric, -- optional number, e.g. chess rating
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

-- ---------------------------------------------------------------------------
-- Metrics — health datapoints
-- ---------------------------------------------------------------------------
create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('glucose_avg', 'hrv', 'weight', 'sleep')),
  value numeric not null,
  unit text,
  recorded_at timestamptz not null default now(),
  source text not null default 'manual' check (source in ('manual', 'shortcut'))
);
create index if not exists metrics_type_idx on metrics (user_id, type, recorded_at desc);

-- ---------------------------------------------------------------------------
-- Notes — freeform, attachable to any entity
-- ---------------------------------------------------------------------------
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  entity_type text, -- 'area' | 'project' | 'task' | 'trip' | 'contact' | 'decision' | null
  entity_id uuid,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Wealth snapshots — manual weekly numbers (Wealth Garden stays the system of record)
-- ---------------------------------------------------------------------------
create table if not exists wealth_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  net_worth numeric,
  savings_goal_progress numeric, -- 0..1
  month_spend numeric,
  recorded_at date not null default current_date
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on tasks;
create trigger tasks_updated_at before update on tasks
  for each row execute function set_updated_at();

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — single user, owner-only access on every table
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'areas','projects','tasks','captures','contacts','trips',
    'decisions','habits','habit_logs','metrics','notes','wealth_snapshots'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "owner_all" on %I', t);
    execute format(
      'create policy "owner_all" on %I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t
    );
  end loop;
end;
$$;
