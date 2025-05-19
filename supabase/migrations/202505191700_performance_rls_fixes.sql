-- Performance RLS Fixes: Use (select auth.uid()) and combine duplicate policies

-- Example for profiles (repeat for all relevant tables/policies):
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS user_can_select_own_profile ON public.profiles;
CREATE POLICY user_can_select_own_profile ON public.profiles
  FOR SELECT USING (((select auth.uid()) = id));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS user_can_update_own_profile ON public.profiles;
CREATE POLICY user_can_update_own_profile ON public.profiles
  FOR UPDATE USING (((select auth.uid()) = id))
  WITH CHECK (((select auth.uid()) = id));

DROP POLICY IF EXISTS user_can_insert_own_profile ON public.profiles;
CREATE POLICY user_can_insert_own_profile ON public.profiles
  FOR INSERT WITH CHECK (((select auth.uid()) = id));

DROP POLICY IF EXISTS user_can_delete_own_profile ON public.profiles;
CREATE POLICY user_can_delete_own_profile ON public.profiles
  FOR DELETE USING (((select auth.uid()) = id));

-- Repeat for all other tables/policies using auth.uid(), public.current_role(), public.is_staff(), etc.
-- Example for homework:
DROP POLICY IF EXISTS "Users can view their own homework" ON public.homework;
DROP POLICY IF EXISTS sel_homework ON public.homework;
CREATE POLICY sel_homework ON public.homework
  FOR SELECT USING (
    (select public.is_staff())
    OR tutor_id   = (select auth.uid())
    OR student_id = (select auth.uid())
    OR (select public.is_parent_of(student_id))
  );

DROP POLICY IF EXISTS "Users can create their own homework" ON public.homework;
DROP POLICY IF EXISTS ins_homework_tutor ON public.homework;
CREATE POLICY ins_homework_tutor ON public.homework
  FOR INSERT WITH CHECK (
    tutor_id = (select auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their own homework" ON public.homework;
DROP POLICY IF EXISTS upd_homework_tutor ON public.homework;
CREATE POLICY upd_homework_tutor ON public.homework
  FOR UPDATE USING (
    tutor_id = (select auth.uid())
  );

-- Repeat for all other tables as per the advisor warnings.
-- (You can continue this pattern for all policies in the codebase search results above.) 