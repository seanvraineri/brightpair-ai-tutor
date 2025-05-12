import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { processDocumentForLesson, getUserDocuments, UserDocument } from '@/services/documentService';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { Lesson } from './useLesson';

export const useCustomLesson = () => {
  const { user, session } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  
  // Query for user's previous documents
  const { 
    data: userDocuments, 
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments
  } = useQuery<UserDocument[]>({
    queryKey: ['user-documents'],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      return getUserDocuments(session.user.id);
    },
    enabled: !!session?.user?.id
  });
  
  // Mutation for processing documents and generating lessons
  const { mutate: generateCustomLesson, isPending: isGenerating } = useMutation({
    mutationFn: async (params: {
      file?: File;
      text?: string;
      title: string;
      topic: string;
      focus?: string;
      difficulty?: string;
      learningGoal?: string;
    }) => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to generate a lesson");
      }
      
      setIsUploading(true);
      
      try {
        // Safely extract the learning style with type assertion
        const userAny = user as any;
        const learningStyle = userAny?.learning_style || 'visual';
        
        const result = await processDocumentForLesson({
          ...params,
          userId: session.user.id,
          learningPreferences: {
            style: learningStyle
          }
        });
        
        // Refresh the documents list
        queryClient.invalidateQueries({ queryKey: ['user-documents'] });
        
        return result;
      } finally {
        setIsUploading(false);
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Lesson Generated",
        description: "Your custom lesson has been generated successfully.",
        variant: "default",
      });
      
      // Add the lesson to the query cache so it can be accessed immediately
      queryClient.setQueryData(
        ['custom-lesson', data.lesson.title], 
        { success: true, lesson: data.lesson }
      );
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate lesson",
        variant: "destructive",
      });
    }
  });
  
  // Query for fetching a specific custom lesson
  const fetchCustomLesson = (lessonTitle: string) => 
    useQuery<{ success: boolean; lesson: Lesson }>({
      queryKey: ['custom-lesson', lessonTitle],
      enabled: !!lessonTitle,
      staleTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
    });
  
  return {
    userDocuments,
    isLoadingDocuments,
    refetchDocuments,
    generateCustomLesson,
    isGenerating,
    isUploading,
    fetchCustomLesson
  };
}; 