// Import Session from Supabase
import { Session } from "@supabase/supabase-js";
import { ActivityType } from "@/hooks/useGamification";

// Define user onboarding status types
export type OnboardingStatus =
  | "pending"
  | "consultation-scheduled"
  | "consultation-complete"
  | "onboarding-complete"
  | "active";

// Define user role type
export type UserRole = "student" | "teacher" | "parent";

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
  lastLoginDate?: string; // Adding this to support streak tracking
  achievements: Achievement[];
  badges: Badge[];
  interests: string[];
  learningStyle:
    | "visual"
    | "auditory"
    | "kinesthetic"
    | "reading/writing"
    | "mixed";
  favoriteSubjects: string[];
}

// Activity log details type
export interface ActivityDetails {
  source?: string;
  subjectId?: string;
  [key: string]: unknown;
}

// Activity log interface
export interface ActivityLog {
  type: ActivityType;
  timestamp: string;
  details?: ActivityDetails;
  xpEarned: number;
}

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  onboardingStatus: OnboardingStatus;
  nextConsultationDate?: string;
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
  trackActivity: (
    activityType: ActivityType,
    details?: ActivityDetails,
  ) => Promise<ActivityLog | null>;
  getActivitiesByType: (type: ActivityType) => ActivityLog[];
  getTodayActivities: () => ActivityLog[];
  signOut: () => Promise<void>;
}
