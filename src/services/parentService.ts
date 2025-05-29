/**
 * Parent Service - Handles parent data fetching and management
 */

import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";
import { isDevelopment } from "@/utils/env";
import { LearningPreferences } from "@/types/common";

export interface Parent {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    student_id: string;
    student_name?: string;
    relationship?: string;
    avatar?: string;
    created_at?: string;
}

// Development fallback data
const FALLBACK_PARENTS: Parent[] = [
    {
        id: "parent-1",
        full_name: "John Johnson",
        email: "john.johnson@example.com",
        phone: "(555) 123-4567",
        student_id: "student-1",
        student_name: "Emma Johnson",
        relationship: "Father",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
        id: "parent-2",
        full_name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "(555) 123-4568",
        student_id: "student-1",
        student_name: "Emma Johnson",
        relationship: "Mother",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        id: "parent-3",
        full_name: "Michael Williams",
        email: "michael.williams@example.com",
        phone: "(555) 234-5678",
        student_id: "student-2",
        student_name: "Noah Williams",
        relationship: "Father",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
];

class ParentService {
    /**
     * Fetch all parents for a tutor's students
     */
    async getParentsForTutor(tutorId?: string): Promise<Parent[]> {
        try {
            if (!tutorId) {
                logger.warn("No tutor ID provided for parent fetch");
                return [];
            }

            // First get the student IDs for this tutor
            const { data: tutorStudents, error: tutorError } = await supabase
                .from("tutor_students")
                .select("student_id")
                .eq("tutor_id", tutorId);

            if (tutorError) throw tutorError;

            if (!tutorStudents || tutorStudents.length === 0) {
                logger.info(`No students found for tutor ${tutorId}`);
                return [];
            }

            const studentIds = tutorStudents.map((ts) => ts.student_id);

            // Get parent-student relationships
            const { data: relationships, error: relError } = await supabase
                .from("student_parent_relationships")
                .select(`
          id,
          student_id,
          parent_id,
          profiles!student_parent_relationships_parent_id_fkey (
            id,
            name,
            full_name,
            email
          )
        `)
                .in("student_id", studentIds);

            if (relError) throw relError;

            // Get student names for reference
            const { data: students, error: studentError } = await supabase
                .from("profiles")
                .select("id, name, full_name")
                .in("id", studentIds);

            if (studentError) throw studentError;

            const studentMap = new Map(
                students?.map(
                    (s) => [s.id, s.name || s.full_name || "Unknown Student"],
                ) || [],
            );

            // Map relationships to Parent interface
            const parents: Parent[] = (relationships || []).map((rel) => {
                const parentProfile = rel.profiles;
                return {
                    id: parentProfile.id,
                    full_name: parentProfile.name || parentProfile.full_name ||
                        "Unknown Parent",
                    email: parentProfile.email,
                    student_id: rel.student_id,
                    student_name: studentMap.get(rel.student_id),
                    avatar:
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${parentProfile.name}`,
                };
            });

            logger.info(
                `Fetched ${parents.length} parents for tutor ${tutorId}`,
            );
            return parents;
        } catch (error) {
            logger.error("Failed to fetch parents", error);

            // In development, return fallback data if DB fails
            if (isDevelopment()) {
                logger.warn("Using fallback parent data in development");
                return FALLBACK_PARENTS;
            }

            throw error;
        }
    }

    /**
     * Fetch parents for a specific student
     */
    async getParentsForStudent(studentId: string): Promise<Parent[]> {
        try {
            const { data: relationships, error } = await supabase
                .from("student_parent_relationships")
                .select(`
          id,
          student_id,
          parent_id,
          profiles!student_parent_relationships_parent_id_fkey (
            id,
            name,
            full_name,
            email
          )
        `)
                .eq("student_id", studentId);

            if (error) throw error;

            // Get student name
            const { data: student, error: studentError } = await supabase
                .from("profiles")
                .select("name, full_name")
                .eq("id", studentId)
                .single();

            if (studentError) throw studentError;

            const studentName = student?.name || student?.full_name ||
                "Unknown Student";

            // Map to Parent interface
            const parents: Parent[] = (relationships || []).map((rel) => {
                const parentProfile = rel.profiles;
                return {
                    id: parentProfile.id,
                    full_name: parentProfile.name || parentProfile.full_name ||
                        "Unknown Parent",
                    email: parentProfile.email,
                    student_id: studentId,
                    student_name: studentName,
                    avatar:
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${parentProfile.name}`,
                };
            });

            return parents;
        } catch (error) {
            logger.error(
                `Failed to fetch parents for student ${studentId}`,
                error,
            );

            // In development, return filtered fallback data
            if (isDevelopment()) {
                logger.warn(
                    `Using fallback parent data for student ${studentId}`,
                );
                return FALLBACK_PARENTS.filter((p) =>
                    p.student_id === studentId
                );
            }

            throw error;
        }
    }

    /**
     * Create a parent-student relationship
     */
    async createParentStudentRelationship(
        parentEmail: string,
        studentId: string,
    ): Promise<void> {
        try {
            // First check if parent exists
            const { data: parentProfile, error: parentError } = await supabase
                .from("profiles")
                .select("id")
                .eq("email", parentEmail)
                .eq("role", "parent")
                .single();

            if (parentError || !parentProfile) {
                throw new Error("Parent not found with that email");
            }

            // Create the relationship
            const { error } = await supabase
                .from("student_parent_relationships")
                .insert({
                    parent_id: parentProfile.id,
                    student_id: studentId,
                });

            if (error) throw error;

            logger.info(
                `Created parent-student relationship: ${parentProfile.id} - ${studentId}`,
            );
        } catch (error) {
            logger.error("Failed to create parent-student relationship", error);
            throw error;
        }
    }
}

// Export singleton instance
export const parentService = new ParentService();

// Export convenience functions
export const getParentsForTutor = (tutorId?: string) =>
    parentService.getParentsForTutor(tutorId);
export const getParentsForStudent = (studentId: string) =>
    parentService.getParentsForStudent(studentId);
export const createParentStudentRelationship = (
    parentEmail: string,
    studentId: string,
) => parentService.createParentStudentRelationship(parentEmail, studentId);

// Additional types for parent dashboard
export interface ChildInfo {
    id: string;
    name: string | null;
    grade_level: string | null;
    last_session_date?: string | null;
    next_session_date?: string | null;
}

export interface ParentMessage {
    id: string;
    sender_name: string | null;
    content: string;
    created_at: string;
    is_read: boolean;
}

// Functions for parent dashboard
export const getChildrenForParent = async (
    parentId: string,
): Promise<ChildInfo[]> => {
    try {
        const { data, error } = await supabase
            .from("student_parent_relationships")
            .select(`
        student_id,
        profiles!student_parent_relationships_student_id_fkey (
          id,
          name,
          full_name,
          learning_preferences
        )
      `)
            .eq("parent_id", parentId);

        if (error) throw error;

        const children: ChildInfo[] = (data || []).map((rel) => {
            const student = rel.profiles;
            const prefs = student.learning_preferences as
                | LearningPreferences
                | null;

            return {
                id: student.id,
                name: student.name || student.full_name,
                grade_level: prefs?.grade || null,
                last_session_date: null, // Would need appointments data
                next_session_date: null, // Would need appointments data
            };
        });

        return children;
    } catch (error) {
        logger.error("Failed to fetch children for parent", error);
        return [];
    }
};

export const getMessagesForParent = async (
    parentId: string,
): Promise<ParentMessage[]> => {
    try {
        const { data, error } = await supabase
            .from("messages")
            .select(`
        id,
        content,
        created_at,
        sender_id,
        profiles!messages_sender_id_fkey (
          name,
          full_name
        )
      `)
            .eq("receiver_id", parentId)
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) throw error;

        return (data || []).map((msg) => ({
            id: msg.id,
            sender_name: msg.profiles?.name || msg.profiles?.full_name || null,
            content: msg.content,
            created_at: msg.created_at,
            is_read: false, // Would need to track read status
        }));
    } catch (error) {
        logger.error("Failed to fetch messages for parent", error);
        return [];
    }
};
