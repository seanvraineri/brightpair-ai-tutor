import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export const useLowMasteryAlert = (studentId: string) => {
  useEffect(() => {
    const channel = supabase.channel('mastery')
      .on('postgres_changes', 
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'student_skills',
          filter: `student_id=eq.${studentId}`
        },
        payload => {
          if ((payload.new as any).mastery < 0.3) {
            toast.error("⚠️ Mastery drop detected!");
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);
}; 