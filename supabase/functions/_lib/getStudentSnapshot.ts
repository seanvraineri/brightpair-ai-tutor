// Utility to build a personalised student snapshot used by multiple Edge Functions
// Deno / Supabase Edge compatible – no Node imports

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";

export interface StudentSnapshot {
  student_id: string;
  name: string;
  grade: string;
  learning_style: string;
  interests: string[];
  goals: string[];
  lowest_mastery_skills: { id: string; name: string; mastery: number }[];
}

export async function getStudentSnapshot(
  studentId: string,
  supabaseUrl: string,
  supabaseServiceKey: string,
): Promise<StudentSnapshot | null> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Fetch profile + gamification prefs
  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select(`id, name, grade, learning_preferences`) // JSON column
    .eq("id", studentId)
    .single();
  if (profileErr || !profile) return null;

  // Parse JSON prefs
  const prefs = profile.learning_preferences || {};
  const learningStyle = prefs.learning_style ?? "mixed";
  const interests = Array.isArray(prefs.interests) ? prefs.interests : [];
  const goals = Array.isArray(prefs.goals) ? prefs.goals : [];

  // Lowest mastery skills
  const { data: masteryRows } = await supabase
    .from("student_skills")
    .select(`skill_id, mastery_level, skills ( name )`)
    .eq("student_id", studentId);

  type MasteryRow = {
    skill_id: string;
    mastery_level: number;
    skills?: { name?: string };
  };

  const lowest = (masteryRows as MasteryRow[] | null ?? [])
    .sort((a, b) => (a.mastery_level ?? 0) - (b.mastery_level ?? 0))
    .slice(0, 3)
    .map((row) => ({
      id: row.skill_id,
      name: row.skills?.name ?? "",
      mastery: row.mastery_level,
    }));

  return {
    student_id: profile.id,
    name: profile.name ?? "Student",
    grade: profile.grade ?? "Unknown",
    learning_style: learningStyle,
    interests,
    goals,
    lowest_mastery_skills: lowest,
  };
}
