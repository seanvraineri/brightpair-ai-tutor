-- Add new columns to profiles table for personalization
alter table profiles
  add column if not exists mastery_level numeric check (mastery_level >= 0 and mastery_level <= 1),
  add column if not exists strengths text,
  add column if not exists weaknesses text;

-- Create or replace build_student_snapshot function
create or replace function public.build_student_snapshot(p_student uuid)
returns jsonb
language plpgsql as $$
declare
  prof record;
begin
  select id, learning_style, mastery_level, strengths, weaknesses
    into prof
    from profiles
   where id = p_student;

  return jsonb_build_object(
    'id', prof.id,
    'learning_style', prof.learning_style,
    'mastery_level', coalesce(prof.mastery_level, 0.5),
    'strengths', prof.strengths,
    'weaknesses', prof.weaknesses
  );
end;
$$; 