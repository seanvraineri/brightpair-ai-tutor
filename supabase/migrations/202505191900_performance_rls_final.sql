-- Final Performance RLS Fixes: Use (select auth.uid()) in WITH CHECK for INSERT/UPDATE

-- chat_logs: ins_chat_logs_student
DROP POLICY IF EXISTS ins_chat_logs_student ON public.chat_logs;
CREATE POLICY ins_chat_logs_student ON public.chat_logs
  FOR INSERT WITH CHECK ((student_id = (select auth.uid())));

-- lessons: ins_lessons_tutor
DROP POLICY IF EXISTS ins_lessons_tutor ON public.lessons;
CREATE POLICY ins_lessons_tutor ON public.lessons
  FOR INSERT WITH CHECK ((tutor_id = (select auth.uid())));

-- lessons: upd_lessons_tutor
DROP POLICY IF EXISTS upd_lessons_tutor ON public.lessons;
CREATE POLICY upd_lessons_tutor ON public.lessons
  FOR UPDATE USING ((tutor_id = (select auth.uid())));

-- assignments: ins_assignments
DROP POLICY IF EXISTS ins_assignments ON public.assignments;
CREATE POLICY ins_assignments ON public.assignments
  FOR INSERT WITH CHECK ((student_id = (select auth.uid())) OR (tutor_id = (select auth.uid()))); 