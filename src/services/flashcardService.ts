import { supabase } from "@/integrations/supabase/client";
import { Database, Json } from "@/integrations/supabase/types";
import { generateFlashcards as aiGenerateFlashcards } from "@/services/aiService";
import { v4 as uuidv4 } from "uuid";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardSet {
  id?: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: string;
  student_id?: string;
  track_id?: string;
}

export interface GenerateFlashcardsParams {
  topic: string;
  count?: number;
  studentId?: string;
  trackId?: string;
  difficulty?: "easy" | "medium" | "hard";
  includeLatex?: boolean;
}

export interface ProcessDocumentParams {
  file?: File;
  text?: string;
  title: string;
  userId?: string;
  learningPreferences: {
    style: string;
    difficulty: string;
    interests: string[];
  };
}

export const generateFlashcards = async (
  params: GenerateFlashcardsParams,
): Promise<Flashcard[]> => {
  try {
    // Use the AI service for generating flashcards
    const result = await aiGenerateFlashcards(
      params.topic,
      params.count || 10,
      params.includeLatex ?? true,
    );

    // Handle different response formats
    let flashcards: Array<{ question: string; answer: string }> = [];

    if (Array.isArray(result)) {
      // Direct array response
      flashcards = result;
    } else if (result && typeof result === "object") {
      // Object response with flashcards property
      if ("flashcards" in result && Array.isArray(result.flashcards)) {
        flashcards = result.flashcards;
      } else if (result.success && result.data && Array.isArray(result.data)) {
        // Handle success/data format
        flashcards = result.data.map((
          item: {
            question?: string;
            answer?: string;
            front?: string;
            back?: string;
          },
        ) => ({
          question: item.question || item.front || "",
          answer: item.answer || item.back || "",
        }));
      }
    }

    // Convert to our Flashcard format with unique IDs
    return flashcards.map((card) => ({
      id: uuidv4(),
      front: card.question,
      back: card.answer,
    }));
  } catch (error) {
    console.error("Flashcard generation error:", error);
    throw error;
  }
};

// Process an uploaded document or text and generate personalized flashcards
export const processUploadedDocument = async (
  params: ProcessDocumentParams,
): Promise<Flashcard[]> => {
  try {
    let documentUrl: string | null = null;

    // Handle file upload if a file is provided
    if (params.file) {
      // Upload the file to Supabase Storage
      const fileExt = params.file.name.split(".").pop();
      const fileName = `${
        params.userId || "anonymous"
      }_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, params.file);

      if (uploadError) {
        console.error("Error uploading document:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get a public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(filePath);

      documentUrl = publicUrl;
    }

    // Generate flashcards directly using our AI service
    const flashcards = await generateFlashcards({
      topic: params.title,
      count: 10,
      studentId: params.userId,
      difficulty: params.learningPreferences.difficulty as
        | "easy"
        | "medium"
        | "hard",
    });

    // Persist the new set when not in mock mode
    if (flashcards && flashcards.length > 0) {
      await saveFlashcardSet({
        name: params.title,
        description: params.file
          ? `Generated from uploaded document: ${params.file.name}`
          : `Generated from text notes`,
        cards: flashcards,
        student_id: params.userId,
      });
    }

    return flashcards;
  } catch (error) {
    console.error("Content processing error:", error);
    throw error;
  }
};

// The TypeScript error occurs because the flashcards_sets table is not in the database types
// We'll use a type assertion to work around this until the types are regenerated
export const getFlashcardSets = async (
  studentId?: string,
): Promise<FlashcardSet[]> => {
  try {
    // Using type assertion to bypass TypeScript error
    let query = supabase
      .from("flashcards_sets")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter by student ID if provided
    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error in getFlashcardSets:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Transform the data to match our FlashcardSet interface
    const flashcardSets: FlashcardSet[] = (data || []).map((
      set: Record<string, unknown>,
    ) => ({
      id: typeof set.id === "string" ? set.id : undefined,
      name: typeof set.name === "string" ? set.name : "",
      description: typeof set.description === "string"
        ? set.description
        : undefined,
      cards: Array.isArray(set.cards)
        ? set.cards as unknown as Flashcard[]
        : [],
      createdAt: typeof set.created_at === "string" ? set.created_at : "",
      student_id: typeof set.student_id === "string"
        ? set.student_id
        : undefined,
      track_id: typeof set.track_id === "string" ? set.track_id : undefined,
    }));

    return flashcardSets;
  } catch (error) {
    console.error("Error fetching flashcard sets:", error);
    return [];
  }
};

export const getFlashcardSetById = async (
  id: string,
): Promise<FlashcardSet | null> => {
  try {
    // Using type assertion to bypass TypeScript error
    const { data, error } = await supabase
      .from("flashcards_sets")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error in getFlashcardSetById:", error);
      return null;
    }

    if (!data) return null;

    // Transform to match our FlashcardSet interface
    const flashcardSet: FlashcardSet = {
      id: typeof data.id === "string" ? data.id : undefined,
      name: typeof data.name === "string" ? data.name : "",
      description: typeof data.description === "string"
        ? data.description
        : undefined,
      cards: Array.isArray(data.cards)
        ? data.cards as unknown as Flashcard[]
        : [],
      createdAt: typeof data.created_at === "string" ? data.created_at : "",
      student_id: typeof data.student_id === "string"
        ? data.student_id
        : undefined,
      track_id: typeof data.track_id === "string" ? data.track_id : undefined,
    };

    return flashcardSet;
  } catch (error) {
    console.error("Error fetching flashcard set:", error);
    return null;
  }
};

// Add a function to save a flashcard set
export const saveFlashcardSet = async (
  flashcardSet: Omit<FlashcardSet, "id" | "createdAt">,
): Promise<FlashcardSet | null> => {
  try {
    const { data, error } = await supabase
      .from("flashcards_sets")
      .insert({
        name: flashcardSet.name,
        description: flashcardSet.description,
        cards: flashcardSet.cards as unknown as Json,
        student_id: flashcardSet.student_id,
        track_id: flashcardSet.track_id,
      })
      .select();

    if (error) {
      console.error("Error saving flashcard set:", error);
      return null;
    }

    if (!data || data.length === 0) return null;

    // Return the first created flashcard set
    return {
      id: typeof data[0].id === "string" ? data[0].id : undefined,
      name: typeof data[0].name === "string" ? data[0].name : "",
      description: typeof data[0].description === "string"
        ? data[0].description
        : undefined,
      cards: Array.isArray(data[0].cards)
        ? data[0].cards as unknown as Flashcard[]
        : [],
      createdAt: typeof data[0].created_at === "string"
        ? data[0].created_at
        : "",
      student_id: typeof data[0].student_id === "string"
        ? data[0].student_id
        : undefined,
      track_id: typeof data[0].track_id === "string"
        ? data[0].track_id
        : undefined,
    };
  } catch (error) {
    console.error("Error in saveFlashcardSet:", error);
    return null;
  }
};
