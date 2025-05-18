import { supabase } from "@/integrations/supabase/client";

export interface ParentReport {
    id: string;
    student_name: string;
    tutor_name: string;
    report_date: string;
    score: number | null;
    is_viewed: boolean;
}

export const getReportsForParent = async (
    parentId: string,
): Promise<ParentReport[]> => {
    // 1. Get all students for this parent
    const { data: rels, error: relErr } = await supabase
        .from("student_parent_relationships")
        .select("student_id").eq("parent_id", parentId);
    if (relErr) return [];
    const studentIds = (rels ?? []).map((r: any) => r.student_id);
    if (studentIds.length === 0) return [];

    // 2. Get quizzes for these students, join profiles for names
    const { data, error } = await supabase
        .from("quizzes")
        .select(
            "id, created_at, score, student_id, tutor_id, profiles:student_id(full_name), tutor:profiles!quizzes_tutor_id_fkey(full_name)",
        )
        .in("student_id", studentIds)
        .order("created_at", { ascending: false });
    if (error) return [];

    return (data ?? []).map((row: any) => ({
        id: row.id,
        student_name: row.profiles?.full_name ?? "Student",
        tutor_name: row.tutor?.full_name ?? "Tutor",
        report_date: row.created_at,
        score: row.score ?? null,
        is_viewed: false,
    }));
};
