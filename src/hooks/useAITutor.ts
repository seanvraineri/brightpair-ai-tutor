
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';

// Define a type for cache items
interface CacheItem {
  response: string;
  timestamp: number;
}

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

// Configurable parameters
const CACHE_TTL = 5 * 60 * 1000; // Client-side cache lifetime: 5 minutes
const MAX_CACHE_SIZE = 50; // Maximum number of cached responses

export const useAITutor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useUser();
  const { toast } = useToast();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [learningHistory, setLearningHistory] = useState<LearningHistory | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  // Create a client-side response cache
  const [responseCache] = useState<Map<string, CacheItem>>(new Map());

  // Helper function to generate cache keys
  const generateCacheKey = useCallback((content: string): string => {
    return `${session?.user?.id || 'anonymous'}:${activeTrackId || 'null'}:${content.toLowerCase().trim()}`;
  }, [session?.user?.id, activeTrackId]);

  // Helper function to clean cache when it gets too large
  const cleanCache = useCallback(() => {
    if (responseCache.size > MAX_CACHE_SIZE) {
      // Convert map to array, sort by timestamp (oldest first)
      const entries = Array.from(responseCache.entries());
      const oldestEntries = entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, entries.length - MAX_CACHE_SIZE);
      
      // Delete oldest entries
      oldestEntries.forEach(([key]) => responseCache.delete(key));
    }
  }, [responseCache]);

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
      
      // Check client-side cache first
      const cacheKey = generateCacheKey(content);
      const cached = responseCache.get(cacheKey);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp < CACHE_TTL)) {
        console.log("Using cached response from client");
        
        // Add AI response from cache to the conversation
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: cached.response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return assistantMessage;
      }
      
      // Prepare the user profile data to send to the AI
      const userProfile = user ? {
        name: user.name,
        gamification: user.gamification
      } : null;
      
      // If we haven't loaded the history yet, fetch it now
      const history = learningHistory || await fetchLearningHistory();
      
      // Format message history for LangChain
      const messageHistory = messages.map(msg => ({
        type: msg.role === 'user' ? 'human' : 'ai',
        content: msg.content
      }));
      
      // Set a timeout to prevent hanging requests
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
          toast({
            title: "Request timeout",
            description: "The AI is taking too long to respond. Please try again.",
            variant: "destructive",
          });
        }
      }, 15000);
      
      // Call the AI Tutor edge function with message history for LangChain
      const response = await supabase.functions.invoke('ai-tutor', {
        body: { 
          message: content,
          userProfile,
          trackId: activeTrackId,
          studentId: session.user.id,
          learningHistory: history,
          messageHistory
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to get response from tutor");
      }
      
      // Add AI response to the conversation
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };
      
      // Update client-side cache with the new response
      responseCache.set(cacheKey, {
        response: response.data.response,
        timestamp: now
      });
      
      // Clean cache if it's getting too large
      cleanCache();
      
      setMessages(prev => [...prev, assistantMessage]);
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
