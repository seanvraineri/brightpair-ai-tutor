import { supabase } from "@/integrations/supabase/client";

// Interface for user documents
export interface UserDocument {
  id: string;
  title: string;
  content: string;
  created_at: string;
  student_id: string;
}

// Mock data for development
const mockDocuments: UserDocument[] = [
  {
    id: "doc-1",
    title: "Mathematics Assignment 1",
    content: "Sample content for mathematics assignment",
    created_at: new Date().toISOString(),
    student_id: "student-1"
  },
  {
    id: "doc-2",
    title: "Science Quiz",
    content: "Sample content for science quiz",
    created_at: new Date().toISOString(),
    student_id: "student-1"
  }
];

/**
 * Fetches documents for a specific student
 * Uses mock data to prevent 404 errors in development
 */
export const getStudentDocuments = async (studentId: string): Promise<UserDocument[]> => {
  try {
    console.log(`Fetching documents for student ${studentId}`);
    
    // In a real app, this would fetch from the database
    // For now, return mock data to prevent 404 errors
    return mockDocuments.filter(doc => doc.student_id === studentId);
    
    // Real implementation would be something like:
    // const { data, error } = await supabase
    //   .from('user_documents')
    //   .select('*')
    //   .eq('student_id', studentId);
    //
    // if (error) {
    //   console.error("Error fetching student documents:", error);
    //   return [];
    // }
    //
    // return data || [];
  } catch (error) {
    console.error("Error fetching student documents:", error);
    return [];
  }
};

/**
 * Gets a single document by ID
 */
export const getDocumentById = async (documentId: string): Promise<UserDocument | null> => {
  try {
    // Return mock data for now
    const document = mockDocuments.find(doc => doc.id === documentId);
    return document || null;
    
    // Real implementation would be:
    // const { data, error } = await supabase
    //   .from('user_documents')
    //   .select('*')
    //   .eq('id', documentId)
    //   .single();
    //
    // if (error) {
    //   console.error("Error fetching document:", error);
    //   return null;
    // }
    //
    // return data;
  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}; 