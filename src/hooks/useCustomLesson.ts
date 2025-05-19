import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserDocuments,
  processDocumentForLesson,
  UserDocument,
} from "@/services/documentService";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Lesson } from "./useLesson";
import { User } from "@/contexts/UserTypes";

export const useCustomLesson = () => {
  const { user, session } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Query for user's previous documents
  const {
    data: userDocuments,
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments,
  } = useQuery<UserDocument[]>({
    queryKey: ["user-documents"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      return getUserDocuments(session.user.id);
    },
    enabled: !!session?.user?.id,
  });

  // Mutation for processing documents and generating lessons
  const { mutate: generateCustomLesson, isPending: isGenerating } = useMutation<
    UserDocument | null,
    Error,
    {
      file?: File;
      text?: string;
      title: string;
      topic: string;
      focus?: string;
      difficulty?: "easy" | "medium" | "hard";
      learningGoal?: string;
    }
  >({
    mutationFn: async (params) => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to generate a lesson");
      }
      setIsUploading(true);
      try {
        let learningStyle = "visual";
        if (
          user && typeof user === "object" && "learning_style" in user &&
          typeof (user as User).learning_style === "string"
        ) {
          learningStyle = (user as User).learning_style;
        }
        const result = await processDocumentForLesson({
          ...params,
          userId: session.user.id,
          learningPreferences: {
            style: learningStyle,
          },
        });
        queryClient.invalidateQueries({ queryKey: ["user-documents"] });
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
      queryClient.invalidateQueries({ queryKey: ["user-documents"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate lesson",
        variant: "destructive",
      });
    },
  });

  // Query for fetching a specific custom lesson
  const fetchCustomLesson = (lessonTitle: string) =>
    useQuery<{ success: boolean; lesson: Lesson }>({
      queryKey: ["custom-lesson", lessonTitle],
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
    fetchCustomLesson,
  };
};
