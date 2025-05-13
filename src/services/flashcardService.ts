// @ts-nocheck

import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { generateFlashcards as aiGenerateFlashcards } from "@/services/aiService";
import { IS_DEVELOPMENT } from "@/config/env";
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
  difficulty?: 'easy' | 'medium' | 'hard';
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

// Mock flashcards for development/fallback
const mockFlashcards: Flashcard[] = [
  { 
    id: 'mock-1', 
    front: 'What is the derivative of $f(x) = x^2$?', 
    back: '$f\'(x) = 2x$' 
  },
  { 
    id: 'mock-2', 
    front: 'What is the integral of $f(x) = 2x$?', 
    back: '$F(x) = x^2 + C$' 
  },
  { 
    id: 'mock-3', 
    front: 'What is the chain rule?', 
    back: 'If $f(x) = g(h(x))$, then $f\'(x) = g\'(h(x)) \\cdot h\'(x)$' 
  }
];

export const generateFlashcards = async (params: GenerateFlashcardsParams): Promise<Flashcard[]> => {
  try {
    // Use the AI service for generating flashcards
    const result = await aiGenerateFlashcards(
      params.topic, 
      params.count || 10, 
      params.includeLatex ?? true
    );
    
    // Handle different response formats
    let flashcards: Array<{question: string, answer: string}> = [];
    
    if (Array.isArray(result)) {
      // Direct array response
      flashcards = result;
    } else if (result && typeof result === 'object') {
      // Object response with flashcards property
      if ('flashcards' in result && Array.isArray(result.flashcards)) {
        flashcards = result.flashcards;
      } else if (result.success && result.data && Array.isArray(result.data)) {
        // Handle success/data format
        flashcards = result.data.map((item: any) => ({
          question: item.question || item.front || '',
          answer: item.answer || item.back || ''
        }));
      }
    }
    
    // Convert to our Flashcard format with unique IDs
    return flashcards.map((card) => ({
      id: uuidv4(),
      front: card.question,
      back: card.answer
    }));
  } catch (error) {
    console.error('Flashcard generation error:', error);
    
    // Return mock data in development if there's an error
    if (IS_DEVELOPMENT) {
      return mockFlashcards;
    }
    
    throw error;
  }
};

// Process an uploaded document or text and generate personalized flashcards
export const processUploadedDocument = async (params: ProcessDocumentParams): Promise<Flashcard[]> => {
  try {
    let documentUrl: string | null = null;
    
    // Handle file upload if a file is provided
    if (params.file) {
      // Upload the file to Supabase Storage
      const fileExt = params.file.name.split('.').pop();
      const fileName = `${params.userId || 'anonymous'}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, params.file);
        
      if (uploadError) {
        console.error('Error uploading document:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      // Get a public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
      
      documentUrl = publicUrl;
    }
    
    // Generate flashcards directly using our AI service
    const flashcards = await generateFlashcards({
      topic: params.title,
      count: 10,
      studentId: params.userId,
      difficulty: params.learningPreferences.difficulty as 'easy' | 'medium' | 'hard'
    });
    
    // Save the generated flashcards as a set
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
    console.error('Content processing error:', error);
    // Return mock data in development
    if (IS_DEVELOPMENT) {
      return mockFlashcards;
    }
    throw error;
  }
};

// The TypeScript error occurs because the flashcards_sets table is not in the database types
// We'll use a type assertion to work around this until the types are regenerated
export const getFlashcardSets = async (studentId?: string): Promise<FlashcardSet[]> => {
  try {
    // Using type assertion to bypass TypeScript error
    let query = (supabase
      .from('flashcards_sets') as any)
      .select('*')
      .order('created_at', { ascending: false });
      
    // Filter by student ID if provided
    if (studentId) {
      query = query.eq('student_id', studentId);
    }
    
    const { data, error } = await query;
      
    if (error) {
      console.error('Error in getFlashcardSets:', error);
      if (IS_DEVELOPMENT) {
        return getMockFlashcardSets(studentId);
      }
      return [];
    }
    
    // In development, return mock data if no flashcard sets are found
    if ((!data || data.length === 0) && IS_DEVELOPMENT) {
      return getMockFlashcardSets(studentId);
    }
    
    // Transform the data to match our FlashcardSet interface
    const flashcardSets: FlashcardSet[] = (data || []).map((set: any) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      cards: set.cards || [],
      createdAt: set.created_at,
      student_id: set.student_id,
      track_id: set.track_id
    }));
    
    return flashcardSets;
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return IS_DEVELOPMENT ? getMockFlashcardSets(studentId) : [];
  }
};

// Helper function to get mock flashcard sets
function getMockFlashcardSets(studentId?: string): FlashcardSet[] {
  return [
    {
      id: 'mock-set-1',
      name: 'Calculus Fundamentals',
      description: 'Basic calculus concepts and formulas',
      cards: mockFlashcards,
      createdAt: new Date().toISOString(),
      student_id: studentId || 'anonymous'
    }
  ];
}

export const getFlashcardSetById = async (id: string): Promise<FlashcardSet | null> => {
  try {
    // Using type assertion to bypass TypeScript error
    const { data, error } = await (supabase
      .from('flashcards_sets') as any)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error in getFlashcardSetById:', error);
      return null;
    }
    
    if (!data) return null;
    
    // Transform to match our FlashcardSet interface
    const flashcardSet: FlashcardSet = {
      id: data.id,
      name: data.name,
      description: data.description,
      cards: data.cards || [],
      createdAt: data.created_at,
      student_id: data.student_id,
      track_id: data.track_id
    };
    
    return flashcardSet;
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    return null;
  }
};

// Add a function to save a flashcard set
export const saveFlashcardSet = async (flashcardSet: Omit<FlashcardSet, 'id' | 'createdAt'>): Promise<FlashcardSet | null> => {
  try {
    const { data, error } = await (supabase
      .from('flashcards_sets') as any)
      .insert({
        name: flashcardSet.name,
        description: flashcardSet.description,
        cards: flashcardSet.cards,
        student_id: flashcardSet.student_id,
        track_id: flashcardSet.track_id
      })
      .select();
      
    if (error) {
      console.error('Error saving flashcard set:', error);
      return null;
    }
    
    if (!data || data.length === 0) return null;
    
    // Return the first created flashcard set
    return {
      id: data[0].id,
      name: data[0].name,
      description: data[0].description,
      cards: data[0].cards || [],
      createdAt: data[0].created_at,
      student_id: data[0].student_id,
      track_id: data[0].track_id
    };
  } catch (error) {
    console.error('Error in saveFlashcardSet:', error);
    return null;
  }
};
