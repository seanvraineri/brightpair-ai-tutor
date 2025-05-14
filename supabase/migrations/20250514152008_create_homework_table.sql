-- Homework table and RLS policies
create table if not exists public.homework (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade,
  tutor_id   uuid references public.profiles(id),
  title      text not null,
  content_md text,
  due_at     timestamptz,
  status     text default 'not_started',
  created_at timestamptz default now()
);

alter table public.homework enable row level security;

-- Policies referencing tutor_id will be added in a subsequent patch migration.
