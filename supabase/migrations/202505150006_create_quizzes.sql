-- BrightPair · Create quizzes table + RLS policies

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  tutor_id   uuid references public.profiles(id),
  skill_id   uuid,
  quiz_json  jsonb not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.quizzes enable row level security;

create policy sel_quizzes on public.quizzes
  for select using (
    public.is_staff() or auth.uid() = student_id or auth.uid() = tutor_id
  );

create policy ins_quizzes_tutor on public.quizzes
  for insert with check ( auth.uid() = tutor_id );

create policy upd_quizzes_student on public.quizzes
  for update using ( auth.uid() = student_id ); 