import OpenAI from "openai";
import { supabase } from "@/integrations/supabase/client";
import {
  AI_CONFIG,
  ENDPOINTS,
  FEATURES,
  IS_DEVELOPMENT,
  RETRY_CONFIG,
} from "@/config/env";

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
    console.log(`${logPrefix} Request started`);
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
          console.log(`${logPrefix} Attempt ${attempts}: Trying Edge Function`);
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
          console.log(
            `${logPrefix} Edge function response received in ${
              Date.now() - startTime
            }ms`,
          );
        }

        return data as T;
      }

      // Fallback to direct API if edge functions are disabled or we're in development
      if (FEATURES.USE_DIRECT_API) {
        if (FEATURES.DEBUG_LOGGING) {
          console.log(`${logPrefix} Attempt ${attempts}: Using Direct API`);
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
          console.log(
            `${logPrefix} Direct API response received in ${
              Date.now() - startTime
            }ms`,
          );
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

      if (FEATURES.DEBUG_LOGGING) {
        console.error(
          `${logPrefix} Attempt ${attempts} failed:`,
          lastError.message,
        );
      }

      // Retry if we haven't reached the maximum number of attempts
      if (attempts < RETRY_CONFIG.attempts) {
        const backoffTime = RETRY_CONFIG.backoff * Math.pow(2, attempts - 1);

        if (FEATURES.DEBUG_LOGGING) {
          console.log(`${logPrefix} Retrying in ${backoffTime}ms...`);
        }

        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        return attemptWithRetry();
      }

      throw lastError;
    }
  };

  try {
    const result = await attemptWithRetry();

    if (FEATURES.DEBUG_LOGGING) {
      console.log(
        `${logPrefix} Request completed successfully in ${
          Date.now() - startTime
        }ms`,
      );
    }

    return result;
  } catch (error) {
    console.error(`${logPrefix} All attempts failed:`, error);
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
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.GENERATE_FLASHCARDS, // Reusing this endpoint for now
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
    console.warn("Failed to fetch student snapshot:", error);
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

  // Extract relevant student info
  type StudentSnapshot = {
    name?: string;
    grade?: string;
    learning_style?: string;
    mood?: string;
    mastery_level?: number;
  };
  const student = studentData as StudentSnapshot;
  const name = student.name || "Student";
  const grade = student.grade || "High School";
  const learningStyle = student.learning_style || "visual";
  const mood = student.mood || "curious";
  const masteryPercent = Math.round((student.mastery_level || 0.5) * 100);

  // Create system prompt for lesson generation
  const systemPrompt = `
You are BrightPair LessonCoach, an expert tutor who writes personalized lessons.
Every lesson is shaped by the student's strengths, gaps, mood, and preferred style.

STUDENT SNAPSHOT:
Name: ${name}
Grade/Level: ${grade}
Preferred style: ${learningStyle} (visual | auditory | hands-on | reading/writing | mixed)
Latest mood: ${mood} (curious | frustrated | neutral | excited)
Topic requested: ${skillId}
Current mastery: ${masteryPercent}%

WHAT TO PRODUCE:
1. Create a personalized lesson that targets the specific skill 
2. Adjust to the student's learning style and mood
3. Include a clear explanation section
4. Provide a worked example section  
5. End with a short quiz section containing 2 practice questions
6. Use inline math with proper LaTeX formatting ($...$ for inline, $$....$$ for display)

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "Descriptive title of the lesson",
  "duration": 5,
  "sections": [
    {
      "type": "explain",
      "content_md": "The main explanation of the topic here."
    },
    {
      "type": "example",
      "content_md": "A worked example with steps."
    },
    {
      "type": "quiz",
      "questions": [
        {
          "id": "q1",
          "type": "mcq",
          "stem": "Question 1?",
          "choices": ["Option A", "Option B", "Option C", "Option D"],
          "answer": "Option B"
        },
        {
          "id": "q2",
          "type": "short",
          "stem": "Question 2?",
          "answer": "Expected answer"
        }
      ]
    }
  ],
  "update_suggestion": {
    "skill_delta": 0.05
  }
}`;

  const userMessage =
    `Please create a personalized lesson about ${skillId} for me.`;

  const result = await callAIService<{
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
  }>({
    systemPrompt,
    userMessage,
    modelParams: {
      temperature: 0.7,
      model: AI_CONFIG.DEFAULT_MODEL,
      max_tokens: 1500,
    },
    studentId,
    metadata: {
      skill_id: skillId,
    },
    edgeFunctionName: ENDPOINTS.SUPABASE_FUNCTIONS.AI_TUTOR,
  });

  // Save the lesson to the database if in production or if configured to do so
  if (!IS_DEVELOPMENT || import.meta.env.VITE_SAVE_LESSONS === "true") {
    try {
      await supabase.from("lessons").insert({
        student_id: studentId,
        title: result.title,
        content: JSON.stringify(result),
        subject: skillId,
        created_at: new Date().toISOString(),
      });

      // Update student skill mastery if applicable
      // TODO: Add/update RPC for updating student skill mastery in Supabase
      // if (result.update_suggestion?.skill_delta) {
      //   await supabase.rpc(
      //     "update_student_skill",
      //     {
      //       p_student: studentId,
      //       p_skill: skillId,
      //       p_delta: result.update_suggestion.skill_delta,
      //     },
      //   );
      // }
    } catch (error) {
      console.error("Failed to save lesson:", error);
    }
  }

  return { lesson: result };
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
      console.error("Failed to save custom lesson:", error);
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
