import { supabase } from "@/integrations/supabase/client";
import { ENDPOINTS, FEATURES } from "@/config/env";
import {
  Homework,
  HomeworkGenerationParams,
  HomeworkListItem,
  HomeworkQuestion,
  HomeworkStatus,
} from "@/types/homework";

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
    let query = supabase
      .from("homework")
      .select(`id, title, due_at, status, student_id, subject`);

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
      return data.map((
        row: {
          id: string;
          title: string;
          due_at: string;
          status: string;
          student_id: string;
          subject?: string;
        },
      ) => ({
        id: row.id,
        title: row.title,
        due: row.due_at ?? "",
        student_id: row.student_id ?? "",
        student_name: "",
        status: (row.status ?? "draft") as HomeworkStatus,
        topic: undefined,
        subject: row.subject,
      }));
    }
  } catch (error) {
    
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
  } catch (error) {
    
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
      
      throw error;
    }

    if (data) {
      // Map the response into our Homework shape
      const hw: Homework = {
        id: data.id,
        title: data.title ?? "Homework Assignment",
        description: data.objective ?? "",
        content_md: data.content_md,
        due: data.due_at ?? params.due_date,
        created_at: data.created_at ?? new Date().toISOString(),
        updated_at: data.updated_at ?? new Date().toISOString(),
        tutor_id: data.tutor_id ?? params.tutor_id,
        student_id: data.student_id ?? params.student_id,
        status: "draft",
        topic: params.topic,
        questions: [],
      };

      return hw;
    }
  } catch (error) {
    
    return null;
  }
};

/**
 * Save a homework assignment (create or update)
 */
export const saveHomework = async (homework: Homework): Promise<boolean> => {
  try {
    const { error } = await supabase.from("homework").upsert({
      // Allow Postgres to generate ID if not provided
      ...(homework.id ? { id: homework.id } : {}),
      title: homework.title,
      content_md: homework.description,
      subject: homework.topic ?? "General", // new NOT NULL column
      due_at: homework.due,
      tutor_id: homework.tutor_id,
      student_id: homework.student_id,
      status: homework.status,
      type: "homework", // satisfies new type column
    });
    if (error) throw error;
    return true;
  } catch (error) {
    
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
    const { error } = await supabase
      .from("homework")
      .update({ status })
      .eq("id", homeworkId);
    if (error) throw error;
    return true;
  } catch (error) {
    
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
    return [];
  } catch (error) {
    
    return [];
  }
};
