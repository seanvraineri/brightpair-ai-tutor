export interface CurriculumTopic {
  id: string;
  name: string;
  description?: string;
}

export interface Curriculum {
  id: string;
  student_id: string;
  tutor_id: string;
  title: string;
  goals: string[];
  topics: CurriculumTopic[];
  materials?: string[]; // URLs of uploaded files
  textbook?: string;
  syllabus?: string;
  created_at: string;
  updated_at: string;
} 