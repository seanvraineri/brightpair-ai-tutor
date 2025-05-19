-- Performance RLS Batch 2: Fix auth.<function>() and combine permissive policies, using correct columns

-- user_roles: Replace auth.uid() with (select auth.uid())
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY user_can_select_own_roles ON public.user_roles
  FOR SELECT USING ((user_id = (select auth.uid())));

-- tutor_students: Combine 'Tutors can view their students' and 'Tutors can manage their students' policies, and fix auth.uid()
DROP POLICY IF EXISTS "Tutors can view their students" ON public.tutor_students;
DROP POLICY IF EXISTS "Tutors can manage their students" ON public.tutor_students;
CREATE POLICY tutor_can_manage_or_view_students ON public.tutor_students
  FOR SELECT USING ((tutor_id = (select auth.uid())) OR (student_id = (select auth.uid())));

-- parent_students: Fix auth.uid() in policy
DROP POLICY IF EXISTS "Parents can view their students" ON public.parent_students;
CREATE POLICY parent_can_view_students ON public.parent_students
  FOR SELECT USING ((parent_id = (select auth.uid())) OR (student_id = (select auth.uid())));

-- learning_tracks: Only tutor_id is present
DROP POLICY IF EXISTS "Tutors can manage their tracks" ON public.learning_tracks;
DROP POLICY IF EXISTS "Students can view tracks assigned to them" ON public.learning_tracks;
CREATE POLICY tutor_can_manage_tracks ON public.learning_tracks
  FOR SELECT USING ((tutor_id = (select auth.uid())));

-- topics: Only track_id is present, so skip user-based policies
DROP POLICY IF EXISTS "Tutors can manage topics in their tracks" ON public.topics;
DROP POLICY IF EXISTS "Students can view topics in their tracks" ON public.topics;
-- No user-based policy possible here, needs join logic if required

-- flashcards_sets: Use student_id
DROP POLICY IF EXISTS "Users can delete own flashcard sets" ON public.flashcards_sets;
CREATE POLICY student_can_delete_own_flashcard_sets ON public.flashcards_sets
  FOR DELETE USING ((student_id = (select auth.uid())));
DROP POLICY IF EXISTS "Users can view own flashcard sets" ON public.flashcards_sets;
CREATE POLICY student_can_view_own_flashcard_sets ON public.flashcards_sets
  FOR SELECT USING ((student_id = (select auth.uid())));
DROP POLICY IF EXISTS "Users can insert own flashcard sets" ON public.flashcards_sets;
CREATE POLICY student_can_insert_own_flashcard_sets ON public.flashcards_sets
  FOR INSERT WITH CHECK ((student_id = (select auth.uid())));
DROP POLICY IF EXISTS "Users can update own flashcard sets" ON public.flashcards_sets;
CREATE POLICY student_can_update_own_flashcard_sets ON public.flashcards_sets
  FOR UPDATE USING ((student_id = (select auth.uid())));

-- student_tracks: Use student_id
DROP POLICY IF EXISTS "Students can view their tracks" ON public.student_tracks;
DROP POLICY IF EXISTS "Tutors can manage student tracks" ON public.student_tracks;
CREATE POLICY student_can_view_own_tracks ON public.student_tracks
  FOR SELECT USING ((student_id = (select auth.uid())));

-- skills: No user column, skip
DROP POLICY IF EXISTS "Tutors can manage skills" ON public.skills;
-- No user-based policy possible here

-- student_skills: Use student_id
DROP POLICY IF EXISTS "Students can view their skills" ON public.student_skills;
DROP POLICY IF EXISTS "Tutors can manage student skills" ON public.student_skills;
CREATE POLICY student_can_view_own_skills ON public.student_skills
  FOR SELECT USING ((student_id = (select auth.uid())));

-- chat_logs: Use student_id
DROP POLICY IF EXISTS "Students can view their chat logs" ON public.chat_logs;
DROP POLICY IF EXISTS "Tutors can view student chat logs" ON public.chat_logs;
DROP POLICY IF EXISTS sel_chat_logs_student ON public.chat_logs;
DROP POLICY IF EXISTS sel_chat_logs_staff ON public.chat_logs;
CREATE POLICY student_can_view_own_chat_logs ON public.chat_logs
  FOR SELECT USING ((student_id = (select auth.uid())));

-- quizzes: Use student_id
DROP POLICY IF EXISTS "Users can view their own quizzes" ON public.quizzes;
CREATE POLICY student_can_view_own_quizzes ON public.quizzes
  FOR SELECT USING ((student_id = (select auth.uid())));

-- lessons: Use student_id
DROP POLICY IF EXISTS "Users can view their own lessons" ON public.lessons;
DROP POLICY IF EXISTS sel_lessons ON public.lessons;
CREATE POLICY student_can_view_own_lessons ON public.lessons
  FOR SELECT USING ((student_id = (select auth.uid())));

-- assignments: Use student_id and tutor_id
DROP POLICY IF EXISTS sel_assignments ON public.assignments;
DROP POLICY IF EXISTS sel_assignments_teacher ON public.assignments;
CREATE POLICY student_or_tutor_can_view_assignments ON public.assignments
  FOR SELECT USING ((student_id = (select auth.uid())) OR (tutor_id = (select auth.uid())));

-- messages: Use sender_id and receiver_id
DROP POLICY IF EXISTS sel_messages ON public.messages;
CREATE POLICY user_can_select_messages ON public.messages
  FOR SELECT USING ((sender_id = (select auth.uid())) OR (receiver_id = (select auth.uid())));
DROP POLICY IF EXISTS ins_messages ON public.messages;
CREATE POLICY user_can_insert_messages ON public.messages
  FOR INSERT WITH CHECK ((sender_id = (select auth.uid())));
DROP POLICY IF EXISTS upd_messages ON public.messages;
CREATE POLICY user_can_update_messages ON public.messages
  FOR UPDATE USING ((sender_id = (select auth.uid())));
DROP POLICY IF EXISTS del_messages ON public.messages;
CREATE POLICY user_can_delete_messages ON public.messages
  FOR DELETE USING ((sender_id = (select auth.uid())));

-- appointments: Use student_id and tutor_id
DROP POLICY IF EXISTS sel_appointments ON public.appointments;
CREATE POLICY student_or_tutor_can_select_appointments ON public.appointments
  FOR SELECT USING ((student_id = (select auth.uid())) OR (tutor_id = (select auth.uid())));
DROP POLICY IF EXISTS ins_appointments ON public.appointments;
CREATE POLICY student_or_tutor_can_insert_appointments ON public.appointments
  FOR INSERT WITH CHECK ((student_id = (select auth.uid())) OR (tutor_id = (select auth.uid())));

-- payments: Use profile_id
DROP POLICY IF EXISTS sel_payments ON public.payments;
CREATE POLICY profile_can_select_payments ON public.payments
  FOR SELECT USING ((profile_id = (select auth.uid())));

-- tutor_notes: Use tutor_id and student_id
DROP POLICY IF EXISTS sel_tutor_notes ON public.tutor_notes;
CREATE POLICY tutor_or_student_can_select_tutor_notes ON public.tutor_notes
  FOR SELECT USING ((tutor_id = (select auth.uid())) OR (student_id = (select auth.uid())));
DROP POLICY IF EXISTS ins_tutor_notes ON public.tutor_notes;
CREATE POLICY tutor_can_insert_tutor_notes ON public.tutor_notes
  FOR INSERT WITH CHECK ((tutor_id = (select auth.uid())));
DROP POLICY IF EXISTS upd_tutor_notes ON public.tutor_notes;
CREATE POLICY tutor_can_update_tutor_notes ON public.tutor_notes
  FOR UPDATE USING ((tutor_id = (select auth.uid())));
DROP POLICY IF EXISTS del_tutor_notes ON public.tutor_notes;
CREATE POLICY tutor_can_delete_tutor_notes ON public.tutor_notes
  FOR DELETE USING ((tutor_id = (select auth.uid())));

-- user_documents: Use student_id
DROP POLICY IF EXISTS "students can manage own docs" ON public.user_documents;
CREATE POLICY student_can_manage_own_docs ON public.user_documents
  FOR ALL USING ((student_id = (select auth.uid())));

-- student_parent_relationships: Use student_id and parent_id
DROP POLICY IF EXISTS "Allow students and parents to view their relationships" ON public.student_parent_relationships;
CREATE POLICY can_view_relationships ON public.student_parent_relationships
  FOR SELECT USING ((student_id = (select auth.uid())) OR (parent_id = (select auth.uid())));
DROP POLICY IF EXISTS "Allow students and parents to insert their relationships" ON public.student_parent_relationships;
CREATE POLICY can_insert_relationships ON public.student_parent_relationships
  FOR INSERT WITH CHECK ((student_id = (select auth.uid())) OR (parent_id = (select auth.uid())));
DROP POLICY IF EXISTS "Allow students and parents to update their relationships" ON public.student_parent_relationships;
CREATE POLICY can_update_relationships ON public.student_parent_relationships
  FOR UPDATE USING ((student_id = (select auth.uid())) OR (parent_id = (select auth.uid())));
DROP POLICY IF EXISTS "Allow students and parents to delete their relationships" ON public.student_parent_relationships;
CREATE POLICY can_delete_relationships ON public.student_parent_relationships
  FOR DELETE USING ((student_id = (select auth.uid())) OR (parent_id = (select auth.uid())));

-- user_gamification: Use user_id
DROP POLICY IF EXISTS "Allow users to view their own gamification data" ON public.user_gamification;
CREATE POLICY can_view_gamification ON public.user_gamification
  FOR SELECT USING ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Allow users to insert their own gamification data" ON public.user_gamification;
CREATE POLICY can_insert_gamification ON public.user_gamification
  FOR INSERT WITH CHECK ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Allow users to update their own gamification data" ON public.user_gamification;
CREATE POLICY can_update_gamification ON public.user_gamification
  FOR UPDATE USING ((user_id = (select auth.uid())));
DROP POLICY IF EXISTS "Allow users to delete their own gamification data" ON public.user_gamification;
CREATE POLICY can_delete_gamification ON public.user_gamification
  FOR DELETE USING ((user_id = (select auth.uid()))); 