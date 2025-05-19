import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/integrations/supabase/types";

export const useLowMasteryAlert = (studentId: string) => {
  useEffect(() => {
    const channel = supabase.channel("mastery")
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "student_skills",
        filter: `student_id=eq.${studentId}`,
      }, (payload) => {
        const newRow = payload.new as Tables<"student_skills">;
        if (
          typeof newRow.mastery_level === "number" && newRow.mastery_level < 0.3
        ) {
          toast.error("⚠️ Mastery drop detected!");
        }
      }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [studentId]);
};
