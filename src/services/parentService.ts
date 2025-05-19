import { supabase } from "@/integrations/supabase/client";

export interface ChildInfo {
    id: string;
    name: string | null;
    grade_level: string | null;
    last_session_date?: string | null;
    next_session_date?: string | null;
}

export const getChildrenForParent = async (
    parentId: string,
): Promise<ChildInfo[]> => {
    const { data, error } = await supabase
        .from("student_parent_relationships")
        .select("student_id, profiles:student_id(id, full_name, grade_level)")
        .eq("parent_id", parentId);

    if (error) {
        console.error("getChildrenForParent", error);
        return [];
    }

    const children: ChildInfo[] = [];
    const now = new Date();

    for (const row of data ?? []) {
        const profileRaw = row.profiles;
        if (
            !profileRaw || typeof profileRaw !== "object" ||
            Array.isArray(profileRaw)
        ) continue;
        const profile = profileRaw as {
            id: string;
            full_name: string | null;
            grade_level: string | null;
        };
        if (!profile.id) continue;

        // Last & next sessions
        const { data: sessions } = await supabase
            .from("appointments")
            .select("starts_at")
            .eq("student_id", profile.id)
            .order("starts_at");

        const past = (sessions ?? []).filter((s: { starts_at: string }) =>
            new Date(s.starts_at) < now
        );
        const future = (sessions ?? []).filter((s: { starts_at: string }) =>
            new Date(s.starts_at) >= now
        );

        children.push({
            id: profile.id,
            name: profile.full_name,
            grade_level: profile.grade_level,
            last_session_date: past.length
                ? past[past.length - 1].starts_at
                : null,
            next_session_date: future.length ? future[0].starts_at : null,
        });
    }

    return children;
};

export interface ParentMessage {
    id: string;
    sender_name: string | null;
    content: string;
    created_at: string;
    is_read: boolean;
}

export const getMessagesForParent = async (
    parentId: string,
): Promise<ParentMessage[]> => {
    const { data, error } = await supabase
        .from("messages")
        .select(
            "id, content, created_at, sender_id, profiles!messages_sender_id_fkey(full_name)",
        )
        .eq("receiver_id", parentId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("getMessagesForParent", error);
        return [];
    }

    return (data ?? []).map((
        row: {
            id: string;
            content: string;
            created_at: string;
            profiles?: { full_name?: string | null };
        },
    ) => ({
        id: row.id,
        sender_name: row.profiles?.full_name ?? null,
        content: row.content,
        created_at: row.created_at,
        is_read: false,
    }));
};
