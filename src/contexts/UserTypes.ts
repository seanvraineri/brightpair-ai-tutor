
// Import Session from Supabase
import { Session } from '@supabase/supabase-js';

// Define user onboarding status types
export type OnboardingStatus = 'pending' | 'consultation-scheduled' | 'consultation-complete' | 'onboarding-complete' | 'active';

// Define user role type
export type UserRole = 'student' | 'teacher' | 'parent';

// Define gamification elements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number; // 1, 2, 3 for bronze, silver, gold
  isUnlocked: boolean;
}

export interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  achievements: Achievement[];
  badges: Badge[];
  interests: string[];
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing' | 'mixed';
  favoriteSubjects: string[];
}

// Define user interface
export interface User {
  name?: string;
  email?: string;
  onboardingStatus: OnboardingStatus;
  nextConsultationDate?: string;
  role: UserRole;
  gamification?: GamificationData;
}

// Context interface
export interface UserContextType {
  user: User | null;
  session: Session | null;
  updateUser: (data: Partial<User>) => void;
  updateOnboardingStatus: (status: OnboardingStatus) => void;
  setConsultationDate: (date: string) => void;
  updateRole: (role: UserRole) => void;
  unlockAchievement: (achievementId: string) => void;
  earnXP: (amount: number) => void;
  signOut: () => Promise<void>;
}
