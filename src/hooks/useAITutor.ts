
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
  const { user } = useUser();
  const { toast } = useToast();

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
      // Prepare the user profile data to send to the AI
      const userProfile = user ? {
        name: user.name,
        gamification: user.gamification
      } : null;
      
      // Call the AI Tutor edge function
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: { 
          message: content,
          userProfile
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
      
      // Could award XP here or call another function to do so
      
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
  
  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading
  };
};
