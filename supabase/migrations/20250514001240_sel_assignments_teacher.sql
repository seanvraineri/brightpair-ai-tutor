-- allow any user with role "teacher" to read assignments
create policy sel_assignments_teacher
    on public.assignments
    for select
    using ( public.current_role() = 'teacher' );
