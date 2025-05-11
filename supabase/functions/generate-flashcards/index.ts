
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return null;
};

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    const { topic, count = 10, studentId, trackId, difficulty = "medium" } = await req.json();
    
    if (!topic) {
      return new Response(
        JSON.stringify({ success: false, error: 'Topic is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Access OpenAI API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }
    
    // Create the prompt for flashcard generation with improved LaTeX formatting instructions
    const prompt = `
      Generate a set of ${count} flashcards for studying ${topic}.
      The difficulty level should be ${difficulty}.
      Each flashcard should have a question on the front and a concise, accurate answer on the back.
      
      For mathematical content, use proper LaTeX notation:
      - Wrap inline math in single dollar signs: $x^2$
      - Wrap display equations in double dollar signs: $$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$$
      - Use proper LaTeX commands: \\frac{}{} for fractions, x^{2} for exponents, \\sqrt{} for square roots
      - Add proper spacing around operators: $a + b$ not $a+b$
      
      Return the flashcards as a JSON array with the following structure:
      [
        {
          "id": "uniqueId1",
          "front": "Question text",
          "back": "Answer text with properly formatted LaTeX when needed"
        },
        ...
      ]
      
      Be educational, accurate, and at an appropriate level of detail for the ${difficulty} difficulty level.
      Ensure the content is factually correct and formatted clearly.
    `;
    
    console.log("Generating flashcards for topic:", topic);
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an educational assistant that creates study flashcards with well-formatted mathematical expressions using LaTeX.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    let flashcards;
    
    try {
      // Try to parse the flashcards from the response
      const content = data.choices[0]?.message?.content || '';
      // Extract JSON from the content if needed
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not extract valid JSON from the response');
      }
    } catch (parseError) {
      console.error('Error parsing flashcards:', parseError);
      throw new Error('Failed to parse flashcards from AI response');
    }
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || '';
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Store flashcards in database if studentId is provided
    if (studentId) {
      try {
        const { data: flashcardsSet, error: insertError } = await supabase
          .from('flashcards_sets')
          .insert({
            student_id: studentId,
            track_id: trackId,
            name: `${topic} Flashcards`,
            description: `Generated flashcards about ${topic}`,
            cards: flashcards,
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();
          
        if (insertError) {
          console.error('Error storing flashcards:', insertError);
        } else {
          console.log('Flashcards stored with ID:', flashcardsSet.id);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }
    
    // Return the generated flashcards
    return new Response(
      JSON.stringify({
        success: true,
        flashcards,
        topic,
        count: flashcards.length,
        difficulty
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in generate-flashcards function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
