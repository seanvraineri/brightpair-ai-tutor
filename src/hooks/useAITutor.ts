
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAITutorCache } from '@/utils/aiTutorCache';
import { useAITutorHistory } from '@/utils/aiTutorHistory';
import { useAITutorMessages, Message } from '@/utils/aiTutorMessages';

export const useAITutor = () => {
  const { user, session } = useUser();
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  
  // Initialize the cache module
  const { getCachedResponse, setCachedResponse } = useAITutorCache(
    session?.user?.id,
    activeTrackId
  );
  
  // Initialize the history module
  const { 
    learningHistory, 
    isLoadingHistory, 
    fetchLearningHistory 
  } = useAITutorHistory(session?.user?.id);
  
  // Initialize the messages module
  const { 
    messages, 
    sendMessage, 
    clearConversation, 
    isLoading 
  } = useAITutorMessages(
    session?.user?.id,
    activeTrackId,
    user ? { name: user.name, gamification: user.gamification } : null,
    getCachedResponse,
    setCachedResponse,
    learningHistory,
    fetchLearningHistory
  );
  
  // Fetch learning history when user session is available
  useEffect(() => {
    if (session?.user?.id) {
      fetchLearningHistory();
    }
  }, [session?.user?.id]);
  
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
    fetchLearningTracks: async () => {
      // We just need to expose this function from the history module
      return learningHistory?.tracks || [];
    },
    activeTrackId,
    setTrack,
    learningHistory,
    isLoadingHistory,
    refreshLearningHistory
  };
};
