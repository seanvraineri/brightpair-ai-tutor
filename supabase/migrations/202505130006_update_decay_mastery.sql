-- Ensure student_skills table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'student_skills'
  ) THEN
    CREATE TABLE public.student_skills (
      id uuid primary key default gen_random_uuid(),
      student_id uuid not null references public.profiles(id) on delete cascade,
      skill_id   uuid not null,
      mastery_level numeric not null default 0.5,
      updated_at timestamptz not null default now()
    );
    -- basic RLS (students/staff can view their own)
    alter table public.student_skills enable row level security;
  END IF;
END $$;

-- Ensure student_skills.mastery_level exists and recreate decay_mastery() function
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'student_skills'
      AND column_name  = 'mastery_level'
  ) THEN
    ALTER TABLE public.student_skills
      ADD COLUMN mastery_level numeric NOT NULL DEFAULT 0.5;
  END IF;
END $$;

-- Recreate nightly mastery decay helper
CREATE OR REPLACE FUNCTION public.decay_mastery()
RETURNS void
LANGUAGE sql
AS $$
  UPDATE public.student_skills
  SET mastery_level = GREATEST(0.01, mastery_level - 0.01)
  WHERE mastery_level > 0.3;
$$; 