-- Pin search_path for mutation-prone functions
alter function public.get_user_roles() set search_path = public, pg_temp;
alter function public.build_student_snapshot(p_student uuid) set search_path = public, pg_temp;
alter function public.current_role() set search_path = public, pg_temp;
alter function public.is_staff() set search_path = public, pg_temp;
alter function public.is_parent_of(p_student uuid) set search_path = public, pg_temp;
alter function public.decay_mastery() set search_path = public, pg_temp;
alter function public.handle_new_user() set search_path = public, pg_temp;

-- Drop unused indexes flagged by advisor
DROP INDEX IF EXISTS public.tutor_notes_student_idx;
DROP INDEX IF EXISTS public.profiles_learning_prefs_gin; 