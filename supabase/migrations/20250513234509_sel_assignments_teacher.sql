-- allow teachers to read everything in assignments
CREATE POLICY sel_assignments_teacher
    ON public.assignments
    FOR SELECT
    USING ( public.current_role() = 'teacher' );