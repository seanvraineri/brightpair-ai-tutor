import { Curriculum, CurriculumTopic } from "@/types/curriculum";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";

// Mock in-memory store per student
const MOCK_CURRICULA: Record<string, Curriculum> = {};

export const getCurriculumTopicsForStudent = async (
  studentId: string,
): Promise<CurriculumTopic[]> => {
  const curriculum = MOCK_CURRICULA[studentId];
  return curriculum ? curriculum.topics : [];
};

export const saveCurriculum = async (
  curriculum: Curriculum,
): Promise<boolean> => {
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
    description: `Deep dive into ${g}`,
  }));
  const curriculum: Curriculum = {
    id: uuidv4(),
    tutor_id: params.tutor_id,
    student_id: params.student_id,
    title: "Personalized Curriculum",
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

export const getCurriculaForTutor = async (
  tutorId: string,
): Promise<Curriculum[]> => {
  return Object.values(MOCK_CURRICULA).filter((c) => c.tutor_id === tutorId);
};

export interface Track {
  id: string;
  name: string;
  description?: string;
}

export const getTracks = async (): Promise<Track[]> => {
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("id, name, description")
    .order("name");
  if (error) {
    console.error("getTracks error", error);
    return [];
  }
  return data ?? [];
};

// Fetch topics for a learning track
export const getTopicsForTrack = async (
  trackId: string,
): Promise<CurriculumTopic[]> => {
  const { data, error } = await supabase
    .from("topics")
    .select("id, title: name, content")
    .eq("track_id", trackId)
    .order("title");
  if (error) {
    console.error("getTopicsForTrack", error);
    return [];
  }
  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.title,
    description: row.content,
  }));
};

// Fetch skills for a learning track
export interface Skill {
  id: string;
  name: string;
  description?: string;
}

export const getSkillsForTrack = async (trackId: string): Promise<Skill[]> => {
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, description")
    .eq("track_id", trackId)
    .order("name");
  if (error) {
    console.error("getSkillsForTrack", error);
    return [];
  }
  return data ?? [];
};
