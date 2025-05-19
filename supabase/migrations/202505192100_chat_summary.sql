-- Chat summaries table for AI Tutor memory
CREATE TABLE IF NOT EXISTS public.chat_summaries (
  student_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  summary text,
  updated_at timestamptz DEFAULT now()
); 