/**
 * Student Service - Handles student data fetching and management
 */

import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";
import { isDevelopment } from "@/utils/env";

export interface Student {
    id: string;
    full_name: string;
    grade_level: string;
    subject?: string;
    subjects?: string[];
    email?: string;
    avatar?: string;
    tutor_id?: string;
    created_at?: string;
}

interface LearningPreferences {
    grade?: string;
    subject?: string;
    subjects?: string[];
    style?: string;
}

// Development fallback data
const FALLBACK_STUDENTS: Student[] = [
    {
        id: "student-1",
        full_name: "Emma Johnson",
        grade_level: "8th",
        subject: "Mathematics",
        subjects: ["Mathematics", "Science"],
        email: "emma.j@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    },
    {
        id: "student-2",
        full_name: "Noah Williams",
        grade_level: "5th",
        subject: "Science",
        subjects: ["Science", "English"],
        email: "noah.w@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    },
    {
        id: "student-3",
        full_name: "Alex Smith",
        grade_level: "10th",
        subject: "Mathematics",
        subjects: ["Mathematics", "Physics"],
        email: "alex.s@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
        id: "student-4",
        full_name: "Sophie Chen",
        grade_level: "7th",
        subject: "English",
        subjects: ["English", "History"],
        email: "sophie.c@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    },
];

class StudentService {
    /**
     * Fetch all students for a tutor
     */
    async getStudentsForTutor(tutorId?: string): Promise<Student[]> {
        try {
            if (!tutorId) {
                logger.warn("No tutor ID provided, returning empty array");
                return [];
            }

            // First get the student IDs from tutor_students junction table
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

            // Now get the student profiles
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .in("id", studentIds)
                .eq("role", "student")
                .order("name");

            if (error) throw error;

            // Map the profiles data to Student interface
            const students: Student[] = (data || []).map((profile) => {
                const prefs = profile.learning_preferences as
                    | LearningPreferences
                    | null;
                return {
                    id: profile.id,
                    full_name: profile.name || profile.full_name ||
                        "Unknown Student",
                    grade_level: prefs?.grade || "N/A",
                    subject: prefs?.subject || "General",
                    subjects: prefs?.subjects || [prefs?.subject || "General"],
                    email: profile.email,
                    avatar:
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`,
                    tutor_id: tutorId,
                    created_at: profile.created_at,
                };
            });

            logger.info(
                `Fetched ${students.length} students for tutor ${tutorId}`,
            );
            return students;
        } catch (error) {
            logger.error("Failed to fetch students", error);

            // In development, return fallback data if DB fails
            if (isDevelopment()) {
                logger.warn("Using fallback student data in development");
                return FALLBACK_STUDENTS;
            }

            throw error;
        }
    }

    /**
     * Fetch a single student by ID
     */
    async getStudentById(studentId: string): Promise<Student | null> {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", studentId)
                .single();

            if (error) throw error;

            if (!data) return null;

            const prefs = data.learning_preferences as
                | LearningPreferences
                | null;
            const student: Student = {
                id: data.id,
                full_name: data.name || data.full_name || "Unknown Student",
                grade_level: prefs?.grade || "N/A",
                subject: prefs?.subject || "General",
                subjects: prefs?.subjects || [prefs?.subject || "General"],
                email: data.email,
                avatar:
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
                created_at: data.created_at,
            };

            return student;
        } catch (error) {
            logger.error(`Failed to fetch student ${studentId}`, error);

            // In development, try to find in fallback data
            if (isDevelopment()) {
                const fallbackStudent = FALLBACK_STUDENTS.find((s) =>
                    s.id === studentId
                );
                if (fallbackStudent) {
                    logger.warn(`Using fallback data for student ${studentId}`);
                    return fallbackStudent;
                }
            }

            throw error;
        }
    }

    /**
     * Search students by name
     */
    async searchStudents(query: string, tutorId?: string): Promise<Student[]> {
        try {
            let studentIds: string[] = [];

            // If tutorId is provided, get their students first
            if (tutorId) {
                const { data: tutorStudents, error: tutorError } =
                    await supabase
                        .from("tutor_students")
                        .select("student_id")
                        .eq("tutor_id", tutorId);

                if (tutorError) throw tutorError;
                studentIds = tutorStudents?.map((ts) => ts.student_id) || [];
            }

            let queryBuilder = supabase
                .from("profiles")
                .select("*")
                .eq("role", "student")
                .or(`name.ilike.%${query}%,full_name.ilike.%${query}%`);

            // If we have specific student IDs, filter by them
            if (studentIds.length > 0) {
                queryBuilder = queryBuilder.in("id", studentIds);
            }

            const { data, error } = await queryBuilder.order("name");

            if (error) throw error;

            const students: Student[] = (data || []).map((profile) => {
                const prefs = profile.learning_preferences as
                    | LearningPreferences
                    | null;
                return {
                    id: profile.id,
                    full_name: profile.name || profile.full_name ||
                        "Unknown Student",
                    grade_level: prefs?.grade || "N/A",
                    subject: prefs?.subject || "General",
                    subjects: prefs?.subjects || [prefs?.subject || "General"],
                    email: profile.email,
                    avatar:
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`,
                    tutor_id: tutorId,
                    created_at: profile.created_at,
                };
            });

            return students;
        } catch (error) {
            logger.error(
                `Failed to search students with query: ${query}`,
                error,
            );

            // In development, search fallback data
            if (isDevelopment()) {
                logger.warn("Searching fallback student data");
                return FALLBACK_STUDENTS.filter((s) =>
                    s.full_name.toLowerCase().includes(query.toLowerCase())
                );
            }

            throw error;
        }
    }

    /**
     * Create a new student
     */
    async createStudent(
        studentData: Partial<Student> & { full_name: string },
    ): Promise<Student> {
        try {
            const { data: authData, error: authError } = await supabase.auth
                .getUser();
            if (authError) throw authError;

            // Create the learning preferences object as plain JSON
            const learningPreferences = {
                grade: studentData.grade_level,
                subject: studentData.subject,
                subjects: studentData.subjects,
            };

            // Create the student profile
            const { data, error } = await supabase
                .from("profiles")
                .insert({
                    id: crypto.randomUUID(), // Generate ID to insert
                    email: studentData.email ||
                        `${
                            studentData.full_name.toLowerCase().replace(
                                /\s+/g,
                                ".",
                            )
                        }@student.brightpair.com`,
                    name: studentData.full_name,
                    full_name: studentData.full_name,
                    role: "student",
                    learning_preferences: learningPreferences,
                })
                .select()
                .single();

            if (error) throw error;

            // Link the student to the tutor
            const { error: linkError } = await supabase
                .from("tutor_students")
                .insert({
                    tutor_id: authData.user.id,
                    student_id: data.id,
                });

            if (linkError) {
                logger.error("Failed to link student to tutor", linkError);
            }

            const prefs = data.learning_preferences as
                | LearningPreferences
                | null;
            const student: Student = {
                id: data.id,
                full_name: data.name || data.full_name,
                grade_level: prefs?.grade || "N/A",
                subject: prefs?.subject || "General",
                subjects: prefs?.subjects || [prefs?.subject || "General"],
                email: data.email,
                avatar:
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
                tutor_id: authData.user.id,
                created_at: data.created_at,
            };

            logger.info(`Created new student: ${student.id}`);
            return student;
        } catch (error) {
            logger.error("Failed to create student", error);
            throw error;
        }
    }
}

// Export singleton instance
export const studentService = new StudentService();

// Export convenience functions
export const getStudentsForTutor = (tutorId?: string) =>
    studentService.getStudentsForTutor(tutorId);
export const getStudentById = (studentId: string) =>
    studentService.getStudentById(studentId);
export const searchStudents = (query: string, tutorId?: string) =>
    studentService.searchStudents(query, tutorId);
export const createStudent = (
    studentData: Partial<Student> & { full_name: string },
) => studentService.createStudent(studentData);
