
import { supabase } from "@/integrations/supabase/client";

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

export const getFlashcardSets = async (): Promise<FlashcardSet[]> => {
  try {
    const { data, error } = await supabase
      .from('flashcards_sets')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return [];
  }
};

export const getFlashcardSetById = async (id: string): Promise<FlashcardSet | null> => {
  try {
    const { data, error } = await supabase
      .from('flashcards_sets')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    return null;
  }
};
