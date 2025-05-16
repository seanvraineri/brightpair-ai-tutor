-- BrightPair · Patch assignments.status enum + back-fill existing rows

-- Only run if the column already exists but may allow old enum set
alter table public.assignments
  alter column status set default 'not-started';

-- If the CHECK constraint does not yet contain the new value list, recreate it
alter table public.assignments
  drop constraint if exists assignments_status_check;

alter table public.assignments
  add constraint assignments_status_check
  check ( status in ('not-started','in_progress','completed') );

-- Back-fill any existing rows missing a status value
update public.assignments
  set status = 'completed'
  where status is null or status = ''; 