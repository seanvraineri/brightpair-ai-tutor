import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

// Set up CORS headers
const corsHeaders = {
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

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse the request body
    const body = await req.json();
    const documentUrl = body.documentUrl || body.document_url || body.url;
    const { title, userId, learningPreferences } = body;

    // Validate required parameters
    if (!documentUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Document URL is required',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || '';
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's profile if userId is provided to get personalization data
    let userProfile = null;
    if (userId) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!userError && userData) {
        userProfile = userData;
      }
    }

    // Access OpenAI API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }

    // Download the document content
    const docResponse = await fetch(documentUrl);
    if (!docResponse.ok) {
      throw new Error(`Failed to download document: ${docResponse.statusText}`);
    }

    // Extract text content (simplified - in a real implementation you'd use a parser based on file type)
    let documentContent = '';
    const contentType = docResponse.headers.get('content-type') || '';

    if (contentType.includes('text/plain')) {
      // Handle text files directly
      documentContent = await docResponse.text();
    } else {
      // For other file types, we would normally use a document parser library
      // Here we'll just use a placeholder approach
      documentContent = `Content extracted from ${title}. In a real implementation, we would parse the document based on its type.`;
    }

    // Truncate document content if it's too long
    const maxContentLength = 8000; // Adjust based on GPT model token limits
    documentContent = documentContent.substring(0, maxContentLength);

    // Build the system prompt for flashcard generation
    const systemPrompt = `You are an expert educator specializing in creating high-quality flashcards from educational documents.

STUDENT PROFILE:
${userProfile ? JSON.stringify(userProfile, null, 2) : 'No profile available'}

LEARNING PREFERENCES:
- Learning Style: ${learningPreferences.style || 'visual'}
- Difficulty: ${learningPreferences.difficulty || 'medium'}
- Interests: ${learningPreferences.interests?.join(', ') || 'not specified'}

YOUR TASK:
1. Analyze the document content carefully.
2. Identify key concepts, definitions, formulas, and important facts.
3. Create 10-15 high-quality flashcards from the content.
4. Personalize the flashcards to match the student's learning style:
   - Visual learners: Include descriptions of diagrams or visual cues
   - Auditory learners: Frame content conversationally, include mnemonics
   - Kinesthetic learners: Include practical applications or activities
   - Reading/writing learners: Focus on precise definitions and structured content
5. Tailor difficulty level to ${learningPreferences.difficulty || 'medium'}.
6. Format each flashcard with a clear question/prompt on the front and a concise answer on the back.
7. Return ONLY the flashcards as a JSON array of objects with 'front' and 'back' fields.

DOCUMENT CONTENT:
${documentContent}`;

    // Call OpenAI API for generating flashcards
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', // Using GPT-4 for better comprehension
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: `Generate personalized flashcards from this document about "${title}". Format them as JSON.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const openAIData = await openAIResponse.json();
    const openAIContent = openAIData.choices[0]?.message?.content || '';

    // Extract the JSON flashcards from the response
    let flashcards = [];
    try {
      // Find JSON content within the response
      const jsonMatch = openAIContent.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse flashcards from response');
      }
      
      // Ensure each flashcard has proper structure
      flashcards = flashcards.map((card: any, index: number) => ({
        id: `gen-${Date.now()}-${index}`,
        front: card.front || 'Missing question',
        back: card.back || 'Missing answer',
      }));
    } catch (parseError) {
      console.error('Error parsing flashcards:', parseError);
      
      // Fallback to basic structured flashcards
      flashcards = [
        {
          id: `gen-${Date.now()}-0`,
          front: 'Parsing Error',
          back: 'Could not generate flashcards from this document. Please try a different document or format.',
        },
      ];
    }

    // Return the generated flashcards
    return new Response(
      JSON.stringify({
        success: true,
        flashcards,
        message: `Generated ${flashcards.length} flashcards from document`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing document:', error);

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