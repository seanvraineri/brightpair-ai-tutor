-- Enable Row Level Security on tables that were exposed without RLS

alter table public.student_parent_relationships enable row level security;
create policy block_all on public.student_parent_relationships for all using (false);

alter table public.user_gamification enable row level security;
create policy block_all on public.user_gamification for all using (false);

-- Move vector extension out of public schema for security best-practice
create schema if not exists extensions;
alter extension if exists vector set schema extensions;

-- Add missing indexes to cover high-traffic foreign keys (performance)
-- appointments
create index if not exists idx_appointments_student on public.appointments (student_id);
create index if not exists idx_appointments_tutor   on public.appointments (tutor_id);

-- assignments
create index if not exists idx_assignments_student on public.assignments (student_id);
create index if not exists idx_assignments_tutor   on public.assignments (tutor_id);

-- chat_logs
create index if not exists idx_chat_logs_student on public.chat_logs (student_id);
create index if not exists idx_chat_logs_track   on public.chat_logs (track_id);

-- flashcards_sets
create index if not exists idx_flashcards_sets_student on public.flashcards_sets (student_id);
create index if not exists idx_flashcards_sets_track   on public.flashcards_sets (track_id);

-- homework
create index if not exists idx_homework_student on public.homework (student_id);
create index if not exists idx_homework_track   on public.homework (track_id);
create index if not exists idx_homework_tutor   on public.homework (tutor_id);

-- lessons
create index if not exists idx_lessons_student on public.lessons (student_id);
create index if not exists idx_lessons_track   on public.lessons (track_id);
create index if not exists idx_lessons_tutor   on public.lessons (tutor_id);

-- messages
create index if not exists idx_messages_sender   on public.messages (sender_id);
create index if not exists idx_messages_receiver on public.messages (receiver_id);

-- student_parent_relationships
create index if not exists idx_spr_student on public.student_parent_relationships (student_id);
create index if not exists idx_spr_parent  on public.student_parent_relationships (parent_id);

-- student_tracks
create index if not exists idx_student_tracks_track on public.student_tracks (track_id);

-- topics
create index if not exists idx_topics_track on public.topics (track_id);

-- tutor_notes
create index if not exists idx_tutor_notes_tutor on public.tutor_notes (tutor_id);

-- payments
create index if not exists idx_payments_profile on public.payments (profile_id); 