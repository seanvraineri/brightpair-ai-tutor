-- Add tutor_id column and recreate policies for homework
alter table public.homework
  add column if not exists tutor_id uuid references public.profiles(id);

-- Refresh RLS policies
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