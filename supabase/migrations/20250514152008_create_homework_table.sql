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

drop policy if exists sel_homework on public.homework;

create policy sel_homework
  on public.homework
  for select
  using (
    public.is_staff()
    or tutor_id   = auth.uid()
    or student_id = auth.uid()
    or public.is_parent_of(student_id)
  );

drop policy if exists ins_homework_tutor on public.homework;

create policy ins_homework_tutor
  on public.homework
  for insert
  with check ( tutor_id = auth.uid() );

drop policy if exists upd_homework_tutor on public.homework;

create policy upd_homework_tutor
  on public.homework
  for update
  using ( tutor_id = auth.uid() );
