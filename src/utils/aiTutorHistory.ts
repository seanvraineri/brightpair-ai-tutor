
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface LearningHistory {
  homework: any[];
  quizzes: any[];
  lessons: any[];
  tracks: any[];
  recentConversations: any[];
}

export const useAITutorHistory = (userId?: string | null) => {
  const [learningHistory, setLearningHistory] = useState<LearningHistory | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { toast } = useToast();

  // Function to fetch user's learning tracks
  const fetchLearningTracks = async () => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from('student_tracks')
        .select('track_id, learning_tracks(id, name, description)')
        .eq('student_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching learning tracks:', error);
      return [];
    }
  };

  // Function to fetch user's learning history
  const fetchLearningHistory = async () => {
    if (!userId) return null;
    setIsLoadingHistory(true);
    
    try {
      // Fetch homework assignments
      const { data: homework, error: homeworkError } = await supabase
        .from('homework')
        .select('*')
        .eq('student_id', userId)
        .order('due_date', { ascending: false })
        .limit(10);
      
      if (homeworkError) {
        console.error('Error fetching homework:', homeworkError);
      }
      
      // Fetch quiz results
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('student_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);
      
      if (quizzesError) {
        console.error('Error fetching quizzes:', quizzesError);
      }
      
      // Fetch lesson history
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('student_id', userId)
        .order('completed_at', { ascending: false })
        .limit(10);
      
      if (lessonsError) {
        console.error('Error fetching lessons:', lessonsError);
      }
      
      // Fetch chat history from chat_logs table
      const { data: recentConversations, error: chatError } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('student_id', userId)
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

  return {
    learningHistory,
    isLoadingHistory,
    fetchLearningHistory
  };
};
