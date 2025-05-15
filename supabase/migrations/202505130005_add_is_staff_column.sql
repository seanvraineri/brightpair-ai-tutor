-- Ensure profiles.is_staff exists before helper functions use it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'profiles'
      AND column_name  = 'is_staff'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN is_staff boolean NOT NULL DEFAULT false;
  END IF;
END $$; 