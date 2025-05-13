ALTER TABLE public.assignments
  ADD COLUMN status text NOT NULL DEFAULT 'not-started'
        CHECK (status in ('not-started','in_progress','completed'));