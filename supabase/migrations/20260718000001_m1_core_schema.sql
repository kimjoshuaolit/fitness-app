-- ============================================================
-- Migration 001 — M1 Core Schema
-- Fitness Tracking App (Kim)
-- Tables: profiles, phases, decisions, daily_weights, weekly_entries
-- RLS: owner-only from day one (auth.uid() = user_id)
-- Views: v_daily_weights (7-day rolling avg + delta), v_phase_summary
-- ============================================================

-- ---------- PROFILES ----------
-- One row per auth user. Auto-created by trigger on signup.
create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  role        text not null default 'athlete' check (role in ('athlete', 'coach')),
  height_cm   numeric(5,1),
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: select own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- PHASES ----------
create table public.phases (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  name              text not null,                          -- e.g. 'Cut Phase 2'
  start_date        date not null,
  end_date          date,                                   -- null while open-ended
  status            text not null default 'active'
                      check (status in ('planned', 'active', 'completed')),
  -- Targets (all optional — flags only computed when set)
  goal_weight_low_lbs   numeric(5,1),
  goal_weight_high_lbs  numeric(5,1),
  goal_waist_cm         numeric(5,1),
  calorie_low           integer,
  calorie_high          integer,
  protein_floor_g       integer,
  notes             text,
  created_at        timestamptz not null default now()
);

create index idx_phases_user on public.phases (user_id, status);

alter table public.phases enable row level security;

create policy "phases: all own"
  on public.phases for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- DECISIONS (per phase) ----------
create table public.decisions (
  id          uuid primary key default gen_random_uuid(),
  phase_id    uuid not null references public.phases (id) on delete cascade,
  decided_on  date not null default current_date,
  decision    text not null,
  rationale   text not null default '',
  status      text not null default 'active'
                check (status in ('active', 'completed', 'superseded')),
  created_at  timestamptz not null default now()
);

create index idx_decisions_phase on public.decisions (phase_id, decided_on);

alter table public.decisions enable row level security;

-- Ownership flows through the parent phase
create policy "decisions: all via own phase"
  on public.decisions for all
  using (exists (
    select 1 from public.phases p
    where p.id = decisions.phase_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.phases p
    where p.id = decisions.phase_id and p.user_id = auth.uid()
  ));

-- ---------- DAILY WEIGHTS ----------
-- Not tied to a phase: weight history is continuous across phases.
create table public.daily_weights (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  entry_date  date not null,
  weight_lbs  numeric(5,1) not null check (weight_lbs between 50 and 500),
  created_at  timestamptz not null default now(),
  unique (user_id, entry_date)                 -- one weigh-in per day; upsert on conflict
);

create index idx_weights_user_date on public.daily_weights (user_id, entry_date desc);

alter table public.daily_weights enable row level security;

create policy "daily_weights: all own"
  on public.daily_weights for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------- WEEKLY ENTRIES ----------
create table public.weekly_entries (
  id            uuid primary key default gen_random_uuid(),
  phase_id      uuid not null references public.phases (id) on delete cascade,
  week_start    date not null,               -- Monday of the week
  waist_cm      numeric(5,1),
  calories_avg  integer,
  protein_avg_g integer,
  carbs_avg_g   integer,
  fats_avg_g    integer,
  steps_avg     integer,
  sleep_avg_hrs numeric(3,1),
  performance_notes text not null default '',  -- key lifts, e.g. 'Squat 85kg 2x8 clean'
  notes         text not null default '',
  created_at    timestamptz not null default now(),
  unique (phase_id, week_start)
);

create index idx_weekly_phase on public.weekly_entries (phase_id, week_start);

alter table public.weekly_entries enable row level security;

create policy "weekly_entries: all via own phase"
  on public.weekly_entries for all
  using (exists (
    select 1 from public.phases p
    where p.id = weekly_entries.phase_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.phases p
    where p.id = weekly_entries.phase_id and p.user_id = auth.uid()
  ));

-- ---------- VIEWS ----------
-- security_invoker = true → views respect the querying user's RLS.
-- (Without it, views run as owner and would bypass RLS.)

-- Daily weights with 7-day rolling average and day-over-day delta.
create view public.v_daily_weights
with (security_invoker = true) as
select
  w.user_id,
  w.entry_date,
  w.weight_lbs,
  round(avg(w.weight_lbs) over (
    partition by w.user_id
    order by w.entry_date
    rows between 6 preceding and current row
  ), 1) as avg_7d,
  round(w.weight_lbs - lag(w.weight_lbs) over (
    partition by w.user_id order by w.entry_date
  ), 1) as delta_prev
from public.daily_weights w;

-- Weekly entries with status flags computed against phase targets.
-- Flags are null when the target isn't set or the metric wasn't logged.
create view public.v_weekly_status
with (security_invoker = true) as
select
  we.*,
  p.user_id,
  p.name as phase_name,
  case
    when we.calories_avg is null or p.calorie_low is null then null
    else we.calories_avg between p.calorie_low and p.calorie_high
  end as calories_ok,
  case
    when we.protein_avg_g is null or p.protein_floor_g is null then null
    else we.protein_avg_g >= p.protein_floor_g
  end as protein_ok
from public.weekly_entries we
join public.phases p on p.id = we.phase_id;

-- Phase summary: latest metrics vs targets.
create view public.v_phase_summary
with (security_invoker = true) as
select
  p.id as phase_id,
  p.user_id,
  p.name,
  p.status,
  p.start_date,
  p.end_date,
  p.goal_waist_cm,
  p.goal_weight_low_lbs,
  p.goal_weight_high_lbs,
  (select we.waist_cm
     from public.weekly_entries we
     where we.phase_id = p.id and we.waist_cm is not null
     order by we.week_start asc limit 1)  as start_waist_cm,
  (select we.waist_cm
     from public.weekly_entries we
     where we.phase_id = p.id and we.waist_cm is not null
     order by we.week_start desc limit 1) as current_waist_cm,
  (select count(*) from public.weekly_entries we
     where we.phase_id = p.id)            as weeks_logged
from public.phases p;
