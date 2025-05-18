CREATE TABLE public.user_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    subject text,
    content text,
    file_url text,
    file_type text CHECK (file_type IN ('pdf','document','notes')),
    file_name text,
    file_size integer,
    difficulty text CHECK (difficulty IN ('beginner','intermediate','advanced'))
);

CREATE INDEX user_documents_student_idx ON public.user_documents (student_id, created_at DESC);

ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students can manage own docs"
    ON public.user_documents
    FOR ALL
    USING (auth.uid() = student_id)
    WITH CHECK (auth.uid() = student_id); 