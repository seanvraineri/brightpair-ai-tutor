
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

// Extract and format context from student's learning history
const formatLearningContext = (history: any) => {
  if (!history) return {
    contextText: "",
    isHomeworkQuery: false,
    activeHomework: null
  };
  
  let contextText = "";
  
  // Format homework assignments
  if (history.homework && history.homework.length > 0) {
    contextText += "\nRECENT HOMEWORK ASSIGNMENTS:\n";
    history.homework.forEach((hw: any, index: number) => {
      const dueDate = hw.due_date ? new Date(hw.due_date).toLocaleDateString() : 'No due date';
      contextText += `${index + 1}. "${hw.title}" - ${hw.subject} - Due: ${dueDate} - Status: ${hw.status}\n`;
      if (hw.description) {
        contextText += `   Description: ${hw.description}\n`;
      }
      if (hw.questions && Array.isArray(hw.questions)) {
        contextText += `   Questions: ${hw.questions.length} question(s)\n`;
        hw.questions.forEach((q: any, qIdx: number) => {
          contextText += `   - Q${qIdx + 1}: ${q.question}\n`;
        });
      }
    });
  }
  
  // Format quiz results
  if (history.quizzes && history.quizzes.length > 0) {
    contextText += "\nRECENT QUIZ RESULTS:\n";
    history.quizzes.forEach((quiz: any, index: number) => {
      const completedDate = quiz.completed_at ? new Date(quiz.completed_at).toLocaleDateString() : 'Not completed';
      contextText += `${index + 1}. "${quiz.title}" - ${quiz.subject}`;
      
      if (quiz.score !== null) {
        contextText += ` - Score: ${quiz.score}%`;
      }
      
      contextText += ` - Completed: ${completedDate}\n`;
    });
  }
  
  // Format lesson history
  if (history.lessons && history.lessons.length > 0) {
    contextText += "\nRECENT LESSONS:\n";
    history.lessons.forEach((lesson: any, index: number) => {
      const status = lesson.completed_at ? `Completed on ${new Date(lesson.completed_at).toLocaleDateString()}` : 'In progress';
      contextText += `${index + 1}. "${lesson.title}" - ${lesson.subject} - ${status}\n`;
    });
  }
  
  // Format tracks
  if (history.tracks && history.tracks.length > 0) {
    contextText += "\nACTIVE LEARNING TRACKS:\n";
    history.tracks.forEach((track: any, index: number) => {
      if (track.learning_tracks) {
        contextText += `${index + 1}. "${track.learning_tracks.name}" - ${track.learning_tracks.description || 'No description'}\n`;
      }
    });
  }
  
  // Format recent conversations (limited to prevent context overflow)
  if (history.recentConversations && history.recentConversations.length > 0) {
    const recentConvos = history.recentConversations.slice(0, 3);
    contextText += "\nRECENT CONVERSATION SNIPPETS:\n";
    recentConvos.forEach((convo: any, index: number) => {
      contextText += `Student asked: "${convo.message.substring(0, 100)}${convo.message.length > 100 ? '...' : ''}"\n`;
    });
  }
  
  return {
    contextText,
    isHomeworkQuery: false,
    activeHomework: null
  };
};

// Detect homework queries and extract relevant homework context
const analyzeStudentQuery = (message: string, history: any) => {
  const result = formatLearningContext(history);
  
  // Check for homework-related keywords
  const homeworkKeywords = ['homework', 'assignment', 'help me with', 'exercise', 'my work'];
  const isHomeworkQuery = homeworkKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  result.isHomeworkQuery = isHomeworkQuery;
  
  // If it's a homework query, try to identify which specific homework is referenced
  if (isHomeworkQuery && history?.homework?.length) {
    // Look for homework title mentions in the query
    const mentionedTitle = history.homework.find((hw: any) => 
      message.toLowerCase().includes(hw.title.toLowerCase())
    );
    
    if (mentionedTitle) {
      result.activeHomework = mentionedTitle;
    } else {
      // Default to most recent homework if no specific one is mentioned
      result.activeHomework = history.homework[0];
    }
    
    // Add specific homework context
    if (result.activeHomework) {
      result.contextText += "\n\nFOCUSED HOMEWORK CONTEXT:\n";
      result.contextText += `You are helping with the "${result.activeHomework.title}" assignment for ${result.activeHomework.subject}.\n`;
      
      if (result.activeHomework.description) {
        result.contextText += `Description: ${result.activeHomework.description}\n`;
      }
      
      if (result.activeHomework.questions && Array.isArray(result.activeHomework.questions)) {
        result.contextText += `Questions to answer:\n`;
        result.activeHomework.questions.forEach((q: any, idx: number) => {
          result.contextText += `${idx + 1}. ${q.question}\n`;
        });
      }
    }
  }
  
  return result;
};

// Fetch student profile and learning context data
const fetchStudentContext = async (supabase: any, studentId: string, trackId: string | null) => {
  try {
    // Fetch student profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    if (profileError) {
      console.error("Error fetching student profile:", profileError);
      return { profile: null, track: null, skills: null, mastery: [] };
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
  } catch (error) {
    console.error("Error in fetchStudentContext:", error);
    return { profile: null, track: null, skills: null, mastery: [] };
  }
};

// Build the full system prompt with all available context
const buildSystemPrompt = (
  userProfile: any,
  studentContext: any, 
  learningContext: { contextText: string, isHomeworkQuery: boolean, activeHomework: any }
) => {
  let systemPrompt = `You are a helpful and encouraging AI tutor. `;
  
  // Add personalization based on student profile
  if (studentContext?.profile?.name) {
    systemPrompt += `You're speaking with ${studentContext.profile.name}. `;
  } else if (userProfile?.name) {
    systemPrompt += `You're speaking with ${userProfile.name}. `;
  }
  
  // Add track context if available
  if (studentContext?.track) {
    systemPrompt += `They are currently studying ${studentContext.track.name}. `;
  }
  
  // Add learning style preferences if available
  if (userProfile?.gamification?.learningStyle) {
    systemPrompt += `Their learning style is ${userProfile.gamification.learningStyle}, so adapt your teaching approach accordingly. `;
  }
  
  // Add interests for relevant examples
  if (userProfile?.gamification?.interests?.length) {
    systemPrompt += `Their interests include: ${userProfile.gamification.interests.join(', ')}. Use these to make examples relevant. `;
  }
  
  // Add learning history context
  if (learningContext.contextText) {
    systemPrompt += `\n\nIMPORTANT LEARNING CONTEXT - Use this information to personalize your responses:${learningContext.contextText}\n\n`;
    systemPrompt += `You should use this context to tailor your responses. For example, if they're asking about their homework assignments, reference them specifically by name. If they're struggling with a topic from a quiz, focus on those areas. Reference their learning tracks to understand what curriculum they're following.`;
  }
  
  // Add specific homework instructions if the query is about homework
  if (learningContext.isHomeworkQuery) {
    systemPrompt += `\n\nThe student is asking about homework. IMPORTANT INSTRUCTIONS: `;
    systemPrompt += `Reference specific homework assignments by title and subject. `;
    systemPrompt += `Offer assistance that directly addresses the homework's requirements. `;
    
    if (learningContext.activeHomework) {
      systemPrompt += `The student is specifically asking about the "${learningContext.activeHomework.title}" assignment for ${learningContext.activeHomework.subject}. `;
      systemPrompt += `Focus your assistance on this specific homework.\n`;
    } else {
      systemPrompt += `The student didn't mention a specific assignment, so focus on their most recent homework.\n`;
    }
  }
  
  return systemPrompt;
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
    
    // Analyze the student query and build context
    const learningContext = analyzeStudentQuery(message, learningHistory);
    
    // Build the system prompt with all available context
    const systemPrompt = buildSystemPrompt(userProfile, studentContext, learningContext);
    
    // Make API request to OpenAI with error handling
    try {
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
      
      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const openAIData = await openAIResponse.json();
      const aiResponse = openAIData.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Return the AI response
      return new Response(
        JSON.stringify({
          success: true,
          response: aiResponse
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openAIError) {
      console.error('Error calling OpenAI API:', openAIError);
      return new Response(
        JSON.stringify({
          success: false,
          error: openAIError instanceof Error ? openAIError.message : 'Failed to get response from AI service'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
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
