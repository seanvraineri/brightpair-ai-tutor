-- BrightPair · Create lessons table + RLS policies

create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.profiles(id) on delete cascade,
  tutor_id     uuid references public.profiles(id),
  title        text not null,
  subject      text,
  content_md   text,
  completed_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.lessons enable row level security;

-- Students, parents, tutor and staff can read
create policy sel_lessons on public.lessons
  for select using (
    public.is_staff() or
    auth.uid() = tutor_id or
    auth.uid() = student_id or
    public.is_parent_of(student_id)
  );

-- Tutor inserts
create policy ins_lessons_tutor on public.lessons
  for insert with check (
    public.current_role() = 'tutor' and auth.uid() = tutor_id
  );

-- Tutor updates own lessons
create policy upd_lessons_tutor on public.lessons
  for update using ( auth.uid() = tutor_id ); 