-- BrightPair · Create tutor_notes table + RLS policies

create table if not exists public.tutor_notes (
  id          uuid primary key default gen_random_uuid(),
  tutor_id    uuid not null references public.profiles(id) on delete cascade,
  student_id  uuid not null references public.profiles(id) on delete cascade,
  content     text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.tutor_notes enable row level security;

-- Tutors (owner) & staff can view
create policy sel_tutor_notes on public.tutor_notes
  for select
  using (
    public.is_staff() or
    auth.uid() = tutor_id or
    auth.uid() = student_id
  );

-- Tutors & staff can insert
create policy ins_tutor_notes on public.tutor_notes
  for insert
  with check (
    public.is_staff() or auth.uid() = tutor_id
  );

-- Tutors & staff can update
create policy upd_tutor_notes on public.tutor_notes
  for update
  using (
    public.is_staff() or auth.uid() = tutor_id
  );

-- Tutors & staff can delete
create policy del_tutor_notes on public.tutor_notes
  for delete
  using (
    public.is_staff() or auth.uid() = tutor_id
  );

-- helpful index for lookups by student
create index if not exists tutor_notes_student_idx on public.tutor_notes (student_id); 