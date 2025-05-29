/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

// This is a TypeScript file designed for Deno runtime in Supabase Edge Functions
// @deno-types="https://deno.land/std@0.177.0/http/server.d.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.26.0/mod.ts";

// Define interface for quiz questions
interface QuizQuestion {
  id: string;
  type: "mcq" | "short" | "latex" | "cloze";
  difficulty: "easy" | "med" | "hard";
  stem: string;
  choices?: string[];
  answer: string;
  rationale: string;
}

// Define interface for quiz answer
interface QuizAnswer {
  question_id: string;
  student_answer: string;
  is_correct: boolean;
  feedback: string;
}

// Set up CORS headers for cross-origin requests
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Content-Type": "application/json",
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return null;
}

// The main Deno server handler function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const body = await req.json();
    // Accept both camelCase and snake_case for compatibility
    const questionId = body.questionId ?? body.question_id;
    const studentAnswer = body.studentAnswer ?? body.student_answer;

    // Validate required parameters
    if (!questionId || !studentAnswer) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameters: questionId, studentAnswer",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing OPENAI_API_KEY" }),
        { headers: corsHeaders, status: 500 },
      );
    }

    const prompt = `Evaluate the student's answer.
Question stem: ${questionId}
Expected answer: ${studentAnswer.expected ?? ""}
Student answer: ${studentAnswer}

Return JSON { is_correct:boolean, feedback:string }`;

    let evaluation = { is_correct: false, feedback: "" };
    try {
      const openai = new OpenAI({ apiKey });
      const r = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0,
        max_tokens: 150,
      });
      evaluation = JSON.parse(r.choices[0].message.content as string);
    } catch (err) {
      
      evaluation.feedback = "Could not grade automatically.";
    }

    const result: QuizAnswer = {
      question_id: questionId,
      student_answer: studentAnswer,
      is_correct: evaluation.is_correct,
      feedback: evaluation.feedback,
    };

    // Return the grading result
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error
          ? error.message
          : "An unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
