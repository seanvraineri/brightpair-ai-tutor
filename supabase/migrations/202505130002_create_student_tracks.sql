-- Create learning_tracks and student_tracks tables if missing so build_student_snapshot works
-- Learning tracks catalogue
CREATE TABLE IF NOT EXISTS public.learning_tracks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Student enrollment in a learning track
CREATE TABLE IF NOT EXISTS public.student_tracks (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  track_id   uuid NOT NULL REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
  deadline   timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamptz NOT NULL DEFAULT now()
); 