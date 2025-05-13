import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Local fallback types. These can be swapped for generated Supabase types
// after running `supabase gen types`.
export interface Assignment {
  id: string;
  student_id: string;
  tutor_id?: string;
  title: string;
  content_md?: string;
  due_at?: string; // ISO date string
  created_at: string;
  subject?: string;
  dueDate?: string; // legacy field used in UI
  status?: string;
}

export type NewAssignment = Omit<Assignment, "id" | "created_at">;

/**
 * Returns assignments for a given student and a helper to add a new one.
 */
export const useStudentAssignments = (studentId: string | undefined) => {
  const queryClient = useQueryClient();
  const queryKey = ["assignments", studentId];

  const query = useQuery({
    queryKey,
    enabled: !!studentId,
    queryFn: async () => {
      if (!studentId) return [] as Assignment[];
      const { data, error } = await (supabase as any)
        .from("assignments")
        .select("*")
        .eq("student_id", studentId)
        .order("due_at", { ascending: true });
      if (error) throw error;
      return data as Assignment[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (payload: NewAssignment) => {
      const { data, error } = await (supabase as any)
        .from("assignments")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return data as Assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("assignments")
        .update({ status: "completed" })
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    assignments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    addAssignment: addMutation.mutateAsync,
    isAdding: (addMutation as any).isLoading,
    completeAssignment: completeMutation.mutateAsync,
    isCompleting: (completeMutation as any).isLoading,
  };
}; 