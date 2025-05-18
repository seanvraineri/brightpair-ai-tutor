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
    }
  }>;
}

export const generateQuiz = async (
  studentSnapshot: StudentSnapshot,
  topicPassages: string[]
): Promise<Quiz> => {
  try {
    // Mock implementation for local testing
    // This simulates a call to the Supabase function, but returns hardcoded data
    
    // In a real app, we would use this:
    // const { data, error } = await supabase.functions.invoke('generate-quiz', {
    //   body: {
    //     studentSnapshot,
    //     topicPassages
    //   }
    // });
    
    // Mock response
    const mockQuiz: Quiz = {
      skill_id: studentSnapshot.lowest_mastery[0]?.skill_id || "chain",
      quiz: [
        {
          id: "q1",
          type: "mcq",
          difficulty: "easy",
          stem: "What is the derivative of $f(x) = x^2 \\sin(x)$?",
          choices: [
            "$2x\\sin(x)$",
            "$x^2\\cos(x)$",
            "$2x\\sin(x) + x^2\\cos(x)$",
            "$2x\\sin(x) - x^2\\cos(x)$"
          ],
          answer: "2",
          rationale: "Use the product rule: $f'(x) = (x^2)'\\sin(x) + x^2(\\sin(x))' = 2x\\sin(x) + x^2\\cos(x)$"
        },
        {
          id: "q2",
          type: "mcq",
          difficulty: "med",
          stem: "Find the derivative of $y = \\sqrt{\\tan(x)}$.",
          choices: [
            "$\\frac{\\sec^2(x)}{2\\sqrt{\\tan(x)}}$",
            "$\\frac{1}{2\\sqrt{\\tan(x)}}$",
            "$\\frac{\\sec^2(x)}{\\sqrt{\\tan(x)}}$",
            "$\\frac{\\tan(x)}{2\\sqrt{x}}$"
          ],
          answer: "0",
          rationale: "Use the chain rule: $\\frac{dy}{dx} = \\frac{1}{2\\sqrt{\\tan(x)}} \\cdot \\sec^2(x) = \\frac{\\sec^2(x)}{2\\sqrt{\\tan(x)}}$"
        },
        {
          id: "q3",
          type: "short",
          difficulty: "hard",
          stem: "Find $\\frac{dy}{dx}$ for $y = e^{\\sin(x^2)}$.",
          answer: "$2xe^{\\sin(x^2)}\\cos(x^2)$",
          rationale: "Use the chain rule twice: $\\frac{dy}{dx} = e^{\\sin(x^2)} \\cdot \\cos(x^2) \\cdot 2x = 2xe^{\\sin(x^2)}\\cos(x^2)$"
        }
      ]
    };

    return mockQuiz;
  } catch (error) {
    console.error('Quiz generation error:', error);
    throw error;
  }
};

export const submitQuizAnswer = async (
  studentAnswer: string,
  questionId: string,
  originalQuestion: QuizQuestion
): Promise<QuizAnswer> => {
  try {
    // Mock implementation for local testing
    // In a real app, we would use this:
    // const { data, error } = await supabase.functions.invoke('grade-quiz-answer', {
    //   body: {
    //     student_answer: studentAnswer,
    //     question_id: questionId,
    //     original_question: originalQuestion
    //   }
    // });
    
    // Determine if answer is correct
    let isCorrect: boolean;
    let explanation: string;
    let delta: number;

    // For MCQ questions, compare the answer index
    if (originalQuestion.type === 'mcq') {
      isCorrect = studentAnswer === originalQuestion.answer;
    } 
    // For short/latex/cloze questions, do simple string comparison
    else {
      isCorrect = studentAnswer.trim().toLowerCase() === originalQuestion.answer.trim().toLowerCase();
    }

    // Determine delta based on difficulty
    switch(originalQuestion.difficulty) {
      case 'hard':
        delta = isCorrect ? 0.25 : -0.25;
        break;
      case 'med':
        delta = isCorrect ? 0.15 : -0.15;
        break;
      default: // easy
        delta = isCorrect ? 0.05 : -0.05;
    }

    // Generate explanation
    if (isCorrect) {
      explanation = `Great job! ${originalQuestion.rationale}`;
    } else {
      explanation = `Not quite. ${originalQuestion.rationale}`;
    }

    // Return feedback
    const responseData: QuizAnswer = {
      is_correct: isCorrect,
      explanation,
      tool_calls: [
        {
          name: "updateSkill",
          arguments: {
            skill_id: "chain", // Would be dynamic in a real implementation
            delta
          }
        }
      ]
    };

    return responseData;
  } catch (error) {
    console.error('Quiz grading error:', error);
    throw error;
  }
};

// Get student's current mastery data
export const getStudentMastery = async (studentId: string): Promise<StudentSnapshot | null> => {
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
        { skill_id: "implicit", name: "Implicit Differentiation", mastery: 0.47 },
        { skill_id: "limits", name: "Limits", mastery: 0.65 }
      ],
      current_track: {
        id: "calc",
        name: "AP Calculus AB"
      },
      deadline_days: 28
    };
    
    return mockStudentSnapshot;
  } catch (error) {
    console.error('Error fetching student mastery:', error);
    return null;
  }
};

// Get relevant topic passages based on the student's current track and lowest mastery skill
export const getTopicPassages = async (trackId: string, skillId: string): Promise<string[]> => {
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
      "To use the chain rule effectively, identify the 'outer' and 'inner' functions, then multiply their derivatives."
    ];
    
    return mockPassages;
  } catch (error) {
    console.error('Error fetching topic passages:', error);
    return [];
  }
};

// Update a student's skill mastery
export const updateSkillMastery = async (
  studentId: string,
  skillId: string,
  delta: number
): Promise<boolean> => {
  try {
    // Mock implementation for local testing
    // In a real app, we would update the database:
    // const { data: userData, error: fetchError } = await (supabase
    //   .from('user_mastery' as any)
    //   .select('mastery_areas')
    //   .eq('student_id', studentId)
    //   .single() as any);
    
    console.log(`Mock: Updated ${studentId}'s mastery of ${skillId} by ${delta}`);
    
    // Just return success since we're mocking
    return true;
  } catch (error) {
    console.error('Error updating skill mastery:', error);
    return false;
  }
};

// Additional helpers to retrieve quizzes from the database

export type QuizRow = Database["public"]["Tables"]["quizzes"]["Row"];

// Fetch quizzes that the student has not yet completed (completed_at is null)
export const getAvailableQuizzes = async (studentId: string): Promise<QuizRow[]> => {
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