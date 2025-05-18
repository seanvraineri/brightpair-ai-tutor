// Types for the homework system

export type QuestionType = "mcq" | "short" | "diagram" | "pdf_ref";
export type HomeworkStatus = "draft" | "assigned" | "submitted" | "graded";

export interface HomeworkQuestion {
  id: string;
  type: QuestionType;
  stem: string;
  choices?: string[];
  answer?: string;
  prompt?: string;
  source_page?: number;
  score?: number;
  student_answer?: string;
  student_diagram_url?: string;
  feedback?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  due: string;
  created_at: string;
  updated_at: string;
  tutor_id: string;
  student_id: string;
  pdf_path?: string;
  status: HomeworkStatus;
  topic?: string;
  subject?: string;
  questions: HomeworkQuestion[];
  score?: number;
  total_possible?: number;
  content_md?: string;
}

export interface HomeworkListItem {
  id: string;
  title: string;
  due: string;
  student_id: string;
  student_name: string;
  status: HomeworkStatus;
  topic?: string;
  subject?: string;
  score?: number;
  total_possible?: number;
}

export interface HomeworkGenerationParams {
  tutor_id: string;
  student_id: string;
  topic?: string;
  pdf_path?: string;
  due_date: string;
  notes?: string;
  num_questions?: number;
  difficulty?: "easy" | "medium" | "hard";
  learning_style?: string;
  pdf_text?: string;
}
