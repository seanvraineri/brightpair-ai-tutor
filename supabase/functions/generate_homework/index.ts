// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from "https://deno.land/x/openai@v4.26.0/mod.ts"
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") })

console.log("Hello from Functions!")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON in request body." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Input validation
  const { studentId, tutorId, objective, dueAt, numQuestions = 5, difficulty = "medium", learningStyleOverride, pdfText } = body;
  if (!studentId || typeof studentId !== "string") {
    return new Response(JSON.stringify({ success: false, error: "Missing or invalid 'studentId' (string)" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!tutorId || typeof tutorId !== "string") {
    return new Response(JSON.stringify({ success: false, error: "Missing or invalid 'tutorId' (string)" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!objective || typeof objective !== "string") {
    return new Response(JSON.stringify({ success: false, error: "Missing or invalid 'objective' (string)" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!dueAt || typeof dueAt !== "string") {
    return new Response(JSON.stringify({ success: false, error: "Missing or invalid 'dueAt' (string, ISO date)" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 1. Pull student profile (for personalization)
  let profile, snapshot: Record<string, any> = {};
  try {
    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("learning_style")
      .eq("id", studentId)
      .single();
    profile = prof;
  } catch (e) {
    profile = null;
  }

  // 1b. Try to get deeper snapshot (optional RPC)
  try {
    const { data: snap } = await supabaseAdmin.rpc(
      "build_student_snapshot" as any,
      { p_student: studentId }
    );
    snapshot = snap ?? {};
  } catch (e) {
    snapshot = {};
  }

  const learningStyle = (profile?.learning_style ?? snapshot.learning_style ?? "mixed").toLowerCase();
  const masteryPercent = Math.round((snapshot.mastery_level ?? 0.5) * 100);
  const strengths = snapshot.strengths ?? "";
  const weaknesses = snapshot.weaknesses ?? "";
  const effectiveDifficulty = difficulty || (masteryPercent > 80 ? "hard" : masteryPercent < 40 ? "easy" : "medium");
  const effectiveLearningStyle = learningStyleOverride?.toLowerCase() || learningStyle;

  // 2. Build improved prompt
  const prompt = `
You are BrightPair HomeworkGenerator, an expert tutor who tailors assignments to each student's preferred learning style.

OBJECTIVE: ${objective}
NUMBER_OF_QUESTIONS: ${numQuestions}
DUE_AT: ${dueAt}

STUDENT SNAPSHOT:
• Learning style: ${effectiveLearningStyle}
• Mastery: ${masteryPercent}%
• Strengths: ${strengths}
• Weaknesses: ${weaknesses}

${pdfText ? `SOURCE_MATERIAL:\n${pdfText.substring(0, 3000)}` : ""}

Please create a ${effectiveDifficulty} homework assignment with exactly ${numQuestions} questions formatted in Markdown. For each question, use this format:

Q1. [question text]
A1. [answer]
E1. [short explanation]
---
Q2. ...

- Adjust content difficulty slightly above current mastery to promote growth.
- Presentation style should match the student's learning style.
- If the learning style is visual, include diagrams or image notes (describe them in text).
- If auditory, suggest read-aloud steps or audio cues.
- If hands-on, include real-world activities or manipulatives.
- If reading/writing, favor explanatory text and reflection prompts.
- Do NOT include any extra commentary, just the questions, answers, and explanations in the format above.
`;

  // 3. Call OpenAI
  let content = "";
  try {
    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [{ role: "user", content: prompt }],
    });
    content = ai.choices[0].message.content.trim();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Failed to generate homework: " + (e?.message || e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 4. Insert homework row
  let data, error;
  try {
    const result = await supabaseAdmin
      .from("homework")
      .insert({
        student_id: studentId,
        tutor_id: tutorId,
        title: objective,
        content_md: content,
        due_at: dueAt,
        num_questions: numQuestions,
        source_pdf_provided: Boolean(pdfText),
        subject: objective || 'General',
      })
      .select()
      .single();
    data = result.data;
    error = result.error;
  } catch (e) {
    error = e;
  }

  if (error) {
    return new Response(JSON.stringify({ success: false, error: error.message || error }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, homework: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 201,
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate_homework' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
