import OpenAI from "openai";
import { supabase } from "@/integrations/supabase/client";
import {
  AI_CONFIG,
  ENDPOINTS,
  FEATURES,
  IS_DEVELOPMENT,
  RETRY_CONFIG,
} from "@/config/env";
import { logger } from "@/services/logger";

// Type definitions
export interface AIServiceOptions {
  systemPrompt: string;
  userMessage: string;
  modelParams?: {
    temperature?: number;
    max_tokens?: number;
    model?: string;
  };
  metadata?: Record<string, unknown>;
  studentId?: string;
  trackId?: string;
  edgeFunctionName: string;
}

/**
 * Universal AI service that first tries to use Supabase Edge Functions,
 * and falls back to direct API calls if configured or if edge function fails
 */
export async function callAIService<T = unknown>({
  systemPrompt,
  userMessage,
  modelParams = {},
  metadata = {},
  studentId,
  trackId,
  edgeFunctionName,
}: AIServiceOptions): Promise<T> {
  // Set up logging
  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();
  const logPrefix = `[AI-${edgeFunctionName}-${requestId}]`;

  if (FEATURES.DEBUG_LOGGING) {
  }

  let attempts = 0;
  let lastError: Error | null = null;

  // Function to handle retries with exponential backoff
  const attemptWithRetry = async (): Promise<T> => {
    attempts++;

    try {
      // First try using Supabase Edge Functions if enabled
      if (FEATURES.USE_EDGE_FUNCTIONS) {
        if (FEATURES.DEBUG_LOGGING) {
        }

        const { data, error } = await supabase.functions.invoke(
          edgeFunctionName,
          {
            body: {
              system_prompt: systemPrompt,
              user_message: userMessage,
              student_id: studentId,
              track_id: trackId,
              ...modelParams,
              metadata,
            },
          },
        );

        if (error) {
          throw new Error(`Edge function error: ${error.message}`);
        }

        if (FEATURES.DEBUG_LOGGING) {
          logger.debug(`Edge function ${edgeFunctionName} response received`, {
            requestId,
            duration: Date.now() - startTime,
          });
        }

        return data as T;
      }

      // Fallback to direct API if edge functions are disabled or we're in development
      if (FEATURES.USE_DIRECT_API) {
        if (FEATURES.DEBUG_LOGGING) {
        }

        const openai = new OpenAI({
          apiKey: import.meta.env.VITE_OPENAI_API_KEY,
          dangerouslyAllowBrowser: true, // Only for development
        });

        const completion = await openai.chat.completions.create({
          model: modelParams.model || AI_CONFIG.DEFAULT_MODEL,
          temperature: modelParams.temperature || AI_CONFIG.TEMPERATURE,
          max_tokens: modelParams.max_tokens || AI_CONFIG.MAX_TOKENS,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
          throw new Error("Empty response from OpenAI API");
        }

        if (FEATURES.DEBUG_LOGGING) {
          logger.debug(`OpenAI direct API response received`, {
            requestId,
            model: modelParams.model || AI_CONFIG.DEFAULT_MODEL,
            duration: Date.now() - startTime,
          });
        }

        // Try to parse the response content as JSON if expected
        try {
          return JSON.parse(responseContent) as T;
        } catch {
          // If not valid JSON, return the raw text
          return responseContent as unknown as T;
        }
      }

      throw new Error("Both Edge Functions and Direct API are disabled");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      throw lastError;
    }
  };

  try {
    const result = await attemptWithRetry();

    if (FEATURES.DEBUG_LOGGING) {
      logger.info(`AI service ${edgeFunctionName} completed successfully`, {
        requestId,
        totalDuration: Date.now() - startTime,
        attempts,
      });
    }

    return result;
  } catch (error) {
    logger.error(`AI service ${edgeFunctionName} failed`, error, {
      requestId,
      attempts,
      totalDuration: Date.now() - startTime,
    });
    throw error;
  }
}

/**
 * Send a message to the AI tutor
 */
export async function sendAITutorMessage(
  message: string,
  studentId: string,
  trackId: string,
  history: unknown[] = [],
) {
  const systemPrompt =
    `You are BrightPair AI Tutor — an expert, human-sounding math tutor.

Guidelines
• Tone: encouraging, conversational, never condescending.
• Always explain concepts in clear, step-by-step form.
• Use \LaTeX{} for every formula (inline $...$ or block $$...$$).
• When relevant, reference the student's learning style, recent progress or homework.
• Finish each reply with a short forward-moving question (e.g. "Want to try another example?").

Output must be either plain text or Markdown with math fenced as described above.`;

  return callAIService({
    systemPrompt,
    userMessage: message,
    studentId,
    trackId,
    metadata: { history },
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.AI_TUTOR,
  });
}

/**
 * Generate flashcards from a topic
 */
export async function generateFlashcards(
  topic: string,
  numCards: number = 5,
  includeLatex: boolean = true,
) {
  const systemPrompt = `Create educational flashcards for the given topic. 
  Each flashcard should have a clear question and a concise answer. 
  ${
    includeLatex
      ? "Use LaTeX formatting for mathematical expressions."
      : "Avoid using LaTeX formatting."
  }
  
  Return a JSON object with the following structure:
  {
    "flashcards": [
      { "question": "Question 1?", "answer": "Answer 1" },
      { "question": "Question 2?", "answer": "Answer 2" }
    ]
  }`;

  const userMessage = `Please create ${numCards} flashcards about "${topic}".`;

  return callAIService<{
    data: unknown;
    success: boolean;
    flashcards: Array<{ question: string; answer: string }>;
  }>({
    systemPrompt,
    userMessage,
    modelParams: {
      temperature: 0.5,
    },
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.GENERATE_FLASHCARDS,
  });
}

/**
 * Generate a quiz from a topic
 */
export async function generateQuiz(
  topic: string,
  numQuestions: number = 5,
  difficulty: "easy" | "medium" | "hard" = "medium",
) {
  const systemPrompt = `Create an educational quiz for the given topic. 
  Each question should be multiple choice with 4 options and one correct answer. 
  The difficulty level is ${difficulty}.
  
  Return a JSON object with the following structure:
  {
    "questions": [
      {
        "question": "Question 1?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 1,
        "explanation": "Explanation for the correct answer"
      }
    ]
  }`;

  const userMessage =
    `Please create a ${numQuestions}-question quiz about "${topic}".`;

  return callAIService<{
    questions: Array<{
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }>;
  }>({
    systemPrompt,
    userMessage,
    modelParams: {
      temperature: 0.3,
    },
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.GENERATE_QUIZ,
    metadata: { type: "quiz", difficulty },
  });
}

/**
 * Generate a lesson based on a specific skill
 */
export async function generateLesson(studentId: string, skillId: string) {
  // Get student data
  let studentData = {};
  try {
    const { data: studentSnapshot } = await supabase.rpc(
      "build_student_snapshot",
      { p_student: studentId },
    );
    studentData = studentSnapshot || {};
  } catch (error) {
    if (IS_DEVELOPMENT) {
      // Use mock data in development when RPC fails
      studentData = {
        name: "Test Student",
        grade: "High School",
        learning_style: "visual",
        mood: "curious",
        mastery_level: 0.5,
      };
    }
  }

  // Call the correct Edge Function with the correct body
  const { data, error } = await supabase.functions.invoke(
    "generate-lesson",
    {
      body: {
        student_id: studentId,
        skill_id: skillId,
      },
    },
  );
  if (error) throw error;
  return data;
}

/**
 * Generate a lesson from student content (notes, documents, etc)
 */
export async function generateLessonFromContent(
  content: string,
  studentId: string = "anonymous",
  options: {
    topic?: string;
    contentType?: "notes" | "pdf" | "document";
    difficulty?: "easy" | "medium" | "hard";
  } = {},
) {
  const topic = options.topic || "Topic extracted from content";
  const contentType = options.contentType || "notes";
  const difficulty = options.difficulty || "medium";

  const systemPrompt =
    `You are an educational content creator who excels at creating 
  structured lessons from student notes and materials. Create a well-organized lesson 
  that explains the core concepts, includes examples, and provides opportunities for practice.
  
  The content is from a student's ${contentType}.
  The topic is ${topic}.
  The difficulty level should be ${difficulty}.
  
  Format your response as JSON with this structure:
  {
    "title": "Descriptive title of the lesson",
    "sections": [
      {
        "title": "Section Title",
        "content": "Section content with explanations...",
        "examples": ["Example 1", "Example 2"]
      }
    ],
    "summary": "Brief summary of key points",
    "practice_problems": [
      {
        "question": "Practice question 1?",
        "answer": "Answer to question 1"
      }
    ]
  }`;

  const userMessage = `Please create a lesson based on the following content: ${
    content.substring(0, 3800)
  }`;

  const result = await callAIService<{
    title: string;
    sections: Array<{
      title: string;
      content: string;
      examples?: Array<string>;
    }>;
    summary: string;
    practice_problems: Array<{
      question: string;
      answer: string;
    }>;
  }>({
    systemPrompt,
    userMessage,
    modelParams: {
      temperature: 0.4,
      max_tokens: 2000,
      model: AI_CONFIG.DEFAULT_MODEL,
    },
    studentId,
    metadata: {
      type: "custom_lesson",
      content_type: contentType,
      topic,
      difficulty,
    },
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.AI_TUTOR,
  });

  // Save the custom lesson to the database
  if (!IS_DEVELOPMENT || import.meta.env.VITE_SAVE_LESSONS === "true") {
    try {
      await supabase.from("lessons").insert({
        student_id: studentId,
        title: result.title,
        content: content.substring(0, 1000) +
          (content.length > 1000 ? "..." : ""),
        subject: topic,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      logger.debug("Caught error:", error);
    }
  }

  return { lesson: result };
}

/**
 * Extract text from a PDF document
 */
export async function extractPDFText(pdfUrl: string) {
  return callAIService<{ text: string; success: boolean }>({
    systemPrompt: "Extract text from the provided PDF document URL.",
    userMessage: pdfUrl,
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.EXTRACT_PDF,
  });
}

export default {
  callAIService,
  sendAITutorMessage,
  generateFlashcards,
  generateQuiz,
  generateLesson,
  generateLessonFromContent,
  extractPDFText,
};
