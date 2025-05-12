/// <reference lib="deno.ns" />

// This is a TypeScript file designed for Deno runtime in Supabase Edge Functions
// @deno-types="https://deno.land/std@0.177.0/http/server.d.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

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
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return null;
}

// The main Deno server handler function
serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const { questionId, studentAnswer } = await req.json();

    // Validate required parameters
    if (!questionId || !studentAnswer) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required parameters: questionId, studentAnswer' 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Mock grading result
    const mockFeedback: QuizAnswer = {
      question_id: questionId,
      student_answer: studentAnswer,
      is_correct: studentAnswer.includes("derivative") || studentAnswer.includes("cos") || studentAnswer.includes("2x"),
      feedback: "Good job! Your answer correctly identifies the product rule application. Remember that for f(x)=g(x)h(x), we have f'(x)=g'(x)h(x)+g(x)h'(x)."
    };

    // Return the grading result
    return new Response(
      JSON.stringify(mockFeedback),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error grading quiz answer:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}); 