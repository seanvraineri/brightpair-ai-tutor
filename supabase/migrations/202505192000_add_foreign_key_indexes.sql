-- Add indexes for all unindexed foreign key columns (performance best practice)

-- appointments
CREATE INDEX IF NOT EXISTS idx_appointments_student_id ON public.appointments(student_id);
CREATE INDEX IF NOT EXISTS idx_appointments_tutor_id ON public.appointments(tutor_id);

-- assignments
CREATE INDEX IF NOT EXISTS idx_assignments_student_id ON public.assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_assignments_tutor_id ON public.assignments(tutor_id);

-- chat_logs
CREATE INDEX IF NOT EXISTS idx_chat_logs_student_id ON public.chat_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_track_id ON public.chat_logs(track_id);

-- flashcards_sets
CREATE INDEX IF NOT EXISTS idx_flashcards_sets_student_id ON public.flashcards_sets(student_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_sets_track_id ON public.flashcards_sets(track_id);

-- homework
CREATE INDEX IF NOT EXISTS idx_homework_student_id ON public.homework(student_id);
CREATE INDEX IF NOT EXISTS idx_homework_track_id ON public.homework(track_id);
CREATE INDEX IF NOT EXISTS idx_homework_tutor_id ON public.homework(tutor_id);

-- learning_tracks
CREATE INDEX IF NOT EXISTS idx_learning_tracks_tutor_id ON public.learning_tracks(tutor_id);

-- lessons
CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON public.lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_track_id ON public.lessons(track_id);
CREATE INDEX IF NOT EXISTS idx_lessons_tutor_id ON public.lessons(tutor_id);

-- messages
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);

-- parent_students
CREATE INDEX IF NOT EXISTS idx_parent_students_student_id ON public.parent_students(student_id);

-- payments
CREATE INDEX IF NOT EXISTS idx_payments_profile_id ON public.payments(profile_id);

-- quizzes
CREATE INDEX IF NOT EXISTS idx_quizzes_student_id ON public.quizzes(student_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_track_id ON public.quizzes(track_id);

-- skills
CREATE INDEX IF NOT EXISTS idx_skills_track_id ON public.skills(track_id);

-- student_parent_relationships
CREATE INDEX IF NOT EXISTS idx_student_parent_relationships_parent_id ON public.student_parent_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_student_parent_relationships_student_id ON public.student_parent_relationships(student_id);

-- student_skills
CREATE INDEX IF NOT EXISTS idx_student_skills_skill_id ON public.student_skills(skill_id);

-- student_tracks
CREATE INDEX IF NOT EXISTS idx_student_tracks_track_id ON public.student_tracks(track_id);

-- topics
CREATE INDEX IF NOT EXISTS idx_topics_track_id ON public.topics(track_id);

-- tutor_notes
CREATE INDEX IF NOT EXISTS idx_tutor_notes_tutor_id ON public.tutor_notes(tutor_id);

-- tutor_students
CREATE INDEX IF NOT EXISTS idx_tutor_students_student_id ON public.tutor_students(student_id); 