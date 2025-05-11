
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

// Create student snapshot from available data
const createStudentSnapshot = (userProfile: any, studentContext: any) => {
  try {
    if (!studentContext || !studentContext.profile) {
      return userProfile ? {
        name: userProfile.name || "Student",
        learning_style: userProfile.gamification?.learningStyle || "mixed",
        grade: "Unknown"
      } : { name: "Student", learning_style: "mixed", grade: "Unknown" };
    }
    
    // Create lowest mastery skills array
    const lowestMasterySkills = [];
    if (studentContext.mastery && studentContext.mastery.length > 0) {
      // Sort by mastery level ascending
      const sortedSkills = [...studentContext.mastery].sort((a, b) => 
        (a.mastery_level || 0) - (b.mastery_level || 0)
      );
      
      // Take up to 3 lowest mastery skills
      sortedSkills.slice(0, 3).forEach(skill => {
        if (skill.skills) {
          lowestMasterySkills.push({
            id: skill.skill_id,
            name: skill.skills.name,
            mastery: skill.mastery_level
          });
        }
      });
    }
    
    // Format the track information
    const track = studentContext.track ? {
      id: studentContext.track.id,
      name: studentContext.track.name
    } : null;
    
    // Extract goals from user profile if available
    const goals = userProfile?.gamification?.goals || [];
    
    return {
      student_id: studentContext.profile.id,
      name: studentContext.profile.name || userProfile?.name || "Student",
      grade: studentContext.profile.grade || "Unknown",
      learning_style: userProfile?.gamification?.learningStyle || "mixed",
      goals: goals,
      lowest_mastery_skills: lowestMasterySkills,
      track: track,
      mood: userProfile?.gamification?.mood || "neutral"
    };
  } catch (error) {
    console.error("Error creating student snapshot:", error);
    return { name: "Student", learning_style: "mixed", grade: "Unknown" };
  }
};

// Extract topic passages from learning context
const extractTopicPassages = (learningContext: any, studentContext: any) => {
  const passages = [];
  
  // Extract from lessons
  if (learningContext && learningContext.lessons) {
    learningContext.lessons.slice(0, 3).forEach((lesson: any) => {
      if (lesson.title && lesson.content) {
        passages.push({
          title: lesson.title,
          content: lesson.content.substring(0, 300) // Limit size
        });
      }
    });
  }
  
  // Extract from active track materials
  if (studentContext && studentContext.track && studentContext.track.materials) {
    const materials = Array.isArray(studentContext.track.materials) 
      ? studentContext.track.materials 
      : [studentContext.track.materials];
      
    materials.slice(0, 5).forEach((material: any) => {
      if (material.title && material.content) {
        passages.push({
          title: material.title,
          content: material.content.substring(0, 300) // Limit size
        });
      }
    });
  }
  
  return passages;
};

// Build the BrightPair v2.0 system prompt
const buildBrightPairSystemPrompt = (
  studentSnapshot: any,
  topicPassages: any[],
  learningContext: { contextText: string, isHomeworkQuery: boolean, activeHomework: any }
) => {
  // Core BrightPair v2.0 prompt
  let systemPrompt = `You are **BrightPair**, a world-class personal tutor that combines evidence-based pedagogy with real-time AI reasoning.

### 0. STUDENT_SNAPSHOT
\`\`\`json
${JSON.stringify(studentSnapshot, null, 2)}
\`\`\`

### TOPIC_PASSAGES
${topicPassages.length > 0 
  ? topicPassages.map(p => `## ${p.title}\n${p.content}\n`).join('\n\n') 
  : "No specific topic passages available for this session."}

### 1. PRIMARY OBJECTIVE
Help the student master their active learning track as efficiently and enjoyably as possible.

### 2. PEDAGOGICAL RULES
1. **Personal greeting:** address the student by \`${studentSnapshot.name}\`.
2. **Adaptive modality:** using the student's learning style "${studentSnapshot.learning_style}".
   – \`visual\` → include diagrams/ASCII art, highlight equations.
   – \`auditory\` → rhythmic mnemonics, conversational tone.
   – \`kinesthetic\` → propose hands-on mini-tasks.
   – \`reading/writing\` → structured notes, bullet lists.
   – \`mixed\` → blend two strongest styles.
3. **Mastery-based scaffolding:**
   • Begin with concepts the student is less familiar with.
   • Use ↑ *I → We → You* gradient: demo, practice together, student solo.
4. **Micro-quiz:** after explanations, include diagnostic questions.
5. **Encouragement:** reinforce progress; tie feedback to student goals.
6. **Safety & accuracy:** double-check math/chem answers step-by-step.

### 3. OUTPUT STYLE
• Use markdown headers (###, ##) for section titles.
• Begin each response with a personal greeting as a level 3 heading (### Personal Greeting).
• Use bold for **key terms**, and proper LaTeX for math.
• For mathematical expressions use proper LaTeX notation: $x^2$ or $$\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
• Always format equations cleanly with proper spacing and alignment.
• Numbered steps for procedures; emojis only for motivation (≤ 1 per 4 sentences).
• Keep responses under **450 tokens** unless explicitly asked for more.`;

  // Add learning context if available
  if (learningContext.contextText) {
    systemPrompt += `\n\n### ADDITIONAL LEARNING CONTEXT\n${learningContext.contextText}`;
  }
  
  // Add specific homework instructions if the query is about homework
  if (learningContext.isHomeworkQuery) {
    systemPrompt += `\n\n### HOMEWORK ASSISTANCE\nThe student is asking about homework. Focus on guiding them through the problem-solving process without providing direct answers. Encourage critical thinking.`;
    
    if (learningContext.activeHomework) {
      systemPrompt += `\nYou are helping with "${learningContext.activeHomework.title}" for ${learningContext.activeHomework.subject}.`;
    }
  }

  // Additional guidance for mathematical formatting
  systemPrompt += `\n\n### MATHEMATICAL FORMATTING
When writing mathematical expressions:
• Use LaTeX syntax with proper delimiters: $x^2$ for inline or $$x^2$$ for display math.
• For complex expressions like fractions use: $\\frac{numerator}{denominator}$
• For square roots use: $\\sqrt{expression}$
• For the quadratic formula use: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
• Format multi-step equations with clear spacing and alignment.
• Use $\\cdot$ for multiplication, not *
• Use proper subscripts like $x_1$ and superscripts like $x^2$
• ALWAYS FORMAT YOUR RESPONSES WITH MARKDOWN HEADINGS AND SECTIONS`;
  
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
    
    // Create student snapshot from available data
    const studentSnapshot = createStudentSnapshot(userProfile, studentContext);
    
    // Extract topic passages from learning context
    const topicPassages = extractTopicPassages(learningHistory, studentContext);
    
    // Build the BrightPair system prompt with improved math formatting
    const systemPrompt = buildBrightPairSystemPrompt(studentSnapshot, topicPassages, learningContext);
    
    console.log("Using system prompt: ", systemPrompt.substring(0, 200) + "...");
    
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
