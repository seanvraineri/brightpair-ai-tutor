import { supabase } from "@/integrations/supabase/client";
import { IS_DEVELOPMENT } from "@/config/env";
import { Database } from "@/integrations/supabase/types";

export interface QuizQuestion {
  id: string;
  type: "mcq" | "short" | "latex" | "cloze";
  difficulty: "easy" | "med" | "hard";
  stem: string;
  choices?: string[];
  answer: string;
  rationale: string;
}

export interface Quiz {
  skill_id: string;
  quiz: QuizQuestion[];
}

export interface StudentSnapshot {
  student_id: string;
  name: string;
  learning_style: "visual" | "auditory" | "kinesthetic" | "reading/writing";
  goals: string[];
  lowest_mastery: Array<{
    skill_id: string;
    name: string;
    mastery: number;
  }>;
  current_track: {
    id: string;
    name: string;
  };
  deadline_days: number;
}

export interface QuizAnswer {
  is_correct: boolean;
  explanation: string;
  tool_calls: Array<{
    name: string;
    arguments: {
      skill_id: string;
      delta: number;
    };
  }>;
}

export const generateQuiz = async (
  studentSnapshot: StudentSnapshot,
  topic: string,
  difficulty: "easy" | "med" | "hard" = "med",
): Promise<Quiz> => {
  try {
    const { data, error } = await supabase.functions.invoke(
      "generate-quiz",
      {
        body: {
          studentSnapshot,
          lessonContent: { title: topic, content: topic },
          difficulty,
        },
      },
    );

    if (error) throw error;

    // The edge function returns { success, quiz: { skill_id, questions } }
    if (data && data.success && data.quiz) {
      // Transform to match our Quiz interface
      return {
        skill_id: data.quiz.skill_id || "general",
        quiz: data.quiz.questions || [],
      };
    }

    throw new Error("Invalid response from quiz generation");
  } catch (error) {
    console.error("Quiz generation error:", error);
    throw error;
  }
};

export const submitQuizAnswer = async (
  studentAnswer: string,
  questionId: string,
  originalQuestion: QuizQuestion,
): Promise<QuizAnswer> => {
  try {
    // Log the payload for debugging

    const { data, error } = await supabase.functions.invoke(
      "grade-quiz-answer",
      {
        body: {
          student_answer: studentAnswer,
          question_id: questionId,
          original_question: originalQuestion,
        },
      },
    );
    if (error) throw error;
    return data as QuizAnswer;
  } catch (error) {
    throw error;
  }
};

// Get student's current mastery data
export const getStudentMastery = async (
  studentId: string,
): Promise<StudentSnapshot | null> => {
  try {
    // For now, we'll use demo data that adapts based on the topic
    // In production, this would fetch real student data from the database
    const demoStudentSnapshot: StudentSnapshot = {
      student_id: studentId,
      name: "Demo Student",
      learning_style: "visual",
      goals: ["Master the topic", "Improve problem-solving skills"],
      lowest_mastery: [
        { skill_id: "basic", name: "Basic Concepts", mastery: 0.4 },
        { skill_id: "intermediate", name: "Intermediate Skills", mastery: 0.6 },
        { skill_id: "advanced", name: "Advanced Topics", mastery: 0.8 },
      ],
      current_track: {
        id: "general",
        name: "General Learning",
      },
      deadline_days: 30,
    };

    return demoStudentSnapshot;
  } catch (error) {
    console.error("Error fetching student mastery:", error);
    return null;
  }
};

// Get relevant topic passages based on the student's current track and lowest mastery skill
export const getTopicPassages = async (
  trackId: string,
  skillId: string,
): Promise<string[]> => {
  try {
    // Mock passages
    const mockPassages = [
      "The chain rule is a formula for computing the derivative of the composition of two or more functions. If $f(x) = g(h(x))$, then $f'(x) = g'(h(x)) \\cdot h'(x)$.",
      "The chain rule can be applied to differentiate complex functions like $y = \\sin(x^2)$ or $y = e^{\\cos(x)}$.",
      "To use the chain rule effectively, identify the 'outer' and 'inner' functions, then multiply their derivatives.",
    ];

    return mockPassages;
  } catch (error) {
    return [];
  }
};

// Update a student's skill mastery
export const updateSkillMastery = async (
  studentId: string,
  skillId: string,
  delta: number,
): Promise<boolean> => {
  try {
    // Just return success since we're mocking
    return true;
  } catch (error) {
    return false;
  }
};

// Additional helpers to retrieve quizzes from the database

export type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];

// Fetch quizzes that the student has not yet completed (completed_at is null)
export const getAvailableQuizzes = async (
  studentId: string,
): Promise<QuizRow[]> => {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("student_id", studentId)
      .is("completed_at", null)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return IS_DEVELOPMENT ? [] : [];
  }
};

// Fetch completed quizzes (history)
export const getQuizHistory = async (studentId: string): Promise<QuizRow[]> => {
  try {
    const { data, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("student_id", studentId)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    return IS_DEVELOPMENT ? [] : [];
  }
};
