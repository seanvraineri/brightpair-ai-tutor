ALTER TABLE public.assignments
  ADD COLUMN status text NOT NULL DEFAULT 'not-started'
    CHECK (status IN ('not-started','in_progress','completed'));