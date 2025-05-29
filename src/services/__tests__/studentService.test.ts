import { studentService } from "../studentService";
import { supabase } from "@/integrations/supabase/client";
import * as env from "@/utils/env";

// Mock Supabase client
jest.mock("@/integrations/supabase/client", () => ({
    supabase: {
        from: jest.fn(),
        auth: {
            getUser: jest.fn(),
        },
    },
}));

// Mock environment utilities
jest.mock("@/utils/env");

describe("StudentService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default to development mode for most tests
        (env.isDevelopment as jest.Mock).mockReturnValue(true);
    });

    describe("getStudentsForTutor", () => {
        it("should return empty array when no tutor ID provided", async () => {
            const result = await studentService.getStudentsForTutor();
            expect(result).toEqual([]);
        });

        it("should fetch students successfully", async () => {
            const mockTutorId = "tutor-123";
            const mockTutorStudents = [
                { student_id: "student-1" },
                { student_id: "student-2" },
            ];

            const mockProfiles = [
                {
                    id: "student-1",
                    name: "John Doe",
                    email: "john@example.com",
                    created_at: "2024-01-01",
                    learning_preferences: { grade: "10th", subject: "Math" },
                },
                {
                    id: "student-2",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    created_at: "2024-01-02",
                    learning_preferences: { grade: "9th", subject: "Science" },
                },
            ];

            // Mock tutor_students query
            const tutorStudentsQuery = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    data: mockTutorStudents,
                    error: null,
                }),
            };

            // Mock profiles query
            const profilesQuery = {
                select: jest.fn().mockReturnThis(),
                in: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockProfiles,
                    error: null,
                }),
            };

            (supabase.from as jest.Mock)
                .mockImplementationOnce(() => tutorStudentsQuery)
                .mockImplementationOnce(() => profilesQuery);

            const result = await studentService.getStudentsForTutor(
                mockTutorId,
            );

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: "student-1",
                full_name: "John Doe",
                grade_level: "10th",
                subject: "Math",
                email: "john@example.com",
            });
            expect(result[1]).toMatchObject({
                id: "student-2",
                full_name: "Jane Smith",
                grade_level: "9th",
                subject: "Science",
                email: "jane@example.com",
            });
        });

        it("should return empty array when no students found", async () => {
            const mockTutorId = "tutor-123";

            const tutorStudentsQuery = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    data: [],
                    error: null,
                }),
            };

            (supabase.from as jest.Mock).mockReturnValue(tutorStudentsQuery);

            const result = await studentService.getStudentsForTutor(
                mockTutorId,
            );
            expect(result).toEqual([]);
        });

        it("should handle database errors gracefully", async () => {
            // Set production mode to test error throwing
            (env.isDevelopment as jest.Mock).mockReturnValue(false);

            const mockTutorId = "tutor-123";
            const mockError = new Error("Database error");

            const tutorStudentsQuery = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    data: null,
                    error: mockError,
                }),
            };

            (supabase.from as jest.Mock).mockReturnValue(tutorStudentsQuery);

            await expect(studentService.getStudentsForTutor(mockTutorId))
                .rejects.toThrow("Database error");
        });

        it("should return fallback data in development when database errors", async () => {
            // Ensure development mode
            (env.isDevelopment as jest.Mock).mockReturnValue(true);

            const mockTutorId = "tutor-123";
            const mockError = new Error("Database error");

            const tutorStudentsQuery = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({
                    data: null,
                    error: mockError,
                }),
            };

            (supabase.from as jest.Mock).mockReturnValue(tutorStudentsQuery);

            const result = await studentService.getStudentsForTutor(
                mockTutorId,
            );
            expect(result.length).toBeGreaterThan(0);
            expect(result[0]).toHaveProperty("id");
            expect(result[0]).toHaveProperty("full_name");
        });
    });

    describe("getStudentById", () => {
        it("should fetch a single student successfully", async () => {
            const mockStudentId = "student-1";
            const mockProfile = {
                id: "student-1",
                name: "John Doe",
                email: "john@example.com",
                created_at: "2024-01-01",
                learning_preferences: { grade: "10th", subject: "Math" },
            };

            const query = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockProfile,
                    error: null,
                }),
            };

            (supabase.from as jest.Mock).mockReturnValue(query);

            const result = await studentService.getStudentById(mockStudentId);

            expect(result).toMatchObject({
                id: "student-1",
                full_name: "John Doe",
                grade_level: "10th",
                subject: "Math",
                email: "john@example.com",
            });
        });

        it("should return null when student not found", async () => {
            const mockStudentId = "non-existent";

            const query = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: null,
                    error: null,
                }),
            };

            (supabase.from as jest.Mock).mockReturnValue(query);

            const result = await studentService.getStudentById(mockStudentId);
            expect(result).toBeNull();
        });
    });

    describe("searchStudents", () => {
        it("should search students by name", async () => {
            const mockQuery = "john";
            const mockProfiles = [
                {
                    id: "student-1",
                    name: "John Doe",
                    email: "john@example.com",
                    learning_preferences: { grade: "10th", subject: "Math" },
                },
            ];

            const query = {
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                or: jest.fn().mockReturnThis(),
                order: jest.fn().mockResolvedValue({
                    data: mockProfiles,
                    error: null,
                }),
            };

            (supabase.from as jest.Mock).mockReturnValue(query);

            const result = await studentService.searchStudents(mockQuery);

            expect(result).toHaveLength(1);
            expect(result[0].full_name).toBe("John Doe");
        });
    });

    describe("createStudent", () => {
        it("should create a new student successfully", async () => {
            const mockUserId = "tutor-123";
            const mockStudentData = {
                full_name: "New Student",
                grade_level: "8th",
                subject: "English",
                email: "new@example.com",
            };

            (supabase.auth.getUser as jest.Mock).mockResolvedValue({
                data: { user: { id: mockUserId } },
                error: null,
            });

            const mockInsertedProfile = {
                id: "student-new",
                name: "New Student",
                email: "new@example.com",
                created_at: "2024-01-01",
                learning_preferences: {
                    grade: "8th",
                    subject: "English",
                },
            };

            const profilesQuery = {
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({
                    data: mockInsertedProfile,
                    error: null,
                }),
            };

            const tutorStudentsQuery = {
                insert: jest.fn().mockResolvedValue({
                    error: null,
                }),
            };

            (supabase.from as jest.Mock)
                .mockImplementationOnce(() => profilesQuery)
                .mockImplementationOnce(() => tutorStudentsQuery);

            const result = await studentService.createStudent(mockStudentData);

            expect(result).toMatchObject({
                id: "student-new",
                full_name: "New Student",
                grade_level: "8th",
                subject: "English",
                email: "new@example.com",
            });
        });

        it("should handle auth errors", async () => {
            (supabase.auth.getUser as jest.Mock).mockResolvedValue({
                data: null,
                error: new Error("Not authenticated"),
            });

            await expect(studentService.createStudent({ full_name: "Test" }))
                .rejects.toThrow("Not authenticated");
        });
    });
});
