import { Curriculum, CurriculumTopic } from '@/types/curriculum';
import { v4 as uuidv4 } from 'uuid';

// Mock in-memory store per student
const MOCK_CURRICULA: Record<string, Curriculum> = {};

export const getCurriculumTopicsForStudent = async (studentId: string): Promise<CurriculumTopic[]> => {
  const curriculum = MOCK_CURRICULA[studentId];
  return curriculum ? curriculum.topics : [];
};

export const saveCurriculum = async (curriculum: Curriculum): Promise<boolean> => {
  MOCK_CURRICULA[curriculum.student_id] = curriculum;
  return true;
};

export const generateCurriculum = async (params: {
  tutor_id: string;
  student_id: string;
  goals: string[];
  materials?: string[];
  textbook?: string;
  syllabus?: string;
}): Promise<Curriculum> => {
  // Simplified mock AI generation – create topics from goals
  const topics: CurriculumTopic[] = params.goals.map((g, idx) => ({
    id: `topic-${idx}`,
    name: g,
    description: `Deep dive into ${g}`
  }));
  const curriculum: Curriculum = {
    id: uuidv4(),
    tutor_id: params.tutor_id,
    student_id: params.student_id,
    title: 'Personalized Curriculum',
    goals: params.goals,
    topics,
    materials: params.materials,
    textbook: params.textbook,
    syllabus: params.syllabus,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  await saveCurriculum(curriculum);
  return curriculum;
};

export const getCurriculaForTutor = async (tutorId: string): Promise<Curriculum[]> => {
  return Object.values(MOCK_CURRICULA).filter(c => c.tutor_id === tutorId);
}; 