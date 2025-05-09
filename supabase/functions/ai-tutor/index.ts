
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile } = await req.json();
    
    console.log("Processing tutor request for user:", userProfile?.name);
    console.log("Learning style:", userProfile?.gamification?.learningStyle);

    if (!message) {
      throw new Error("Message is required");
    }

    if (!openAIApiKey) {
      throw new Error("OpenAI API key is missing");
    }

    // Create a system prompt based on user profile
    let systemPrompt = "You are an AI tutor helping a student learn.";
    
    if (userProfile) {
      systemPrompt = `You are an AI tutor specialized in personalized education. 
Address the student as ${userProfile.name || "student"}. 
Their learning style is ${userProfile.gamification?.learningStyle || "unknown"}, so adapt your explanations accordingly.`;

      if (userProfile.gamification?.interests?.length > 0) {
        systemPrompt += `\nThey're interested in: ${userProfile.gamification.interests.join(", ")}.`;
      }
      
      if (userProfile.gamification?.favoriteSubjects?.length > 0) {
        systemPrompt += `\nTheir favorite subjects include: ${userProfile.gamification.favoriteSubjects.join(", ")}.`;
      }

      systemPrompt += `\n\nKey guidelines:
- For visual learners: Use diagrams, charts and visual metaphors
- For auditory learners: Use rhythmic mnemonics and spoken explanations
- For kinesthetic learners: Suggest hands-on activities and experiments
- For reading/writing learners: Provide written resources and note-taking strategies
- For mixed learners: Balance different approaches

Use emoji and formatting to make your responses engaging. Break down complex topics into smaller steps.
Always provide some form of practice or quick assessment at the end of your explanations.`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Failed to get response from OpenAI");
    }

    const tutorResponse = data.choices[0].message.content;
    
    // Update the user's gamification (would be handled separately)
    // This is just logging for now
    console.log("User interaction completed - XP could be awarded");

    return new Response(JSON.stringify({ 
      response: tutorResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI tutor function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
