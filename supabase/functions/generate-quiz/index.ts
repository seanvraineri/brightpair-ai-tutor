/// <reference lib="deno.unstable" />

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

// Define interface for a complete quiz
interface Quiz {
  skill_id: string;
  quiz: QuizQuestion[];
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
    // Parse the request body (in a real implementation, we'd use this)
    // const { studentSnapshot, topicPassages } = await req.json();

    // Mock quiz data - this way we avoid external API calls
    const mockQuizData: Quiz = {
      skill_id: "chain",
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

    // Return the mock quiz data
    return new Response(
      JSON.stringify(mockQuizData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error generating quiz:', error);

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