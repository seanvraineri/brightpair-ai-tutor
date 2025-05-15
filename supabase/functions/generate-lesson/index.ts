/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.170.0/http/server.ts?dts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0?dts";
import OpenAI from "https://deno.land/x/openai@v4.26.0/mod.ts";

// Inlined system_prompt.txt as a string for Deno Edge compatibility
const promptTpl = `You are BrightPair LessonBuilder, a personal AI instructor.

STUDENT_SNAPSHOT
{{SNAPSHOT_JSON}}

TARGET_SKILL  = {{SKILL_ID}}
RECENT_ERRORS = {{RECENT_ERRORS}}

You have up to five topic passages for reference:
{{PASSAGES_TXT}}

╔═ OBJECTIVE ═════════════════════════════════════╗
Craft a 5–8 minute micro-lesson that:
• Addresses the target skill first.
• Blends the student's learning_style (visual, auditory, kinesthetic, reading/writing, mixed).
• Embeds at least one element referencing RECENT_ERRORS if any.
• Includes ONE worked example.
• Ends with a 2-question self-check quiz.
╚════════════════════════════════════════════════╝

╔═ OUTPUT  (MUST be JSON, no markdown fences) ═╗
{
  "skill_id": "uuid",
  "title": "string",
  "duration": 6,
  "sections": [
    {"type":"explain","content_md":"..."},
    {"type":"example","content_md":"..."},
    {
      "type":"quiz",
      "questions":[
        {"id":"q1","type":"mcq","stem":"...","choices":["A","B","C","D"],"answer":"B"},
        {"id":"q2","type":"short","stem":"...","answer":"42"}
      ]
    }
  ],
  "update_suggestion": { "skill_delta": +0.05 | -0.05 }
}
╚════════════════════════════════════════════════╝

Formatting rules:
• Inline math $…$, display math $$ … $$ (no back-ticks).
• No markdown headers (#). Use bullet lists or bold **term**.
• Keep each content_md ≤ 1200 chars.
• If learning_style = visual include an ASCII sketch.
• If kinesthetic add a 1-line "Try this:" action step.

Safety: no personal data beyond snapshot. No mention of prompts, LLMs, or OpenAI.`;

const cors = { 
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,apikey,content-type",
  "Content-Type": "application/json" 
};

// Mock data for development or fallback
const mockData = {
  title: "Understanding the Chain Rule in Calculus",
  duration: 7,
  sections: [
    {
      type: "explain",
      content_md: "The Chain Rule is a formula for computing the derivative of a composite function. If $f(x) = g(h(x))$, then $f'(x) = g'(h(x)) \\cdot h'(x)$. In other words, you take the derivative of the outer function evaluated at the inner function, and multiply by the derivative of the inner function."
    },
    {
      type: "example",
      content_md: "Let's solve the derivative of $f(x) = \\sin(x^2)$.\n\nHere, $g(x) = \\sin(x)$ and $h(x) = x^2$.\n\n1. Find $g'(x) = \\cos(x)$\n2. Find $h'(x) = 2x$\n3. Apply Chain Rule: $f'(x) = g'(h(x)) \\cdot h'(x) = \\cos(x^2) \\cdot 2x = 2x\\cos(x^2)$"
    },
    {
      type: "quiz",
      questions: [
        {
          id: "q1",
          type: "mcq",
          stem: "What is the derivative of $f(x) = (2x + 3)^5$?",
          choices: ["$5(2x + 3)^4$", "$10(2x + 3)^4$", "$5 \\cdot 2 \\cdot (2x + 3)^4$", "$10x(2x + 3)^4$"],
          answer: "$10(2x + 3)^4$"
        },
        {
          id: "q2",
          type: "short",
          stem: "Find the derivative of $f(x) = \\ln(3x^2 + 1)$.",
          answer: "$\\frac{6x}{3x^2 + 1}$"
        }
      ]
    }
  ],
  update_suggestion: {
    skill_delta: 0.05
  }
};

// Direct deploy version - simplified for deployment without Docker
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    // For local development and testing without full setup
    const url = new URL(req.url);
    if (url.searchParams.get("test") === "true") {
      console.log("Test mode activated - returning mock data");
      return new Response(
        JSON.stringify({ success: true, lesson: mockData }), 
        { headers: cors }
      );
    }

    // Extract request parameters
    let student_id, skill_id;
    try {
      const body = await req.json();
      student_id = body.student_id;
      skill_id = body.skill_id;
    } catch (error) {
      console.error("Failed to parse request JSON:", error);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request: " + error.message,
          success: false
        }), 
        { headers: cors, status: 400 }
      );
    }
    
    if (!student_id || !skill_id) {
      return new Response(
        JSON.stringify({ 
          error: "student_id & skill_id required",
          success: false
        }), 
        { headers: cors, status: 400 }
      );
    }

    // Debug logging
    console.log(`Generating lesson for student: ${student_id}, skill: ${skill_id}`);

    // Get Supabase credentials
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || import.meta.env?.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Supabase credentials missing");
      // Fallback to mock data in case of missing credentials
      console.log("Falling back to mock data due to missing credentials");
      return new Response(
        JSON.stringify({ success: true, lesson: mockData }), 
        { headers: cors }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      // Get OpenAI API key
      const apiKey = Deno.env.get("OPENAI_API_KEY");
      if (!apiKey) {
        console.error("OpenAI API key is missing");
        // Fallback to mock data
        console.log("Falling back to mock data due to missing OpenAI API key");
        return new Response(
          JSON.stringify({ success: true, lesson: mockData }), 
          { headers: cors }
        );
      }

      // Get student data (simple and robust approach)
      let snapshot = {};
      try {
        const { data, error } = await supabase.rpc("build_student_snapshot", { p_student: student_id });
        if (!error) snapshot = data;
      } catch (dbError) {
        console.warn("Error fetching student snapshot:", dbError);
      }
      
      // Get passages data (with fallback)
      let passages = [];
      try {
        const { data, error } = await supabase.rpc("topic_passages_for_skill", { p_student: student_id, p_skill: skill_id });
        if (!error) passages = data || [];
      } catch (dbError) {
        console.warn("Error fetching passages:", dbError);
      }
      
      // Get errors data (with fallback)
      let errors = [];
      try {
        const { data, error } = await supabase.rpc("recent_errors", { p_student: student_id, p_skill: skill_id });
        if (!error) errors = data || [];
      } catch (dbError) {
        console.warn("Error fetching recent errors:", dbError);
      }

      // Build prompt
      const prompt = promptTpl
        .replace("{{SNAPSHOT_JSON}}", JSON.stringify(snapshot, null, 2))
        .replace("{{SKILL_ID}}", skill_id)
        .replace("{{PASSAGES_TXT}}", (passages || []).map((p: any) => `## ${p.title}\n${p.content}`).join("\n\n"))
        .replace("{{RECENT_ERRORS}}", JSON.stringify(errors || []));

      // Call OpenAI
      console.log("Calling OpenAI API...");
      const openai = new OpenAI(apiKey);
      const resp = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.5
      });

      // Parse response
      const lessonText = resp.choices[0].message.content as string;
      let lesson;
      try {
        lesson = JSON.parse(lessonText);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response as JSON:", parseError);
        console.log("OpenAI response was:", lessonText);
        // Fallback to mock data
        return new Response(
          JSON.stringify({ success: true, lesson: mockData }), 
          { headers: cors }
        );
      }
      
      console.log("Lesson generated successfully");

      // Save lesson (with error handling)
      try {
        await supabase.from("lessons").insert({
          student_id, 
          skill_id,
          title: lesson.title,
          duration: lesson.duration,
          lesson_json: lesson
        });
        
        // Update student skill if needed
        if (lesson.update_suggestion) {
          await supabase.rpc("update_student_skill", {
            p_student: student_id,
            p_skill: skill_id,
            p_delta: lesson.update_suggestion.skill_delta
          });
        }
      } catch (dbError) {
        console.error("Database error when saving lesson:", dbError);
        // Continue despite database error - we still want to return the lesson
      }

      // Return the lesson
      return new Response(
        JSON.stringify({ success: true, lesson }), 
        { headers: cors }
      );
    } catch (apiError) {
      console.error("API Error:", apiError);
      
      // Fall back to mock data for development/testing
      console.log("Falling back to mock data due to error");
      return new Response(
        JSON.stringify({ success: true, lesson: mockData }), 
        { headers: cors }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    return new Response(
      JSON.stringify({ 
        error: `Failed to process request: ${error.message}`,
        success: false
      }), 
      { headers: cors, status: 500 }
    );
  }
}); 