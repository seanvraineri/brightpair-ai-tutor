import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return null;
};

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const body = await req.json();
    const {
      count = 10,
      studentId,
      trackId,
      difficulty = "medium",
      doc_id,
      raw_text,
    } = body;

    let topic = body.topic || body.subject || body.name;

    let sourceText: string | null = null;

    // If doc_id provided, fetch document text from user_documents
    if (doc_id) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
      const sb = createClient(supabaseUrl, supabaseKey);
      const { data: doc } = await sb.from("user_documents").select("content")
        .eq("id", doc_id).single();
      if (doc?.content) {
        sourceText = doc.content as string;
        topic = topic || doc.title || "Document";
      }
    } else if (raw_text && typeof raw_text === "string") {
      sourceText = raw_text;
    }

    if (!topic) {
      return new Response(
        JSON.stringify({ success: false, error: "Topic is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Access OpenAI API key from environment
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("Missing OpenAI API key");
    }

    // Build prompt
    const promptHeader = sourceText
      ? `Generate ${count} flashcards from the following material (difficulty ${difficulty}):\n\n${
        sourceText.substring(0, 1500)
      }`
      : `Generate ${count} flashcards for studying ${topic}. Difficulty ${difficulty}.`;

    const prompt = `
      ${promptHeader}
      Each flashcard should have a question on the front and a concise, accurate answer on the back.
      
      For mathematical content, use proper LaTeX notation:
      - Wrap inline math in single dollar signs: $x^2$
      - Wrap display equations in double dollar signs: $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
      - Use proper LaTeX commands: \\frac{}{} for fractions, x^{2} for exponents, \\sqrt{} for square roots
      - Add proper spacing around operators: $a + b$ not $a+b$
      
      Return a JSON object with a "flashcards" array containing the flashcards:
      {
        "flashcards": [
          {
            "id": "1",
            "front": "Question text",
            "back": "Answer text with properly formatted LaTeX when needed"
          },
          {
            "id": "2",
            "front": "Another question",
            "back": "Another answer"
          }
        ]
      }
      
      Be educational, accurate, and at an appropriate level of detail for the ${difficulty} difficulty level.
      Ensure the content is factually correct and formatted clearly.
      Make sure that any mathematical expressions are properly formatted in LaTeX to ensure they render correctly.
    `;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an educational assistant that creates study flashcards. Always return a valid JSON array of flashcards.",
          },
          {
            role: "user",
            content: prompt +
              "\n\nIMPORTANT: Return ONLY a valid JSON array, no additional text or formatting.",
          },
        ],
        temperature: 0.5,
        max_tokens: 2000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(`OpenAI API error response: ${JSON.stringify(errorData)}`);
      throw new Error(
        `OpenAI API error: ${errorData.error?.message || "Unknown error"}`,
      );
    }

    const data = await response.json();
    let flashcards;

    try {
      // Try to parse the flashcards from the response
      const content = data.choices[0]?.message?.content || "";
      console.log(`OpenAI response content: ${content.substring(0, 200)}...`);

      // Parse the content directly as JSON
      const parsedContent = JSON.parse(content);

      // Check if it's wrapped in an object with flashcards property
      if (parsedContent.flashcards && Array.isArray(parsedContent.flashcards)) {
        flashcards = parsedContent.flashcards;
      } else if (Array.isArray(parsedContent)) {
        flashcards = parsedContent;
      } else {
        // Try to find an array in the parsed content
        const possibleArrays = Object.values(parsedContent).filter((val) =>
          Array.isArray(val)
        );
        if (possibleArrays.length > 0) {
          flashcards = possibleArrays[0];
        } else {
          throw new Error("No flashcard array found in response");
        }
      }

      // Validate flashcards structure
      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error("Invalid flashcards array");
      }

      // Ensure each flashcard has required fields
      flashcards = flashcards.map((card, index) => ({
        id: card.id || `card-${index + 1}`,
        front: card.front || card.question || "",
        back: card.back || card.answer || "",
      }));
    } catch (parseError) {
      console.log(`Parse error: ${parseError}`);
      console.log(`Raw content: ${data.choices[0]?.message?.content}`);
      throw new Error("Failed to parse flashcards from AI response");
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store flashcards in database if studentId is provided
    if (studentId) {
      try {
        const { data: flashcardsSet, error: insertError } = await supabase
          .from("flashcards_sets")
          .insert({
            student_id: studentId,
            track_id: trackId,
            name: `${topic} Flashcards`,
            description: `AI-generated flashcards`,
            cards: flashcards,
            created_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (insertError) {
          console.log(`Database insert error: ${insertError.message}`);
        } else {
          console.log(
            `Flashcards saved to database with set ID: ${flashcardsSet.id}`,
          );
        }
      } catch (dbError) {
        console.log(`Database error: ${dbError}`);
      }
    }

    // Return the generated flashcards
    return new Response(
      JSON.stringify({
        success: true,
        flashcards,
        topic,
        count: flashcards.length,
        difficulty,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.log(`Error in generate-flashcards: ${error}`);

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
