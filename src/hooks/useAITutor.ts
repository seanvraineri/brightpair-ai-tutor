import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { sendAITutorMessage } from "@/services/aiService";
import { Tables } from "@/integrations/supabase/types";
import { logger } from '@/services/logger';

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Track type for learning tracks with joined learning_tracks
export interface Track {
  track_id: string;
  learning_tracks: {
    id: string;
    name: string;
    description: string;
  };
}

interface LearningHistory {
  homework: Tables<"homework">[];
  quizzes: Tables<"assignments">[];
  lessons: Tables<"lessons">[];
  tracks: Track[];
  recentConversations: Tables<"chat_logs">[];
}

export const useAITutor = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useUser();
  const { toast } = useToast();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [learningHistory, setLearningHistory] = useState<
    LearningHistory | null
  >(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Function to fetch user's learning tracks
  const fetchLearningTracks = async (): Promise<Track[]> => {
    if (!session?.user?.id) return [];

    try {
      const { data, error } = await supabase
        .from("student_tracks")
        .select("track_id, learning_tracks(id, name, description)")
        .eq("student_id", session.user.id);

      if (error) throw error;
      return (data as Track[]) || [];
    } catch (error) {
      
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
        .from("homework")
        .select("*")
        .eq("student_id", session.user.id)
        .order("due_at", { ascending: false })
        .limit(10);

      if (homeworkError) {
        
      }

      // Fetch quiz-like assignments (fallback to assignments table until dedicated quizzes table exists)
      const { data: quizzes, error: quizzesError } = await supabase
        .from("assignments")
        .select("*")
        .eq("student_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (quizzesError) {
        
      }

      // Attempt to fetch lesson history – guard if table missing in local dev
      let lessons: Tables<"lessons">[] = [];
      try {
        const { data: lessonRows } = await supabase
          .from("lessons")
          .select("*")
          .eq("student_id", session.user.id)
          .order("completed_at", { ascending: false })
          .limit(10);
        lessons = lessonRows || [];
      } catch (_err) {
        lessons = [];
      }

      // Fetch recent conversation snippets if table exists
      let recentConversations: Tables<"chat_logs">[] = [];
      const { data: convoRows, error: convoErr } = await supabase
        .from("chat_logs")
        .select("*")
        .eq("student_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      if (convoErr) {
        recentConversations = [];
      } else {
        recentConversations = convoRows || [];
      }

      // Fetch active learning tracks
      const tracks = await fetchLearningTracks();

      const history: LearningHistory = {
        homework: homework || [],
        quizzes: quizzes || [],
        lessons,
        tracks,
        recentConversations,
      };

      setLearningHistory(history);
      return history;
    } catch (error) {
      
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
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to use the AI Tutor");
      }

      // If we haven't loaded the history yet, fetch it now
      const history = learningHistory || await fetchLearningHistory();

      // Detect simple greetings and answer locally to save tokens
      const isSimpleGreeting = (text: string): boolean => {
        const cleaned = text.trim().toLowerCase().replace(/[!?.]/g, "");
        const greetingWords = [
          "hi",
          "hello",
          "hey",
          "yo",
          "sup",
          "good morning",
          "good afternoon",
          "good evening",
        ];
        // Exact match
        if (greetingWords.includes(cleaned)) return true;
        // Starts with greeting word and message is short (≤3 words)
        const firstWord = cleaned.split(" ")[0];
        return greetingWords.some((word) => firstWord === word) &&
          cleaned.split(" ").length <= 3;
      };

      if (isSimpleGreeting(content)) {
        const response =
          "Hi there! 👋 I'm BrightPair, your AI tutor. I can explain concepts, create flashcards or quizzes, and help with homework. What would you like to work on today?";
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        return assistantMessage;
      }

      // Call the AI service for real content
      const response = await sendAITutorMessage(
        content,
        session.user.id,
        activeTrackId || "",
        history
          ? [
            ...history.lessons,
            ...history.quizzes,
            ...history.recentConversations.slice(0, 5),
          ]
          : [],
      );

      // Add AI response to the conversation
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: typeof response === "string"
          ? response
          : JSON.stringify(response),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Log the chat interaction to the database
      await logChatInteraction(
        content,
        typeof response === "string" ? response : JSON.stringify(response),
      );

      return assistantMessage;
    } catch (error) {
      
      toast({
        title: "Error",
        description: error instanceof Error
          ? error.message
          : "Failed to get response from tutor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logChatInteraction = async (message: string, response: string) => {
    if (!session?.user?.id) return;

    // Only students write to chat_logs; teachers/tutors may not have RLS permissions.
    if (user?.role !== "student") return;

    try {
      await supabase.from("chat_logs").insert({
        student_id: session.user.id,
        track_id: activeTrackId,
        message,
        response,
        skills_addressed: {}, // placeholder
      });
    } catch (error) {
      logger.debug('Caught error:', error);
      
    
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
    refreshLearningHistory,
  };
};
