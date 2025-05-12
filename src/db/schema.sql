-- Create the tutors table (extends the users table)
CREATE TABLE IF NOT EXISTS tutors (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT,
  subjects TEXT[],
  hourly_rate DECIMAL(10, 2),
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  learning_style TEXT,
  learning_goals TEXT,
  curriculum_source TEXT,
  difficulty_level INTEGER,
  parent_name TEXT,
  parent_email TEXT,
  parent_phone TEXT,
  schedule_preferences JSONB,
  last_session_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the tutor notes table
CREATE TABLE IF NOT EXISTS tutor_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the tutor sessions table
CREATE TABLE IF NOT EXISTS tutor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  summary TEXT,
  topics_covered TEXT[],
  homework_assigned TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the student progress reports table
CREATE TABLE IF NOT EXISTS student_progress_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  report_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  strengths TEXT[] NOT NULL,
  areas_for_improvement TEXT[] NOT NULL,
  next_steps TEXT[] NOT NULL,
  tutor_comments TEXT,
  is_shared_with_parent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Tutors can only see and manage their own profile
CREATE POLICY "Tutors can view own profile" ON tutors 
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Tutors can update own profile" ON tutors 
  FOR UPDATE USING (auth.uid() = id);

-- Tutors can only see and manage their own students
CREATE POLICY "Tutors can view own students" ON student_profiles 
  FOR SELECT USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can insert own students" ON student_profiles 
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can update own students" ON student_profiles 
  FOR UPDATE USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can delete own students" ON student_profiles 
  FOR DELETE USING (auth.uid() = tutor_id);

-- Tutors can only see and manage notes for their own students
CREATE POLICY "Tutors can view own notes" ON tutor_notes 
  FOR SELECT USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can insert own notes" ON tutor_notes 
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can update own notes" ON tutor_notes 
  FOR UPDATE USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can delete own notes" ON tutor_notes 
  FOR DELETE USING (auth.uid() = tutor_id);

-- Tutors can only see and manage sessions for their own students
CREATE POLICY "Tutors can view own sessions" ON tutor_sessions 
  FOR SELECT USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can insert own sessions" ON tutor_sessions 
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can update own sessions" ON tutor_sessions 
  FOR UPDATE USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can delete own sessions" ON tutor_sessions 
  FOR DELETE USING (auth.uid() = tutor_id);

-- Tutors can only see and manage progress reports for their own students
CREATE POLICY "Tutors can view own reports" ON student_progress_reports 
  FOR SELECT USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can insert own reports" ON student_progress_reports 
  FOR INSERT WITH CHECK (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can update own reports" ON student_progress_reports 
  FOR UPDATE USING (auth.uid() = tutor_id);
  
CREATE POLICY "Tutors can delete own reports" ON student_progress_reports 
  FOR DELETE USING (auth.uid() = tutor_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS student_profiles_tutor_id_idx ON student_profiles(tutor_id);
CREATE INDEX IF NOT EXISTS tutor_notes_student_id_idx ON tutor_notes(student_id);
CREATE INDEX IF NOT EXISTS tutor_notes_tutor_id_idx ON tutor_notes(tutor_id);
CREATE INDEX IF NOT EXISTS tutor_sessions_student_id_idx ON tutor_sessions(student_id);
CREATE INDEX IF NOT EXISTS tutor_sessions_tutor_id_idx ON tutor_sessions(tutor_id);
CREATE INDEX IF NOT EXISTS student_progress_reports_student_id_idx ON student_progress_reports(student_id);
CREATE INDEX IF NOT EXISTS student_progress_reports_tutor_id_idx ON student_progress_reports(tutor_id);

-- Parent Profiles Table
CREATE TABLE parent_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  timezone TEXT,
  communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for parent_profiles
ALTER TABLE parent_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view and edit their own parent profile
CREATE POLICY "Users can view own parent profile" 
  ON parent_profiles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own parent profile" 
  ON parent_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

-- Parent-Student Relationship Table
CREATE TABLE parent_student_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parent_profiles(id) NOT NULL,
  student_id UUID REFERENCES student_profiles(id) NOT NULL,
  relationship TEXT NOT NULL, -- e.g., "parent", "guardian", "other"
  is_primary BOOLEAN DEFAULT FALSE,
  has_financial_access BOOLEAN DEFAULT FALSE,
  has_academic_access BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- Add RLS policies for parent_student_relationships
ALTER TABLE parent_student_relationships ENABLE ROW LEVEL SECURITY;

-- Allow parents to view their student relationships
CREATE POLICY "Parents can view their student relationships" 
  ON parent_student_relationships FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM parent_profiles WHERE id = parent_id
  ));

-- Allow tutors to view parent relationships for their students
CREATE POLICY "Tutors can view parent relationships for their students" 
  ON parent_student_relationships FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM student_profiles 
    WHERE student_profiles.id = parent_student_relationships.student_id
    AND student_profiles.tutor_id IN (
      SELECT id FROM tutors WHERE user_id = auth.uid()
    )
  ));

-- Messages Table (enhanced for parent-tutor communication)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_type TEXT NOT NULL, -- 'tutor', 'parent', 'system'
  sender_id UUID NOT NULL, -- tutor_id or parent_id
  recipient_type TEXT NOT NULL, -- 'tutor', 'parent'
  recipient_id UUID NOT NULL, -- tutor_id or parent_id
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_ai_enhanced BOOLEAN DEFAULT FALSE,
  ai_suggestions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for conversation_id for faster message threading
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);

-- Add RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow senders to view messages they sent
CREATE POLICY "Senders can view messages they sent" 
  ON messages FOR SELECT 
  USING (
    (sender_type = 'tutor' AND sender_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())) OR
    (sender_type = 'parent' AND sender_id IN (SELECT id FROM parent_profiles WHERE user_id = auth.uid()))
  );

-- Allow recipients to view messages sent to them
CREATE POLICY "Recipients can view messages sent to them" 
  ON messages FOR SELECT 
  USING (
    (recipient_type = 'tutor' AND recipient_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())) OR
    (recipient_type = 'parent' AND recipient_id IN (SELECT id FROM parent_profiles WHERE user_id = auth.uid()))
  );

-- Conversations Table for message threading
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES student_profiles(id),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Allow parents to view conversations about their students
CREATE POLICY "Parents can view conversations about their students" 
  ON conversations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM parent_student_relationships
    JOIN parent_profiles ON parent_student_relationships.parent_id = parent_profiles.id
    WHERE parent_student_relationships.student_id = conversations.student_id
    AND parent_profiles.user_id = auth.uid()
  ));

-- Allow tutors to view conversations about their students
CREATE POLICY "Tutors can view conversations about their students" 
  ON conversations FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM student_profiles
    WHERE student_profiles.id = conversations.student_id
    AND student_profiles.tutor_id IN (
      SELECT id FROM tutors WHERE user_id = auth.uid()
    )
  ));

-- Report Sharing Settings Table
CREATE TABLE report_sharing_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID REFERENCES student_progress_reports(id) NOT NULL,
  parent_id UUID REFERENCES parent_profiles(id) NOT NULL,
  is_shared BOOLEAN DEFAULT TRUE,
  shared_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  shared_url TEXT,
  auto_expire_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(report_id, parent_id)
);

-- Add RLS policies for report_sharing_settings
ALTER TABLE report_sharing_settings ENABLE ROW LEVEL SECURITY;

-- Allow parents to view their report sharing settings
CREATE POLICY "Parents can view their report sharing settings" 
  ON report_sharing_settings FOR SELECT 
  USING (parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  ));

-- Allow tutors to manage report sharing for reports they created
CREATE POLICY "Tutors can manage report sharing for their reports" 
  ON report_sharing_settings FOR ALL
  USING (EXISTS (
    SELECT 1 FROM student_progress_reports
    WHERE student_progress_reports.id = report_sharing_settings.report_id
    AND student_progress_reports.tutor_id IN (
      SELECT id FROM tutors WHERE user_id = auth.uid()
    )
  ));

-- Parent Communication Preferences Table
CREATE TABLE parent_communication_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tutor_id UUID REFERENCES tutors(id) NOT NULL,
  title TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'welcome', 'progress', 'homework', 'scheduling', 'report'
  content TEXT NOT NULL,
  is_ai_enhanced BOOLEAN DEFAULT TRUE,
  tone TEXT DEFAULT 'friendly', -- 'formal', 'friendly', 'casual', 'professional'
  variables JSONB, -- template variables
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for parent_communication_templates
ALTER TABLE parent_communication_templates ENABLE ROW LEVEL SECURITY;

-- Allow tutors to manage their communication templates
CREATE POLICY "Tutors can manage their communication templates" 
  ON parent_communication_templates FOR ALL
  USING (tutor_id IN (
    SELECT id FROM tutors WHERE user_id = auth.uid()
  ));

-- Parent Notification History
CREATE TABLE parent_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES parent_profiles(id) NOT NULL,
  student_id UUID REFERENCES student_profiles(id),
  notification_type TEXT NOT NULL, -- 'message', 'report', 'session', 'system'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  reference_id UUID, -- can refer to message_id, report_id, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for parent_notifications
ALTER TABLE parent_notifications ENABLE ROW LEVEL SECURITY;

-- Allow parents to view their notifications
CREATE POLICY "Parents can view their notifications" 
  ON parent_notifications FOR SELECT 
  USING (parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  ));

-- Allow parents to update their notifications (mark as read)
CREATE POLICY "Parents can update their notifications" 
  ON parent_notifications FOR UPDATE
  USING (parent_id IN (
    SELECT id FROM parent_profiles WHERE user_id = auth.uid()
  ));

-- Indexes for better query performance
CREATE INDEX idx_parent_student_relationships_parent_id ON parent_student_relationships(parent_id);
CREATE INDEX idx_parent_student_relationships_student_id ON parent_student_relationships(student_id);
CREATE INDEX idx_messages_sender ON messages(sender_type, sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_type, recipient_id);
CREATE INDEX idx_report_sharing_parent_id ON report_sharing_settings(parent_id);
CREATE INDEX idx_report_sharing_report_id ON report_sharing_settings(report_id);
CREATE INDEX idx_parent_notifications_parent_id ON parent_notifications(parent_id);
CREATE INDEX idx_parent_notifications_student_id ON parent_notifications(student_id); 