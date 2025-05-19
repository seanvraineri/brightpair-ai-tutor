import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Subject {
    id: string;
    name: string;
    description?: string | null;
}

const fetchSubjects = async (): Promise<Subject[]> => {
    const { data, error } = await supabase
        .from("learning_tracks")
        .select("id, name, description");

    if (error) throw error;
    return (data ?? []) as Subject[];
};

export const useSubjects = () => {
    return useQuery({ queryKey: ["subjects"], queryFn: fetchSubjects });
};
