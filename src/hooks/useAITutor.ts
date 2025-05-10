
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAITutor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useUser();
  const { toast } = useToast();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

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
      
      // Prepare the user profile data to send to the AI
      const userProfile = user ? {
        name: user.name,
        gamification: user.gamification
      } : null;
      
      // Call the AI Tutor edge function
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: { 
          message: content,
          userProfile,
          trackId: activeTrackId,
          studentId: session.user.id
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Failed to get response from tutor");
      }
      
      // Add AI response to the conversation
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Log the chat interaction to the database
      await logChatInteraction(content, data.response);
      
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
  
  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading,
    fetchLearningTracks,
    activeTrackId,
    setTrack
  };
};
