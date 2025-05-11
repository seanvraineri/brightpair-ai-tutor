
-- Create flashcards_sets table
CREATE TABLE IF NOT EXISTS public.flashcards_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users,
  track_id UUID REFERENCES public.learning_tracks,
  name TEXT NOT NULL,
  description TEXT,
  cards JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for flashcards_sets
ALTER TABLE public.flashcards_sets ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own flashcard sets
CREATE POLICY "Users can view own flashcard sets"
  ON public.flashcards_sets
  FOR SELECT
  USING (auth.uid() = student_id);

-- Allow users to insert their own flashcard sets
CREATE POLICY "Users can insert own flashcard sets"
  ON public.flashcards_sets
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Allow users to update their own flashcard sets
CREATE POLICY "Users can update own flashcard sets"
  ON public.flashcards_sets
  FOR UPDATE
  USING (auth.uid() = student_id);

-- Allow users to delete their own flashcard sets
CREATE POLICY "Users can delete own flashcard sets"
  ON public.flashcards_sets
  FOR DELETE
  USING (auth.uid() = student_id);
