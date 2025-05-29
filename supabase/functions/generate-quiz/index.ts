/// <reference lib="deno.unstable" />

// Updated: dynamic quiz generation using OpenAI and personalised snapshot

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.22.0";
import OpenAI from "https://deno.land/x/openai@v4.26.0/mod.ts";
import { StudentSnapshot } from "../_lib/getStudentSnapshot.ts";

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface QuizQuestion {
  id: string;
  type: "mcq" | "short" | "truefalse";
  difficulty: "easy" | "med" | "hard";
  stem: string;
  choices?: string[];
  answer: string;
  explanation: string;
}

interface QuizPayload {
  skill_id: string;
  questions: QuizQuestion[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization,apikey,content-type",
  "Content-Type": "application/json",
};

const handleCors = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  let body;
  try {
    body = await req.json();
  } catch (_) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON" }),
      { headers: corsHeaders, status: 400 },
    );
  }

  const { studentSnapshot, lessonContent, difficulty = "med" } = body as {
    studentSnapshot: StudentSnapshot;
    lessonContent: any;
    difficulty?: "easy" | "med" | "hard";
  };

  // Basic validation
  if (!studentSnapshot || !lessonContent) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing input data" }),
      { headers: corsHeaders, status: 400 },
    );
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ success: false, error: "Missing OPENAI_API_KEY" }),
      { headers: corsHeaders, status: 500 },
    );
  }

  const prompt = `You are BrightPair QuizMaster.
Student snapshot JSON:
${JSON.stringify(studentSnapshot, null, 2)}

Lesson content:
${JSON.stringify(lessonContent).slice(0, 1500)}

Create a JSON quiz with 5 questions mixing types: 3 multiple-choice, 1 truefalse, 1 short answer. Provide an explanation for each answer. Difficulty = ${difficulty}.

Return ONLY JSON of shape { skill_id, questions:[{id,type,difficulty,stem,choices,answer,explanation}] }`;

  const openai = new OpenAI({ apiKey });
  let quizJson: QuizPayload;
  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800,
    });

    quizJson = JSON.parse(resp.choices[0].message.content as string);
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "OpenAI error" }),
      { headers: corsHeaders, status: 500 },
    );
  }

  // Persist quiz
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);
    await sb.from("quizzes").insert({
      student_id: studentSnapshot.student_id,
      track_id: studentSnapshot.lowest_mastery_skills[0]?.id ?? null,
      title: `Auto-quiz for ${studentSnapshot.name}`,
      subject: lessonContent.title ?? "",
      quiz_json: quizJson,
    });
  } catch (dbErr) {
    
  }

  return new Response(JSON.stringify({ success: true, quiz: quizJson }), {
    headers: corsHeaders,
  });
});
