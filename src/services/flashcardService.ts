
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

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
}

export const generateFlashcards = async (params: GenerateFlashcardsParams): Promise<Flashcard[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-flashcards', {
      body: params
    });

    if (error) {
      console.error('Error generating flashcards:', error);
      throw new Error(error.message);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate flashcards');
    }

    return data.flashcards;
  } catch (error) {
    console.error('Flashcard generation error:', error);
    throw error;
  }
};

// The TypeScript error occurs because the flashcards_sets table is not in the database types
// We'll use a type assertion to work around this until the types are regenerated
export const getFlashcardSets = async (): Promise<FlashcardSet[]> => {
  try {
    // Using type assertion to bypass TypeScript error
    const { data, error } = await (supabase
      .from('flashcards_sets' as any)
      .select('*')
      .order('created_at', { ascending: false }) as any);
      
    if (error) throw error;
    
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
    return [];
  }
};

export const getFlashcardSetById = async (id: string): Promise<FlashcardSet | null> => {
  try {
    // Using type assertion to bypass TypeScript error
    const { data, error } = await (supabase
      .from('flashcards_sets' as any)
      .select('*')
      .eq('id', id)
      .single() as any);
      
    if (error) throw error;
    
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
      .from('flashcards_sets' as any)
      .insert({
        name: flashcardSet.name,
        description: flashcardSet.description,
        cards: flashcardSet.cards,
        student_id: flashcardSet.student_id,
        track_id: flashcardSet.track_id
      })
      .select() as any);
      
    if (error) throw error;
    
    if (!data || data.length === 0) return null;
    
    // Transform to match our FlashcardSet interface
    const savedSet: FlashcardSet = {
      id: data[0].id,
      name: data[0].name,
      description: data[0].description,
      cards: data[0].cards || [],
      createdAt: data[0].created_at,
      student_id: data[0].student_id,
      track_id: data[0].track_id
    };
    
    return savedSet;
  } catch (error) {
    console.error('Error saving flashcard set:', error);
    return null;
  }
};
