import { supabase } from "@/integrations/supabase/client";
import { generateLessonFromContent, extractPDFText } from "./aiService";
import { IS_DEVELOPMENT } from "@/config/env";
import { v4 as uuidv4 } from "uuid";

// Interface for document upload parameters
export interface DocumentUploadParams {
  file?: File;
  text?: string;
  title: string;
  userId: string;
  topic: string;
  focus?: string;
  difficulty?: string;
  learningGoal?: string;
  learningPreferences?: {
    style?: string;
    interests?: string[];
  };
}

// Interface for the document in storage
export interface UserDocument {
  topic: ReactNode;
  contentType(contentType: any): import("react").ReactNode;
  createdAt(createdAt: any): import("react").ReactNode;
  url(url: any): void;
  id: string;
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  file_type: string;
  file_name: string;
  file_size: number;
  created_at: string;
  student_id: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  subject?: string;
}

// Interface for document database record
interface UserDocumentRecord {
  id: string;
  title: string;
  description?: string;
  content?: string;
  file_url?: string;
  file_type: string;
  file_name: string;
  file_size: number;
  created_at: string;
  student_id: string;
  difficulty?: string;
  subject?: string;
}

// Mock data for fallback
const mockDocuments: UserDocument[] = [
  {
    id: "doc-1",
    title: "Calculus Notes",
    description: "My notes from Calculus I",
    file_type: "pdf",
    file_name: "calculus_notes.pdf",
    file_size: 1024000,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    student_id: "user-1",
    difficulty: "intermediate",
    subject: "Mathematics"
  },
  {
    id: "doc-2",
    title: "Physics Lab Report",
    description: "Lab report on Newton's Laws",
    file_type: "pdf",
    file_name: "physics_lab.pdf",
    file_size: 2048000,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    student_id: "user-1",
    difficulty: "advanced",
    subject: "Physics"
  }
];

/**
 * Extracts text from a PDF file
 */
export const extractTextFromPDF = async (fileUrl: string): Promise<string | null> => {
  try {
    console.log("Extracting text from PDF", fileUrl);
    // Call the AI service to extract text from the PDF
    const text = await extractPDFText(fileUrl);
    
    if (!text) {
      console.error("Failed to extract text from PDF");
      return null;
    }
    
    return text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return null;
  }
};

/**
 * Processes a document for lesson generation
 * Uploads to Supabase storage, extracts text from PDFs, and saves to the database
 */
export const processDocumentForLesson = async (params: DocumentUploadParams): Promise<UserDocument | null> => {
  const { file, text, title, userId, topic, focus, difficulty, learningGoal, learningPreferences } = params;
  
  try {
    let content = text || "";
    let documentUrl: string | null = null;
    let contentType = "notes";
    
    // Handle file upload if a file is provided
    if (file) {
      // Determine content type based on file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      contentType = fileExt === 'pdf' ? 'pdf' : 'document';
      
      // Generate a unique file name
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `documents/${userId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        return null;
      }
      
      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      documentUrl = publicUrl;
      
      // Extract text from PDF if applicable
      if (contentType === 'pdf') {
        content = await extractTextFromPDF(publicUrl);
      }
      
      // Save document reference to database
      const docData = {
        title: title || file.name,
        description: focus || '',
        content,
        file_url: publicUrl,
        file_type: contentType,
        file_name: file.name,
        file_size: file.size,
        student_id: userId,
        difficulty: difficulty || "medium",
        subject: topic,
      };
      
      const { data: document, error: dbError } = await supabase
        .from('user_documents')
        .insert(docData)
        .select()
        .single();
      
      if (dbError) {
        console.error("Error saving document to database:", dbError);
        return null;
      }
      
      return document as UserDocument;
    }
    
    // Make sure we have some content to work with
    if (!content && !text) {
      throw new Error('No content provided for lesson generation');
    }
    
    // Generate a lesson from the content
    const result = await generateLessonFromContent(
      content || text || "", 
      userId,
      {
        topic: topic,
        contentType: contentType,
        difficulty: (difficulty || "medium") as "easy" | "medium" | "hard"
      }
    );
    
    return {
      ...result.lesson,
      id: uuidv4(),
      description: focus || '',
      file_type: contentType,
      file_name: title || 'Untitled',
      file_size: 0,
      created_at: new Date().toISOString(),
      student_id: userId,
      difficulty: difficulty || "medium",
      subject: topic,
    };
  } catch (error) {
    console.error('Document processing error:', error);
    return null;
  }
};

/**
 * Fetches documents uploaded by a user
 */
export const getUserDocuments = async (studentId: string): Promise<UserDocument[]> => {
  try {
    const { data, error } = await supabase
      .from('user_documents')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }) as { data: UserDocumentRecord[] | null, error: any };
    
    if (error) {
      console.error("Error fetching user documents:", error);
      return IS_DEVELOPMENT ? mockDocuments : [];
    }
    
    if (!data || data.length === 0) {
      return IS_DEVELOPMENT ? mockDocuments : [];
    }
    
    // Convert UserDocumentRecord to UserDocument with correct type handling
    return data.map(doc => ({
      ...doc,
      difficulty: doc.difficulty as "beginner" | "intermediate" | "advanced" | undefined,
    }));
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    return IS_DEVELOPMENT ? mockDocuments : [];
  }
}; 