-- BrightPair · Create chat_logs table + RLS policies

create table if not exists public.chat_logs (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  track_id      uuid references public.learning_tracks(id),
  message       text not null,
  response      text not null,
  skills_addressed jsonb,
  created_at    timestamptz not null default now()
);

alter table public.chat_logs enable row level security;

-- Students can insert/select their own rows
create policy sel_chat_logs_student on public.chat_logs
  for select
  using ( auth.uid() = student_id or public.is_staff() );

create policy ins_chat_logs_student on public.chat_logs
  for insert
  with check ( auth.uid() = student_id );

-- Staff read-all
create policy sel_chat_logs_staff on public.chat_logs
  for select to authenticated using ( public.is_staff() ); 