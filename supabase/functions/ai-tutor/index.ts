// Follow Deno's ES modules conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';
import { ChatOpenAI } from 'npm:@langchain/openai';
import { 
  ConversationChain,
  BufferWindowMemory,
  LLMChain
} from 'npm:langchain';
import { PromptTemplate } from 'npm:@langchain/core/prompts';
import { StringOutputParser } from 'npm:@langchain/core/output_parsers';

// Response cache structure
interface CacheEntry {
  response: string;
  timestamp: number;
}

// In-memory cache with expiration (15 minutes)
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_CACHE_ENTRIES = 100;

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

// Helper function to generate a cache key from request data
const generateCacheKey = (message: string, studentId: string, trackId: string | null): string => {
  return `${studentId}:${trackId || 'null'}:${message.trim().toLowerCase()}`;
};

// Helper to clean old cache entries
const cleanupCache = () => {
  if (responseCache.size > MAX_CACHE_ENTRIES) {
    // Convert map to array, sort by timestamp, and keep the newest entries
    const entries = Array.from(responseCache.entries());
    const sortedEntries = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    // Keep only the MAX_CACHE_ENTRIES newest entries
    responseCache.clear();
    sortedEntries.slice(0, MAX_CACHE_ENTRIES).forEach(([key, value]) => {
      responseCache.set(key, value);
    });
  }
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

// Get previous conversation history for a student
const fetchConversationHistory = async (supabase: any, studentId: string, limit = 10) => {
  const { data, error } = await supabase
    .from('chat_logs')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching conversation history:", error);
    return [];
  }

  // Convert to format suitable for Langchain memory
  return data.reverse().map((item: any) => ({
    type: item.message ? 'human' : 'ai',
    content: item.message || item.response,
    timestamp: new Date(item.created_at)
  }));
};

// Format learning history for context inclusion
const formatLearningHistory = (history: any) => {
  if (!history) return "";
  
  let context = "";
  
  // Format homework assignments with more detail
  if (history.homework && history.homework.length > 0) {
    context += "\nRECENT HOMEWORK ASSIGNMENTS:\n";
    history.homework.forEach((hw: any, index: number) => {
      const dueDate = hw.due_date ? new Date(hw.due_date).toLocaleDateString() : 'No due date';
      context += `${index + 1}. "${hw.title}" - ${hw.subject} - Due: ${dueDate} - Status: ${hw.status}\n`;
      if (hw.description) {
        context += `   Description: ${hw.description}\n`;
      }
      if (hw.questions && Array.isArray(hw.questions)) {
        context += `   Questions: ${hw.questions.length} question(s)\n`;
        hw.questions.forEach((q: any, qIdx: number) => {
          context += `   - Q${qIdx + 1}: ${q.question}\n`;
        });
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
  
  return context;
};

// Detect if message is about homework
const isHomeworkQuery = (message: string) => {
  const homeworkKeywords = ['homework', 'assignment', 'help me with', 'exercise', 'my work'];
  return homeworkKeywords.some(keyword => message.toLowerCase().includes(keyword));
};

// Generate specific instructions for homework assistance
const generateHomeworkInstructions = (history: any, message: string) => {
  if (!history?.homework?.length) return "";
  
  let instructions = "\n\nThe student is asking about homework. IMPORTANT INSTRUCTIONS: ";
  instructions += "Reference specific homework assignments by title and subject. ";
  instructions += "Offer assistance that directly addresses the homework's requirements. ";
  instructions += "If the student mentioned a specific assignment, focus on that one. ";
  instructions += "Otherwise, reference their most recent or upcoming assignments.\n\n";
  
  // Check if student mentioned a specific homework title
  const homeworkTitles = history.homework.map((hw: any) => hw.title.toLowerCase());
  const mentionedHomework = homeworkTitles.find((title: string) => 
    message.toLowerCase().includes(title.toLowerCase())
  );
  
  if (mentionedHomework) {
    const homework = history.homework.find((hw: any) => 
      hw.title.toLowerCase() === mentionedHomework
    );
    
    instructions += `The student is specifically asking about the "${homework.title}" assignment for ${homework.subject}. `;
    instructions += `Focus your assistance on this specific homework.\n`;
  } else {
    instructions += `The student didn't mention a specific assignment, so focus on their most recent homework.\n`;
  }
  
  return instructions;
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
    const { message, userProfile, trackId, studentId, learningHistory, messageHistory } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check cache first - we can skip DB lookups and API calls if we have a cached response
    const cacheKey = generateCacheKey(message, studentId, trackId);
    const now = Date.now();
    const cachedResult = responseCache.get(cacheKey);
    
    if (cachedResult && (now - cachedResult.timestamp < CACHE_TTL)) {
      console.log("Cache hit! Returning cached response");
      
      // Log the interaction in the chat_logs table (do this asynchronously without awaiting)
      try {
        EdgeRuntime.waitUntil(supabase.from('chat_logs').insert({
          student_id: studentId,
          track_id: trackId,
          message,
          response: cachedResult.response,
          skills_addressed: {},
          cached: true
        }));
      } catch (logError) {
        console.error('Error logging cached chat interaction:', logError);
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          response: cachedResult.response,
          cached: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Cache miss, generating new response");
    
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
    
    // Add specific homework instructions if the query is about homework
    if (isHomeworkQuery(message)) {
      systemPrompt += generateHomeworkInstructions(learningHistory, message);
    }

    // Fetch or use provided conversation history
    let conversationHistory = messageHistory || [];
    if (!messageHistory && studentId) {
      conversationHistory = await fetchConversationHistory(supabase, studentId);
    }

    // Initialize Langchain with ChatOpenAI - using a faster model for improved response times
    const llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-3.5-turbo", // Faster than GPT-4 with decent quality
      temperature: 0.7,
      maxTokens: 600, // Reduced token count for faster responses
      cache: true, // Enable OpenAI's built-in caching
    });

    // Create a memory instance with the conversation history - reduced context for speed
    const memory = new BufferWindowMemory({
      k: 3, // Reduced from 5 to 3 for faster processing
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
      outputKey: "output",
    });

    // Add existing conversation history to memory (only the most recent messages)
    if (conversationHistory.length > 0) {
      // Only use the most recent messages for context
      const recentHistory = conversationHistory.slice(-3);
      for (const entry of recentHistory) {
        await memory.saveContext(
          { input: entry.type === 'human' ? entry.content : '' },
          { output: entry.type === 'ai' ? entry.content : '' }
        );
      }
    }

    // Create a prompt template - simplified for faster processing
    const promptTemplate = PromptTemplate.fromTemplate(`
      {system_message}
      
      Current conversation:
      {chat_history}
      
      Human: {input}
      AI Tutor:
    `);

    // Create a chain with faster settings
    const chain = new LLMChain({
      llm,
      prompt: promptTemplate,
      memory,
      outputParser: new StringOutputParser(),
      verbose: false,
    });

    // Set a timeout for the OpenAI call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('OpenAI request timed out')), 15000); // 15-second timeout
    });

    // Run the chain with timeout
    const response = await Promise.race([
      chain.invoke({
        input: message,
        system_message: systemPrompt,
      }),
      timeoutPromise
    ]);

    // Store in cache
    responseCache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
    
    // Periodically clean up the cache
    cleanupCache();
    
    // Log the interaction in the chat_logs table
    try {
      EdgeRuntime.waitUntil(supabase.from('chat_logs').insert({
        student_id: studentId,
        track_id: trackId,
        message,
        response,
        skills_addressed: {},
        cached: false
      }));
    } catch (logError) {
      console.error('Error logging chat interaction:', logError);
    }
    
    // Return the AI response
    return new Response(
      JSON.stringify({
        success: true,
        response
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
