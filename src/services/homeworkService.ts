import { supabase } from "@/integrations/supabase/client";
import { ENDPOINTS, FEATURES } from "@/config/env";
import {
  Homework,
  HomeworkGenerationParams,
  HomeworkListItem,
  HomeworkQuestion,
  HomeworkStatus,
} from "@/types/homework";

// Mock data for initial development
const MOCK_STUDENTS = [
  { id: "student-1", name: "Alex Smith" },
  { id: "student-2", name: "Emma Johnson" },
  { id: "student-3", name: "Michael Chen" },
  { id: "student-4", name: "Jordan Lee" },
];

const MOCK_HOMEWORKS: HomeworkListItem[] = [
  {
    id: "hw1",
    title: "Quadratic Equation Drill – Visual Style",
    due: "2023-06-18",
    student_id: "student-1",
    student_name: "Alex Smith",
    status: "assigned",
    subject: "Mathematics",
    topic: "Quadratic Equations",
  },
  {
    id: "hw2",
    title: "Cell Biology Fundamentals",
    due: "2023-06-20",
    student_id: "student-1",
    student_name: "Alex Smith",
    status: "draft",
    subject: "Science",
    topic: "Cell Structure",
  },
  {
    id: "hw3",
    title: "Literary Analysis Techniques",
    due: "2023-06-15",
    student_id: "student-2",
    student_name: "Emma Johnson",
    status: "submitted",
    subject: "English",
    score: 85,
    total_possible: 100,
    topic: "Literature Analysis",
  },
  {
    id: "hw4",
    title: "Algorithm Complexity and Efficiency",
    due: "2023-06-22",
    student_id: "student-3",
    student_name: "Michael Chen",
    status: "graded",
    subject: "Computer Science",
    score: 92,
    total_possible: 100,
    topic: "Algorithm Design",
  },
  {
    id: "hw5",
    title: "Newton's Laws of Motion",
    due: "2023-06-19",
    student_id: "student-4",
    student_name: "Jordan Lee",
    status: "assigned",
    subject: "Physics",
    topic: "Classical Mechanics",
  },
];

const MOCK_HOMEWORK_DETAIL: Record<string, Homework> = {
  "hw1": {
    id: "hw1",
    title: "Quadratic Equation Drill – Visual Style",
    description: "Focus on factoring and the discriminant.",
    due: "2023-06-18",
    created_at: "2023-06-10T12:00:00Z",
    updated_at: "2023-06-10T12:00:00Z",
    tutor_id: "tutor-1",
    student_id: "student-1",
    status: "assigned",
    topic: "Quadratic Equations",
    questions: [
      {
        id: "q1",
        type: "mcq",
        stem: "Which expression factors to (x-3)(x+2)?",
        choices: ["x²–5x+6", "x²–x–6", "x²–x+6", "x²+5x+6"],
        answer: "B",
      },
      {
        id: "q2",
        type: "short",
        stem: "For x²+6x+5=0, what is the discriminant?",
        answer: "16",
      },
      {
        id: "q3",
        type: "diagram",
        stem: "Draw a quick parabola showing roots at –5 and 1.",
      },
      {
        id: "q4",
        type: "pdf_ref",
        source_page: 2,
        stem: "Complete #7 on the attached worksheet.",
      },
    ],
  },
};

/**
 * Get a list of homeworks with filtering options
 */
export const getHomeworkList = async (
  filters?: {
    status?: HomeworkStatus | "pending" | "all";
    student_id?: string;
    subject?: string;
    search?: string;
  },
): Promise<HomeworkListItem[]> => {
  try {
    // Prefer live data when not in mock mode
    if (!FEATURES.USE_MOCK_DATA) {
      let query = supabase
        .from("homework")
        .select(`
          id,
          title,
          due_at,
          status,
          student_id,
          content_md,
          profiles:student_id(name)
        `);

      // Apply filters
      if (filters?.student_id) {
        query = query.eq("student_id", filters.student_id);
      }
      if (filters?.status && filters.status !== "all") {
        if (filters.status === "pending") {
          // map "pending" to draft + submitted equivalents
          query = query.in("status", ["draft", "submitted", "assigned"]);
        } else {
          query = query.eq("status", filters.status);
        }
      }
      // subject filter omitted – column not present yet

      const { data, error } = await query;
      if (error) throw error;

      if (data) {
        return data.map((row: any) => ({
          id: row.id,
          title: row.title,
          due: row.due_at ?? "",
          student_id: row.student_id ?? "",
          student_name: row.profiles?.name ?? "Unknown",
          status: (row.status ?? "draft") as HomeworkStatus,
          topic: undefined,
        }));
      }
    }

    // ---------- FALLBACK TO MOCK ----------
    let filtered = [...MOCK_HOMEWORKS];
    if (filters) {
      if (filters.status && filters.status !== "all") {
        if (filters.status === "pending") {
          filtered = filtered.filter((hw) =>
            hw.status === "assigned" || hw.status === "submitted"
          );
        } else {
          filtered = filtered.filter((hw) => hw.status === filters.status);
        }
      }
      if (filters.student_id) {
        filtered = filtered.filter((hw) =>
          hw.student_id === filters.student_id
        );
      }
      if (filters.subject) {
        filtered = filtered.filter((hw) => hw.subject === filters.subject);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter((hw) =>
          hw.title.toLowerCase().includes(searchLower) ||
          hw.student_name.toLowerCase().includes(searchLower) ||
          (hw.topic && hw.topic.toLowerCase().includes(searchLower))
        );
      }
    }
    return filtered;
  } catch (error) {
    console.error("Error fetching homework list:", error);
    return [];
  }
};

/**
 * Get details of a specific homework
 */
export const getHomework = async (
  homeworkId: string,
): Promise<Homework | null> => {
  try {
    if (!FEATURES.USE_MOCK_DATA) {
      const { data, error } = await supabase
        .from("homework")
        .select(`*, profiles:student_id(name)`)
        .eq("id", homeworkId)
        .single();
      if (error) throw error;
      if (data) {
        const hw: Homework = {
          id: data.id,
          title: data.title,
          description: data.content_md ?? "",
          due: data.due_at ?? "",
          created_at: data.created_at ?? "",
          updated_at: new Date().toISOString(),
          tutor_id: data.tutor_id ?? "",
          student_id: data.student_id ?? "",
          status: (data.status ?? "draft") as HomeworkStatus,
          topic: undefined,
          questions: [],
        };
        return hw;
      }
    }
    // fallback
    return MOCK_HOMEWORK_DETAIL[homeworkId] || null;
  } catch (error) {
    console.error("Error fetching homework details:", error);
    return null;
  }
};

/**
 * Generate a new homework assignment
 */
export const generateHomework = async (
  params: HomeworkGenerationParams,
): Promise<Homework | null> => {
  try {
    // Prefer live data when we are not in mock mode
    if (!FEATURES.USE_MOCK_DATA) {
      const { data, error } = await supabase.functions.invoke(
        ENDPOINTS.SUPABASE_FUNCTIONS.GENERATE_HOMEWORK,
        {
          body: {
            studentId: params.student_id,
            tutorId: params.tutor_id,
            objective: params.topic || "Homework Assignment",
            dueAt: params.due_date,
            numQuestions: params.num_questions ?? 5,
            difficulty: params.difficulty ?? "medium",
            learningStyleOverride: params.learning_style,
            // If a PDF was provided and we have real data, include extracted text (optional)
            // pdfText: params.pdf_text,
          },
        },
      );

      if (error) {
        console.error("Edge function error while generating homework:", error);
        throw error;
      }

      if (data) {
        // Map the response into our Homework shape
        const hw: Homework = {
          id: (data as any).id,
          title: (data as any).title ?? "Homework Assignment",
          description: (data as any).objective ?? "",
          content_md: (data as any).content_md,
          due: (data as any).due_at ?? params.due_date,
          created_at: (data as any).created_at ?? new Date().toISOString(),
          updated_at: (data as any).updated_at ?? new Date().toISOString(),
          tutor_id: (data as any).tutor_id ?? params.tutor_id,
          student_id: (data as any).student_id ?? params.student_id,
          status: "draft",
          topic: params.topic,
          questions: [],
        };

        return hw;
      }
    }

    // For development, return a mock response
    const student = MOCK_STUDENTS.find((s) => s.id === params.student_id);
    if (!student) return null;

    const mockHomework: Homework = {
      id: `hw-${Date.now()}`,
      title: params.topic
        ? `${params.topic} Practice`
        : "Quadratic Equation Drill – Visual Style",
      description: params.notes || "Focus on factoring and the discriminant.",
      due: params.due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tutor_id: params.tutor_id,
      student_id: params.student_id,
      pdf_path: params.pdf_path,
      status: "draft",
      topic: params.topic,
      questions: [
        {
          id: "q1",
          type: "mcq",
          stem: "Which expression factors to (x-3)(x+2)?",
          choices: ["x²–5x+6", "x²–x–6", "x²–x+6", "x²+5x+6"],
          answer: "B",
        },
        {
          id: "q2",
          type: "short",
          stem: "For x²+6x+5=0, what is the discriminant?",
          answer: "16",
        },
        {
          id: "q3",
          type: "diagram",
          stem: "Draw a quick parabola showing roots at –5 and 1.",
        },
      ],
    };

    // If there was a PDF uploaded, add a PDF reference question
    if (params.pdf_path) {
      mockHomework.questions.push({
        id: "q4",
        type: "pdf_ref",
        source_page: 1,
        stem: "Complete problem #7 on the attached worksheet.",
      });
    }

    return mockHomework;
  } catch (error) {
    console.error("Error generating homework:", error);
    return null;
  }
};

/**
 * Save a homework assignment (create or update)
 */
export const saveHomework = async (homework: Homework): Promise<boolean> => {
  try {
    if (!FEATURES.USE_MOCK_DATA) {
      const { error } = await supabase.from("homework").upsert({
        id: homework.id,
        title: homework.title,
        content_md: homework.description,
        due_at: homework.due,
        tutor_id: homework.tutor_id,
        student_id: homework.student_id,
        status: homework.status,
      });
      if (error) throw error;
      return true;
    }
    console.log("Saved homework (mock):", homework);
    return true;
  } catch (error) {
    console.error("Error saving homework:", error);
    return false;
  }
};

/**
 * Update the status of a homework
 */
export const updateHomeworkStatus = async (
  homeworkId: string,
  status: HomeworkStatus,
): Promise<boolean> => {
  try {
    if (!FEATURES.USE_MOCK_DATA) {
      const { error } = await supabase
        .from("homework")
        .update({ status })
        .eq("id", homeworkId);
      if (error) throw error;
      return true;
    }
    console.log(`Updated homework ${homeworkId} status to ${status} (mock)`);
    return true;
  } catch (error) {
    console.error("Error updating homework status:", error);
    return false;
  }
};

/**
 * Grade a homework submission with student answers
 */
export const gradeHomework = async (
  homeworkId: string,
  answers: Record<string, string | string[]>,
): Promise<{
  score: number;
  total: number;
  feedback: Record<string, string>;
}> => {
  try {
    // In a real implementation, this would call a Supabase RPC
    // const { data, error } = await supabase.rpc('grade_homework', {
    //   p_homework_id: homeworkId,
    //   p_answers: answers
    // });

    // For development, simulate auto-grading for MCQ and short answer questions
    const homework = await getHomework(homeworkId);
    if (!homework) throw new Error("Homework not found");

    let score = 0;
    let total = 0;
    const feedback: Record<string, string> = {};

    homework.questions.forEach((q) => {
      if ((q.type === "mcq" || q.type === "short") && q.answer) {
        total++;
        const studentAnswer = answers[q.id]?.toString() || "";

        if (q.type === "mcq") {
          // For MCQ, check if the answer matches exactly
          if (studentAnswer.toUpperCase() === q.answer.toUpperCase()) {
            score++;
            feedback[q.id] = "Correct!";
          } else {
            feedback[q.id] = `Incorrect. The correct answer is ${q.answer}.`;
          }
        } else if (q.type === "short") {
          // For short answer, check if answer matches exactly (case-insensitive)
          if (studentAnswer.toLowerCase() === q.answer.toLowerCase()) {
            score++;
            feedback[q.id] = "Correct!";
          } else {
            feedback[q.id] = `Incorrect. The expected answer is ${q.answer}.`;
          }
        }
      } else if (q.type === "diagram" || q.type === "pdf_ref") {
        // These types need manual grading
        total++;
        feedback[q.id] = "Awaiting tutor review.";
      }
    });

    // In a real implementation, update the homework with scores

    return { score, total, feedback };
  } catch (error) {
    console.error("Error grading homework:", error);
    return { score: 0, total: 0, feedback: {} };
  }
};

/**
 * Upload a PDF file for homework
 */
export const uploadPdf = async (file: File): Promise<string | null> => {
  try {
    // In a real implementation, this would upload to Supabase Storage
    // const fileName = `${Date.now()}_${file.name}`;
    // const filePath = `homework-files/${fileName}`;
    // const { data, error } = await supabase.storage
    //   .from('homework-files')
    //   .upload(filePath, file);

    // if (error) throw error;
    // const { data: urlData } = supabase.storage.from('homework-files').getPublicUrl(filePath);
    // return urlData.publicUrl;

    // Return a local URL that points to our sample PDF
    return `/homework-files/sample.pdf`;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return null;
  }
};

/**
 * Extract text from a PDF for AI processing
 */
export const extractPdfText = async (file: File): Promise<string | null> => {
  try {
    // In a real implementation, this would use the pdf.js library
    // const pdfjs = await import('pdfjs-dist/build/pdf');
    // const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    // pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    // const arrayBuffer = await file.arrayBuffer();
    // const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    // const firstPage = await pdf.getPage(1);
    // const textContent = await firstPage.getTextContent();
    // const text = textContent.items.map((item: any) => item.str).join(' ');

    // // Limit to first 3000 characters as specified
    // return text.substring(0, 3000);

    // For development, return mock text
    return "This is a sample PDF text extracted for homework generation. It contains math problems related to quadratic equations and factoring.";
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return null;
  }
};

/**
 * Get a list of students for a tutor
 */
export const getStudents = async (): Promise<
  Array<{ id: string; name: string }>
> => {
  try {
    // In a real implementation, this would fetch from Supabase
    // const { data, error } = await supabase
    //   .from('profiles')
    //   .select('id, name')
    //   .eq('role', 'student')
    //   .eq('tutor_id', tutorId);

    // For development, return mock students
    return MOCK_STUDENTS;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};
