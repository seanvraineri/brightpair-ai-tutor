import { supabase } from "@/integrations/supabase/client";
import { FEATURES, IS_DEVELOPMENT } from "@/config/env";
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
  topicPassages: string[],
): Promise<Quiz> => {
  try {
    if (!FEATURES.USE_MOCK_DATA) {
      const { data, error } = await supabase.functions.invoke(
        "generate-quiz",
        {
          body: {
            studentSnapshot,
            topicPassages,
          },
        },
      );

      if (error) throw error;

      // Expect edge function to return { skill_id, quiz: QuizQuestion[] }
      return data as Quiz;
    }

    // ---------- MOCK FALLBACK ----------
    const mockQuiz: Quiz = {
      skill_id: studentSnapshot.lowest_mastery[0]?.skill_id || "chain",
      quiz: [
        {
          id: "q1",
          type: "mcq",
          difficulty: "easy",
          stem: "Mock question 1",
          choices: ["A", "B", "C", "D"],
          answer: "1",
          rationale: "Because mock data",
        },
      ],
    };
    return mockQuiz;
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
    if (!FEATURES.USE_MOCK_DATA) {
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
    }

    // ---------- MOCK FALLBACK ----------
    const isCorrect = studentAnswer === originalQuestion.answer;
    const responseData: QuizAnswer = {
      is_correct: isCorrect,
      explanation: isCorrect ? "Correct" : "Incorrect",
      tool_calls: [],
    };
    return responseData;
  } catch (error) {
    console.error("Quiz grading error:", error);
    throw error;
  }
};

// Get student's current mastery data
export const getStudentMastery = async (
  studentId: string,
): Promise<StudentSnapshot | null> => {
  try {
    // Mock implementation for local testing
    // In a real app, we would query the database:
    // const { data, error } = await (supabase
    //   .from('user_mastery' as any)
    //   .select('*')
    //   .eq('student_id', studentId)
    //   .single() as any);

    // Mock student data
    const mockStudentSnapshot: StudentSnapshot = {
      student_id: studentId,
      name: "Alex",
      learning_style: "visual",
      goals: ["Master calculus", "Improve problem-solving skills"],
      lowest_mastery: [
        { skill_id: "chain", name: "Chain Rule", mastery: 0.32 },
        {
          skill_id: "implicit",
          name: "Implicit Differentiation",
          mastery: 0.47,
        },
        { skill_id: "limits", name: "Limits", mastery: 0.65 },
      ],
      current_track: {
        id: "calc",
        name: "AP Calculus AB",
      },
      deadline_days: 28,
    };

    return mockStudentSnapshot;
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
    // Mock implementation for local testing
    // In a real app, we would query the database:
    // const { data, error } = await (supabase
    //   .from('topic_passages' as any)
    //   .select('content')
    //   .eq('track_id', trackId)
    //   .eq('skill_id', skillId) as any);

    // Mock passages
    const mockPassages = [
      "The chain rule is a formula for computing the derivative of the composition of two or more functions. If $f(x) = g(h(x))$, then $f'(x) = g'(h(x)) \\cdot h'(x)$.",
      "The chain rule can be applied to differentiate complex functions like $y = \\sin(x^2)$ or $y = e^{\\cos(x)}$.",
      "To use the chain rule effectively, identify the 'outer' and 'inner' functions, then multiply their derivatives.",
    ];

    return mockPassages;
  } catch (error) {
    console.error("Error fetching topic passages:", error);
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
    // Mock implementation for local testing
    // In a real app, we would update the database:
    // const { data: userData, error: fetchError } = await (supabase
    //   .from('user_mastery' as any)
    //   .select('mastery_areas')
    //   .eq('student_id', studentId)
    //   .single() as any);

    console.log(
      `Mock: Updated ${studentId}'s mastery of ${skillId} by ${delta}`,
    );

    // Just return success since we're mocking
    return true;
  } catch (error) {
    console.error("Error updating skill mastery:", error);
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
    console.error("Error fetching available quizzes:", error);
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
    console.error("Error fetching quiz history:", error);
    return IS_DEVELOPMENT ? [] : [];
  }
};
