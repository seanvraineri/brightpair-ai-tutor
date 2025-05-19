import { Curriculum, CurriculumTopic } from "@/types/curriculum";
import { supabase } from "@/integrations/supabase/client";

// Fetch curriculum topics associated with a student via their enrolled tracks
export const getCurriculumTopicsForStudent = async (
  studentId: string,
): Promise<CurriculumTopic[]> => {
  // 1) Retrieve track_ids the student is enrolled in
  const { data: trackRows, error: trackErr } = await supabase
    .from("student_tracks")
    .select("track_id")
    .eq("student_id", studentId);

  if (trackErr) {
    console.error("getCurriculumTopicsForStudent", trackErr);
    return [];
  }

  const trackIds = (trackRows ?? []).map((r: { track_id: string }) =>
    r.track_id
  );
  if (trackIds.length === 0) return [];

  // 2) Fetch topics for those tracks
  const { data: topics, error } = await supabase
    .from("topics")
    .select("id, title, content, track_id")
    .in("track_id", trackIds)
    .order("title");

  if (error) {
    console.error("getCurriculumTopicsForStudent topics", error);
    return [];
  }

  type TopicRow = { id: string; title: string; content?: string };
  return (topics ?? []).map((row) => {
    const r = row as unknown as TopicRow;
    return {
      id: r.id,
      name: r.title,
      description: r.content,
    };
  });
};

// Generate a curriculum: create learning_track, topics, and link student
export const generateCurriculum = async (params: {
  tutor_id: string;
  student_id: string;
  goals: string[];
  materials?: string[];
  textbook?: string;
  syllabus?: string;
}): Promise<Curriculum> => {
  // 1) Create learning track
  const { data: trackData, error: trackError } = await supabase
    .from("learning_tracks")
    .insert({
      name: "Personalized Curriculum",
      description: params.goals.join(", "),
      tutor_id: params.tutor_id,
    })
    .select()
    .single();

  if (trackError || !trackData) {
    throw new Error(trackError?.message || "Unable to create learning track");
  }

  const trackId = trackData.id as string;

  // 2) Insert topics derived from goals
  const topicRows = params.goals.map((g) => ({
    title: g,
    content: `Deep dive into ${g}`,
    track_id: trackId,
  }));

  const { data: insertedTopics, error: topicError } = await supabase
    .from("topics")
    .insert(topicRows)
    .select();

  if (topicError) {
    throw new Error(topicError.message);
  }

  // 3) Link student to this track
  await supabase.from("student_tracks").insert({
    student_id: params.student_id,
    track_id: trackId,
    started_at: new Date().toISOString(),
  });

  // Build return object (lightweight)
  const curriculum: Curriculum = {
    id: trackId,
    tutor_id: params.tutor_id,
    student_id: params.student_id,
    title: trackData.name,
    goals: params.goals,
    topics: (insertedTopics ?? []).map((
      t: { id: string; title: string; content?: string },
    ) => ({
      id: t.id,
      name: t.title,
      description: t.content,
    })),
    materials: params.materials,
    textbook: params.textbook,
    syllabus: params.syllabus,
    created_at: trackData.created_at ?? new Date().toISOString(),
    updated_at: trackData.created_at ?? new Date().toISOString(),
  };

  return curriculum;
};

export const getCurriculaForTutor = async (
  tutorId: string,
): Promise<Curriculum[]> => {
  // Fetch tracks created by tutor
  const { data, error } = await supabase
    .from("learning_tracks")
    .select("id, name, description, created_at")
    .eq("tutor_id", tutorId);

  if (error) {
    console.error("getCurriculaForTutor", error);
    return [];
  }

  return (data ?? []).map((
    row: { id: string; name: string; description?: string; created_at: string },
  ) => ({
    id: row.id,
    tutor_id: tutorId,
    student_id: "", // not directly associated
    title: row.name,
    goals: [],
    topics: [],
    created_at: row.created_at,
    updated_at: row.created_at,
  }));
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
  type TopicRow = { id: string; title: string; content?: string };
  return (data ?? []).map((row) => {
    const r = row as unknown as TopicRow;
    return {
      id: r.id,
      name: r.title,
      description: r.content,
    };
  });
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
