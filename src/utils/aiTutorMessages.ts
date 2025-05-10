
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { LearningHistory } from './aiTutorHistory';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAITutorMessages = (
  userId?: string | null,
  activeTrackId?: string | null,
  userProfile?: any,
  getCachedResponse?: (content: string) => string | null,
  setCachedResponse?: (content: string, response: string) => void,
  learningHistory?: LearningHistory | null,
  fetchLearningHistory?: () => Promise<LearningHistory | null>
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      if (!userId) {
        throw new Error("You must be logged in to use the AI Tutor");
      }
      
      // Check client-side cache first if available
      if (getCachedResponse) {
        const cachedResponse = getCachedResponse(content);
        
        if (cachedResponse) {
          // Add AI response from cache to the conversation
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cachedResponse,
            timestamp: new Date(),
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return assistantMessage;
        }
      }
      
      // If we haven't loaded the history yet, fetch it now
      const history = learningHistory || (fetchLearningHistory ? await fetchLearningHistory() : null);
      
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
          studentId: userId,
          learningHistory: history,
          messageHistory
        }
      });
      
      clearTimeout(timeoutId);
      
      // Handle edge function response
      if (!response.data || response.error) {
        throw new Error(response.error?.message || "Failed to get response from tutor");
      }
      
      // Get the response text from the response object
      const responseText = response.data.response;
      
      if (!responseText) {
        throw new Error("Empty response received from tutor");
      }
      
      // Add AI response to the conversation
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };
      
      // Update client-side cache with the new response
      if (setCachedResponse) {
        setCachedResponse(content, responseText);
      }
      
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

  return {
    messages,
    sendMessage,
    clearConversation,
    isLoading
  };
};
