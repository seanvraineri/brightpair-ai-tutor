// Follow Deno's ES modules conventions
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

// Fetch student profile and learning context data
const fetchStudentContext = async (supabase: any, studentId: string, trackId: string | null) => {
  // Fetch student profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .single();

  if (profileError) {
    console.error("Error fetching student profile:", profileError);
    return null;
  }

  let trackData = null;
  let skillsData = null;

  // If a trackId is provided, fetch track and skill data
  if (trackId) {
    // Fetch track details
    const { data: track, error: trackError } = await supabase
      .from('learning_tracks')
      .select('*')
      .eq('id', trackId)
      .single();

    if (!trackError && track) {
      trackData = track;
      
      // Fetch skills for this track
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('track_id', trackId);

      if (!skillsError) {
        skillsData = skills;
      }
    }
  }

  // Fetch student skills mastery
  const { data: studentSkills, error: studentSkillsError } = await supabase
    .from('student_skills')
    .select(`
      skill_id,
      mastery_level,
      skills (*)
    `)
    .eq('student_id', studentId);

  return {
    profile,
    track: trackData,
    skills: skillsData,
    mastery: studentSkillsError ? [] : studentSkills,
  };
};

// Format learning history for context inclusion
const formatLearningHistory = (history: any) => {
  if (!history) return "";
  
  let context = "";
  
  // Format homework assignments
  if (history.homework && history.homework.length > 0) {
    context += "\nRECENT HOMEWORK ASSIGNMENTS:\n";
    history.homework.forEach((hw: any, index: number) => {
      const dueDate = hw.due_date ? new Date(hw.due_date).toLocaleDateString() : 'No due date';
      context += `${index + 1}. "${hw.title}" - ${hw.subject} - Due: ${dueDate} - Status: ${hw.status}\n`;
      if (hw.description) {
        context += `   Description: ${hw.description}\n`;
      }
    });
  }
  
  // Format quiz results
  if (history.quizzes && history.quizzes.length > 0) {
    context += "\nRECENT QUIZ RESULTS:\n";
    history.quizzes.forEach((quiz: any, index: number) => {
      const completedDate = quiz.completed_at ? new Date(quiz.completed_at).toLocaleDateString() : 'Not completed';
      context += `${index + 1}. "${quiz.title}" - ${quiz.subject}`;
      
      if (quiz.score !== null) {
        context += ` - Score: ${quiz.score}%`;
      }
      
      context += ` - Completed: ${completedDate}\n`;
    });
  }
  
  // Format lesson history
  if (history.lessons && history.lessons.length > 0) {
    context += "\nRECENT LESSONS:\n";
    history.lessons.forEach((lesson: any, index: number) => {
      const status = lesson.completed_at ? `Completed on ${new Date(lesson.completed_at).toLocaleDateString()}` : 'In progress';
      context += `${index + 1}. "${lesson.title}" - ${lesson.subject} - ${status}\n`;
    });
  }
  
  // Format tracks
  if (history.tracks && history.tracks.length > 0) {
    context += "\nACTIVE LEARNING TRACKS:\n";
    history.tracks.forEach((track: any, index: number) => {
      if (track.learning_tracks) {
        context += `${index + 1}. "${track.learning_tracks.name}" - ${track.learning_tracks.description || 'No description'}\n`;
      }
    });
  }
  
  // Format recent conversations
  if (history.recentConversations && history.recentConversations.length > 0) {
    const recentConvos = history.recentConversations.slice(0, 5);
    context += "\nRECENT CONVERSATION SNIPPETS:\n";
    recentConvos.forEach((convo: any, index: number) => {
      context += `Student asked: "${convo.message.substring(0, 100)}${convo.message.length > 100 ? '...' : ''}"\n`;
    });
  }
  
  return context;
};

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  
  try {
    // Check authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Create Supabase client with admin privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || '';
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request data
    const { message, userProfile, trackId, studentId, learningHistory } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Fetch student context if studentId is provided
    const studentContext = studentId 
      ? await fetchStudentContext(supabase, studentId, trackId)
      : null;
    
    // Access OpenAI API key from environment
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }
    
    // Combine the user profile and student context to create personalization data
    const personalization = {
      ...userProfile,
      ...studentContext,
    };
    
    // Format learning history for context
    const learningHistoryContext = formatLearningHistory(learningHistory);
    
    // Construct system prompt with personalization
    let systemPrompt = `You are a helpful and encouraging AI tutor. `;
    
    if (personalization.profile?.name) {
      systemPrompt += `You're speaking with ${personalization.profile.name}. `;
    }
    
    if (personalization.track) {
      systemPrompt += `They are currently studying ${personalization.track.name}. `;
    }
    
    if (personalization.profile?.gamification?.learningStyle) {
      systemPrompt += `Their learning style is ${personalization.profile.gamification.learningStyle}, so adapt your teaching approach accordingly. `;
    }
    
    if (personalization.profile?.gamification?.interests?.length) {
      systemPrompt += `Their interests include: ${personalization.profile.gamification.interests.join(', ')}. Use these to make examples relevant. `;
    }
    
    // Add learning history context
    if (learningHistoryContext) {
      systemPrompt += `\n\nIMPORTANT LEARNING CONTEXT - Use this information to personalize your responses:${learningHistoryContext}\n\n`;
      systemPrompt += `You should use this context to tailor your responses. For example, if they're asking about their homework assignments, reference them specifically by name. If they're struggling with a topic from a quiz, focus on those areas. Reference their learning tracks to understand what curriculum they're following. When they say "help me with my homework", bring up specific homework assignments they have and offer help. Be helpful and specific, drawing connections between their questions and their learning history.`;
    }
    
    // Make API request to OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    const openAIData = await openAIResponse.json();
    
    if (!openAIResponse.ok) {
      console.error('OpenAI API error:', openAIData);
      throw new Error(`OpenAI API error: ${openAIData.error?.message || 'Unknown error'}`);
    }
    
    const aiResponse = openAIData.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Return the AI response
    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in AI tutor function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
