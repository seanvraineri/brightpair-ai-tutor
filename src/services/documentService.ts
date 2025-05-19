import { supabase } from "@/integrations/supabase/client";
import { extractPDFText, generateLessonFromContent } from "./aiService";
import { IS_DEVELOPMENT } from "@/config/env";
import { v4 as uuidv4 } from "uuid";
import { ReactNode } from "react";
import { Database } from "@/integrations/supabase/types";

// Interface for document upload parameters
export interface DocumentUploadParams {
  file?: File;
  text?: string;
  title: string;
  userId: string;
  topic: string;
  focus?: string;
  difficulty?: "easy" | "medium" | "hard";
  learningGoal?: string;
  learningPreferences?: {
    style?: string;
    interests?: string[];
  };
}

// Interface for the document in storage
export interface UserDocument {
  id: string;
  title: string;
  topic: string;
  contentType: "pdf" | "document" | "notes";
  createdAt: string;
  url: string;

  // Optional metadata
  description?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  subject?: string;
  fileName?: string;
  fileSize?: number;
}

/**
 * Extracts text from a PDF file
 */
export const extractTextFromPDF = async (
  fileUrl: string,
): Promise<string | null> => {
  try {
    console.log("Extracting text from PDF", fileUrl);
    // Call the AI service to extract text from the PDF
    const { text, success } = await extractPDFText(fileUrl);

    if (!success || !text) {
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
export const processDocumentForLesson = async (
  params: DocumentUploadParams,
): Promise<UserDocument | null> => {
  const {
    file,
    text,
    title,
    userId,
    topic,
    focus,
    difficulty,
    learningGoal,
    learningPreferences,
  } = params;

  try {
    let content = text || "";
    let documentUrl: string | null = null;
    let contentType: UserDocument["contentType"] = "notes";

    // Handle file upload if a file is provided
    if (file) {
      // Determine content type based on file extension
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      contentType = fileExt === "pdf" ? "pdf" : "document";

      // Generate a unique file name
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `documents/${userId}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        return null;
      }

      // Get public URL for the file
      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      documentUrl = publicUrl;

      // Extract text from PDF if applicable
      if (contentType === "pdf") {
        content = await extractTextFromPDF(publicUrl);
      }

      // Save document reference to database
      const mapDifficulty = (d?: string) => {
        if (!d) return "intermediate";
        if (d === "easy" || d === "beginner") return "beginner";
        if (d === "hard" || d === "advanced") return "advanced";
        return "intermediate"; // covers "medium" and any other
      };

      const docData: Database["public"]["Tables"]["user_documents"]["Insert"] =
        {
          title: title || file.name,
          description: focus || "",
          content,
          file_url: publicUrl,
          file_type: contentType,
          file_name: file.name,
          file_size: file.size,
          student_id: userId,
          difficulty: mapDifficulty(difficulty),
          subject: topic,
        };

      const { data: document, error: dbError } = await supabase
        .from("user_documents")
        .insert(docData)
        .select()
        .single();

      if (dbError) {
        console.error("Error saving document to database:", dbError);
        return null;
      }

      if (!document) return null;

      // Convert to UserDocument
      return {
        id: document.id,
        title: document.title,
        topic: document.subject || document.title,
        contentType: (document.file_type as UserDocument["contentType"]) ||
          "notes",
        createdAt: document.created_at || new Date().toISOString(),
        url: document.file_url || "",
        description: document.description || undefined,
        difficulty: ((): UserDocument["difficulty"] => {
          if (
            document.difficulty === "easy" || document.difficulty === "beginner"
          ) {
            return "beginner";
          }
          if (
            document.difficulty === "hard" || document.difficulty === "advanced"
          ) {
            return "advanced";
          }
          if (
            document.difficulty === "intermediate" ||
            document.difficulty === "medium"
          ) {
            return "intermediate";
          }
          return undefined;
        })(),
        subject: document.subject || undefined,
        fileName: document.file_name || undefined,
        fileSize: document.file_size || undefined,
      };
    }

    // Make sure we have some content to work with
    if (!content && !text) {
      throw new Error("No content provided for lesson generation");
    }

    // Generate a lesson from the content
    const result = await generateLessonFromContent(
      content || text || "",
      userId,
      {
        topic: topic,
        contentType: contentType,
        difficulty: (difficulty || "medium"),
      },
    );

    return {
      ...result.lesson,
      id: uuidv4(),
      description: focus || "",
      topic,
      contentType,
      fileName: title || "Untitled",
      fileSize: 0,
      createdAt: new Date().toISOString(),
      difficulty: ((): UserDocument["difficulty"] => {
        if (difficulty === "easy") return "beginner";
        if (difficulty === "hard") return "advanced";
        return "intermediate";
      })(),
      subject: topic,
      url: "", // no file URL for text-only lessons
    };
  } catch (error) {
    console.error("Document processing error:", error);
    return null;
  }
};

/**
 * Fetches documents uploaded by a user
 */
export const getUserDocuments = async (
  studentId: string,
): Promise<UserDocument[]> => {
  try {
    const { data, error } = await supabase
      .from("user_documents")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Convert to UserDocument
    return data.map<UserDocument>((doc) => ({
      id: doc.id,
      title: doc.title,
      topic: doc.subject || doc.title,
      contentType: (doc.file_type as UserDocument["contentType"]) || "notes",
      createdAt: doc.created_at || new Date().toISOString(),
      url: doc.file_url || "",
      description: doc.description || undefined,
      difficulty: ((): UserDocument["difficulty"] => {
        if (doc.difficulty === "easy" || doc.difficulty === "beginner") {
          return "beginner";
        }
        if (doc.difficulty === "hard" || doc.difficulty === "advanced") {
          return "advanced";
        }
        if (doc.difficulty === "intermediate" || doc.difficulty === "medium") {
          return "intermediate";
        }
        return undefined;
      })(),
      subject: doc.subject || undefined,
      fileName: doc.file_name || undefined,
      fileSize: doc.file_size || undefined,
    }));
  } catch (error) {
    console.error("Error in getUserDocuments:", error);
    return [];
  }
};
