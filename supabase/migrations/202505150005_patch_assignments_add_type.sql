-- BrightPair · Patch assignments add type column

alter table public.assignments
  add column if not exists type text not null default 'homework' check (type in ('homework','quiz')); 