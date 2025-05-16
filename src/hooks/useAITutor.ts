import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { sendAITutorMessage } from '@/services/aiService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface LearningHistory {
  homework: any[];
  quizzes: any[];
  lessons: any[];
  tracks: any[];
  recentConversations: any[];
}

export const useAITutor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useUser();
  const { toast } = useToast();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [learningHistory, setLearningHistory] = useState<LearningHistory | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Function to fetch user's learning tracks
  const fetchLearningTracks = async () => {
    if (!session?.user?.id) return [];
    
    try {
      const { data, error } = await supabase
        .from('student_tracks')
        .select('track_id, learning_tracks(id, name, description)')
        .eq('student_id', session.user.id);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning tracks:', error);
      return [];
    }
  };

  // Function to fetch user's learning history
  const fetchLearningHistory = async () => {
    if (!session?.user?.id) return null;
    setIsLoadingHistory(true);
    
    try {
      // Fetch homework assignments
      const { data: homework, error: homeworkError } = await supabase
        .from('homework')
        .select('*')
        .eq('student_id', session.user.id)
        .order('due_date', { ascending: false })
        .limit(10);
      
      if (homeworkError) {
        console.error('Error fetching homework:', homeworkError);
      }
      
      // Fetch quiz results
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('student_id', session.user.id)
        .order('completed_at', { ascending: false })
        .limit(10);
      
      if (quizzesError) {
        console.error('Error fetching quizzes:', quizzesError);
      }
      
      // Fetch lesson history
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('student_id', session.user.id)
        .order('completed_at', { ascending: false })
        .limit(10);
      
      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
      }
      
      // Fetch chat history from chat_logs table
      const { data: recentConversations, error: chatError } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('student_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (chatError) throw chatError;
      
      // Fetch active learning tracks
      const tracks = await fetchLearningTracks();
      
      const history: LearningHistory = {
        homework: homework || [],
        quizzes: quizzes || [],
        lessons: lessons || [],
        tracks: tracks || [],
        recentConversations: recentConversations || [],
      };
      
      setLearningHistory(history);
      return history;
    } catch (error) {
      console.error('Error fetching learning history:', error);
      toast({
        title: "Error",
        description: "Failed to load your learning history",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Fetch learning history when user session is available
  useEffect(() => {
    if (session?.user?.id) {
      fetchLearningHistory();
    }
  }, [session?.user?.id]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to the conversation
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to use the AI Tutor");
      }
      
      // If we haven't loaded the history yet, fetch it now
      const history = learningHistory || await fetchLearningHistory();
      
      // Detect simple greetings and answer locally to save tokens
      const isSimpleGreeting = (text: string): boolean => {
        const cleaned = text.trim().toLowerCase().replace(/[!?.]/g, '');
        const greetingWords = [
          'hi', 'hello', 'hey', 'yo', 'sup',
          'good morning', 'good afternoon', 'good evening'
        ];
        // Exact match
        if (greetingWords.includes(cleaned)) return true;
        // Starts with greeting word and message is short (≤3 words)
        const firstWord = cleaned.split(' ')[0];
        return greetingWords.some(word => firstWord === word) && cleaned.split(' ').length <= 3;
      };

      if (isSimpleGreeting(content)) {
        const response = "Hi there! 👋 I'm BrightPair, your AI tutor. I can explain concepts, create flashcards or quizzes, and help with homework. What would you like to work on today?";
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        return assistantMessage;
      }

      // Call the AI service for real content
      const response = await sendAITutorMessage(
        content, 
        session.user.id,
        activeTrackId || '',
        history ? [
          ...history.lessons,
          ...history.quizzes,
          ...history.recentConversations.slice(0, 5)
        ] : []
      );
      
      // Add AI response to the conversation
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Log the chat interaction to the database
      await logChatInteraction(content, response);
      
      return assistantMessage;
    } catch (error) {
      console.error('Error sending message to AI tutor:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from tutor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logChatInteraction = async (message: string, response: string) => {
    if (!session?.user?.id) return;

    // Only students write to chat_logs; teachers/tutors may not have RLS permissions.
    if (user?.role !== 'student') return;

    try {
      await supabase.from('chat_logs').insert({
        student_id: session.user.id,
        track_id: activeTrackId,
        message,
        response,
        skills_addressed: {} // This could be populated with skill data from the AI response
      });
    } catch (error) {
      console.error('Error logging chat interaction:', error);
    }
  };
  
  const clearConversation = () => {
    setMessages([]);
  };
  
  const setTrack = (trackId: string | null) => {
    setActiveTrackId(trackId);
  };
  
  const refreshLearningHistory = () => {
    return fetchLearningHistory();
  };
  
  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading,
    fetchLearningTracks,
    activeTrackId,
    setTrack,
    learningHistory,
    isLoadingHistory,
    refreshLearningHistory
  };
};
