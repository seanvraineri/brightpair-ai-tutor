-- BrightPair core entities: assignments, messages, appointments, payments
-- Run via `supabase db push`

-- =============================================================
-- 0) profiles (must be first)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text UNIQUE,
  role text NOT NULL CHECK (role IN ('student','tutor','parent','staff')),
  is_staff boolean DEFAULT false,
  grade text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================
-- 0.5) student_parent_relationships (before functions/policies)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.student_parent_relationships (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =============================================================
-- Helper functions / shortcuts
-- =============================================================
-- Return role for current user
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS text LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Return true if current user is staff (profiles.is_staff = true)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT coalesce((SELECT is_staff FROM public.profiles WHERE id = auth.uid()), false);
$$;

-- Helper: does auth user parent this student?
CREATE OR REPLACE FUNCTION public.is_parent_of(p_student uuid)
RETURNS boolean LANGUAGE sql STABLE PARALLEL SAFE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.student_parent_relationships spr
    WHERE spr.student_id = p_student
      AND spr.parent_id  = auth.uid()
  );
$$;

-- =============================================================
-- 1) assignments
-- =============================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title       text NOT NULL,
  content_md  text,
  due_at      timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

/* SELECT */
CREATE POLICY sel_assignments ON public.assignments
FOR SELECT USING (
      public.is_staff() OR
      auth.uid() = student_id OR
      auth.uid() = tutor_id  OR
      public.is_parent_of(student_id)
);
/* INSERT (student & tutor can create their own, staff unrestricted) */
CREATE POLICY ins_assignments ON public.assignments
FOR INSERT WITH CHECK (
      public.is_staff() OR
      ( public.current_role() = 'student' AND auth.uid() = student_id ) OR
      ( public.current_role() = 'tutor'   AND auth.uid() = tutor_id )
);
/* UPDATE allowed to staff only */
CREATE POLICY upd_assignments_admin ON public.assignments
FOR UPDATE USING ( public.is_staff() ) WITH CHECK ( public.is_staff() );
/* DELETE staff only */
CREATE POLICY del_assignments_admin ON public.assignments
FOR DELETE USING ( public.is_staff() );

-- =============================================================
-- 2) messages
-- =============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('student','tutor','parent','assistant')),
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY sel_messages ON public.messages
FOR SELECT USING (
      public.is_staff() OR
      auth.uid() = sender_id OR auth.uid() = receiver_id
);

CREATE POLICY ins_messages ON public.messages
FOR INSERT WITH CHECK (
      public.is_staff() OR auth.uid() = sender_id
);

-- updates / deletes restricted to staff or sender
CREATE POLICY upd_messages ON public.messages
FOR UPDATE USING (
      public.is_staff() OR auth.uid() = sender_id
) WITH CHECK (
      public.is_staff() OR auth.uid() = sender_id
);

CREATE POLICY del_messages ON public.messages
FOR DELETE USING (
      public.is_staff() OR auth.uid() = sender_id
);

-- =============================================================
-- 3) appointments
-- =============================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tutor_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  starts_at   timestamptz NOT NULL,
  ends_at     timestamptz NOT NULL,
  status      text NOT NULL CHECK (status IN ('scheduled','completed','cancelled')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY sel_appointments ON public.appointments
FOR SELECT USING (
      public.is_staff() OR
      auth.uid() = student_id OR
      auth.uid() = tutor_id OR
      public.is_parent_of(student_id)
);

CREATE POLICY ins_appointments ON public.appointments
FOR INSERT WITH CHECK (
      public.is_staff() OR
      ( public.current_role() = 'student' AND auth.uid() = student_id ) OR
      ( public.current_role() = 'tutor'   AND auth.uid() = tutor_id )
);

CREATE POLICY upd_appointments_admin ON public.appointments
FOR UPDATE USING ( public.is_staff() ) WITH CHECK ( public.is_staff() );

CREATE POLICY del_appointments_admin ON public.appointments
FOR DELETE USING ( public.is_staff() );

-- =============================================================
-- 4) payments
-- =============================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_session text NOT NULL,
  amount_cents  int NOT NULL,
  currency      text NOT NULL DEFAULT 'usd',
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY sel_payments ON public.payments
FOR SELECT USING (
      public.is_staff() OR auth.uid() = profile_id
);

CREATE POLICY ins_payments_staff ON public.payments
FOR INSERT WITH CHECK (
      public.is_staff()
);

-- no updates; refund flows handled elsewhere
CREATE POLICY del_payments_staff ON public.payments
FOR DELETE USING ( public.is_staff() );

-- End of migration 