import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export interface SubjectProgress {
    name: string;
    value: number; // percentage 0-100
    color?: string;
}

export interface ProgressSnapshot {
    overallProgress: number; // avg mastery %
    attendanceRate: number; // % of attended sessions this month
    completionRate: number; // % homework completed
    quizAverage: number; // avg quiz score
    subjectProgress: SubjectProgress[];
}

export interface StudentSkill {
    id: string;
    name: string;
    mastery: number; // 0-5 scale
    description?: string;
}

const COLORS = [
    "#8B5CF6",
    "#0EA5E9",
    "#F97316",
    "#D946EF",
    "#34D399",
    "#F43F5E",
];

export const fetchProgress = async (
    studentId: string,
): Promise<ProgressSnapshot> => {
    // 1. Overall mastery
    const { data: masteryRows } = await supabase
        .from("student_skills")
        .select("mastery_level, skill_id")
        .eq("student_id", studentId);

    let overallProgress = 0;
    let subjectProgress: SubjectProgress[] = [];

    if (masteryRows && masteryRows.length > 0) {
        type MasteryRow = { mastery_level: number | null; skill_id: string };
        overallProgress = masteryRows.reduce((sum, r: MasteryRow) =>
            sum + (r.mastery_level ?? 0), 0) / masteryRows.length * 100;

        // group by skill name via join in memory (quick):
        const skillIds = masteryRows.map((r: MasteryRow) =>
            r.skill_id
        );
        const { data: skillRows } = await supabase
            .from("skills")
            .select("id, name")
            .in("id", skillIds);

        if (skillRows) {
            type SkillRow = { id: string; name: string };
            const map = new Map<string, { total: number; count: number }>();
            masteryRows.forEach((mr: MasteryRow) => {
                const skill = (skillRows as SkillRow[]).find((s) =>
                    s.id === mr.skill_id
                );
                const key = skill?.name || mr.skill_id;
                const entry = map.get(key) || { total: 0, count: 0 };
                entry.total += mr.mastery_level ?? 0;
                entry.count += 1;
                map.set(key, entry);
            });
            subjectProgress = Array.from(map.entries()).map((
                [name, v],
                idx,
            ) => ({
                name,
                value: Math.round((v.total / v.count) * 100),
                color: COLORS[idx % COLORS.length],
            }));
        }
    }

    // 2. Attendance: count appointments in current month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const { data: appts } = await supabase
        .from("appointments")
        .select("status")
        .eq("student_id", studentId)
        .gte("starts_at", monthStart.toISOString());
    let attendanceRate = 0;
    if (appts && appts.length > 0) {
        type ApptRow = { status: string };
        const attended = (appts as ApptRow[]).filter((a) =>
            a.status === "completed"
        ).length;
        attendanceRate = Math.round(attended / appts.length * 100);
    }

    // 3. Homework completion
    const { data: homeworkRows } = await supabase
        .from("homework")
        .select("status")
        .eq("student_id", studentId);
    let completionRate = 0;
    if (homeworkRows && homeworkRows.length > 0) {
        type HomeworkRow = { status: string };
        const completed = (homeworkRows as HomeworkRow[]).filter((h) =>
            h.status === "completed"
        ).length;
        completionRate = Math.round(completed / homeworkRows.length * 100);
    }

    // 4. Quiz average
    const { data: quizRows } = await supabase
        .from("quizzes")
        .select("score")
        .eq("student_id", studentId)
        .not("score", "is", null);
    let quizAverage = 0;
    if (quizRows && quizRows.length > 0) {
        type QuizRow = { score: number | null };
        const sum = (quizRows as QuizRow[]).reduce(
            (acc: number, q) => acc + (q.score ?? 0),
            0,
        );
        quizAverage = Math.round(sum / quizRows.length);
    }

    return {
        overallProgress: Math.round(overallProgress),
        attendanceRate,
        completionRate,
        quizAverage,
        subjectProgress,
    };
};

export const getStudentSkills = async (
    studentId: string,
): Promise<StudentSkill[]> => {
    const { data, error } = await supabase
        .from("student_skills")
        .select("skill_id, mastery_level, skills(name, description)")
        .eq("student_id", studentId);

    if (error) {
        
        return [];
    }

    return (data ?? []).map((
        row: {
            skill_id: string;
            mastery_level: number | null;
            skills?: { name?: string; description?: string };
        },
    ) => ({
        id: row.skill_id,
        name: row.skills?.name ?? row.skill_id,
        mastery: row.mastery_level !== null
            ? Math.round(row.mastery_level * 5)
            : 0,
        description: row.skills?.description ?? undefined,
    }));
};
