import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateLesson } from "@/services/aiService";
import { IS_DEVELOPMENT } from "@/config/env";
import { Json, Tables } from "@/integrations/supabase/types";

// Define the lesson interface based on the expected output
export interface Lesson {
  skill_id?: string; // Making this optional to match the actual data structure
  title: string;
  duration: number;
  sections: Array<{
    type: string;
    content_md: string;
    questions?: Array<{
      id: string;
      type: string;
      stem: string;
      choices?: string[];
      answer: string;
    }>;
  }>;
  update_suggestion?: {
    skill_delta: number;
  };
}

// Mock data for development or when OpenAI is unavailable
const mockLesson: Lesson = {
  title: "Understanding the Chain Rule in Calculus",
  duration: 7,
  sections: [
    {
      type: "explain",
      content_md:
        "The Chain Rule is a formula for computing the derivative of a composite function. If $f(x) = g(h(x))$, then $f'(x) = g'(h(x)) \\cdot h'(x)$. In other words, you take the derivative of the outer function evaluated at the inner function, and multiply by the derivative of the inner function.",
    },
    {
      type: "example",
      content_md:
        "Let's solve the derivative of $f(x) = \\sin(x^2)$.\n\nHere, $g(x) = \\sin(x)$ and $h(x) = x^2$.\n\n1. Find $g'(x) = \\cos(x)$\n2. Find $h'(x) = 2x$\n3. Apply Chain Rule: $f'(x) = g'(h(x)) \\cdot h'(x) = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)$",
    },
    {
      type: "quiz",
      content_md:
        "Test your understanding of the Chain Rule with these practice questions:",
      questions: [
        {
          id: "q1",
          type: "mcq",
          stem: "What is the derivative of $f(x) = (2x + 3)^5$?",
          choices: [
            "$5(2x + 3)^4$",
            "$10(2x + 3)^4$",
            "$5 \\cdot 2 \\cdot (2x + 3)^4$",
            "$10x(2x + 3)^4$",
          ],
          answer: "$10(2x + 3)^4$",
        },
        {
          id: "q2",
          type: "short",
          stem: "Find the derivative of $f(x) = \\ln(3x^2 + 1)$.",
          answer: "$\\frac{6x}{3x^2 + 1}$",
        },
      ],
    },
  ],
  update_suggestion: {
    skill_delta: 0.05,
  },
};

// Type-safe database interface
interface DbFunctions {
  buildStudentSnapshot: (params: { p_student: string }) => Promise<Json>;
  getPassagesForSkill: (
    params: { p_student: string; p_skill: string },
  ) => Promise<Json[]>;
  getRecentErrors: (
    params: { p_student: string; p_skill: string },
  ) => Promise<Json[]>;
  updateStudentSkill: (
    params: { p_student: string; p_skill: string; p_delta: number },
  ) => Promise<void>;
}

// Lesson database schema
interface LessonInsert {
  student_id: string;
  skill_id: string;
  title: string;
  duration: number;
  lesson_json: any;
  subject?: string; // Add required fields
}

// Student data structure
interface StudentData {
  name?: string;
  grade?: string;
  learning_style?: string;
  mood?: string;
  goal?: string;
  deadline_days?: string | number;
  mastery_level?: number;
  [key: string]: Json | undefined;
}

// Safe database access with proper error handling
const db: DbFunctions = {
  buildStudentSnapshot: async (params) => {
    const { data, error } = await supabase.rpc(
      "build_student_snapshot",
      params,
    );
    if (error) throw error;
    return data as Json || {};
  },

  getPassagesForSkill: async (params) => {
    const { data, error } = await supabase.rpc(
      "topic_passages_for_skill" as any,
      params,
    );
    if (error) throw error;
    return data as Json[] || [];
  },

  getRecentErrors: async (params) => {
    const { data, error } = await supabase.rpc(
      "recent_errors" as any,
      params,
    );
    if (error) throw error;
    return data as Json[] || [];
  },

  updateStudentSkill: async (params) => {
    const { error } = await supabase.rpc(
      "update_student_skill" as any,
      params,
    );
    if (error) throw error;
  },
};

export const useLesson = (studentId: string, skillId: string) =>
  useQuery({
    queryKey: ["lesson", skillId],
    queryFn: async () => {
      console.log(
        `Generating lesson for student: ${studentId}, skill: ${skillId}`,
      );

      try {
        // Only proceed if we have a valid skillId
        if (!skillId) {
          throw new Error("No skill ID provided");
        }

        const result = await generateLesson(studentId, skillId);
        console.log("Lesson generated successfully");
        return result as { lesson: Lesson };
      } catch (error) {
        console.error("Error in lesson generation:", error);
        // Return mock data as fallback in development
        if (IS_DEVELOPMENT) {
          return { lesson: { ...mockLesson, skill_id: skillId } };
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    retryDelay: 1000,
    enabled: !!skillId, // Only run the query if skillId is provided
  });
