// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import OpenAI from "openai"
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") })

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { studentId, tutorId, objective, dueAt } = await req.json()

  // 1. Pull student profile (for personalization)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("learning_style")
    .eq("id", studentId)
    .single()

  // 2. Build prompt
  const prompt = `
    Create a homework assignment titled "${objective}" for a student who learns best via ${profile?.learning_style ?? "visual"} methods.
    Include 5 problems and detailed solutions in Markdown.
  `

  // 3. Call OpenAI
  const ai = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [{ role: "user", content: prompt }]
  })

  const content = ai.choices[0].message.content.trim()

  // 4. Insert homework row
  const { data, error } = await supabaseAdmin
    .from("homework")
    .insert({
      student_id: studentId,
      tutor_id: tutorId,
      title: objective,
      content_md: content,
      due_at: dueAt
    })
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    status: 201
  })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate_homework' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
