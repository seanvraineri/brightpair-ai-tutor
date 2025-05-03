import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
interface User {
  name?: string;
  email?: string;
  onboardingStatus: OnboardingStatus;
  nextConsultationDate?: string;
  role: UserRole;
  gamification?: GamificationData;
}

// Context interface
interface UserContextType {
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

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  session: null,
  updateUser: () => {},
  updateOnboardingStatus: () => {},
  setConsultationDate: () => {},
  updateRole: () => {},
  unlockAchievement: () => {},
  earnXP: () => {},
  signOut: async () => {},
});

// Hook for using the context
export const useUser = () => useContext(UserContext);

// Sample gamification data based on interests and learning style
const getPersonalizedAchievements = (interests: string[], learningStyle: string): Achievement[] => {
  const baseAchievements: Achievement[] = [
    {
      id: 'first-login',
      title: 'First Day',
      description: 'Completed your first login',
      icon: 'award',
      isUnlocked: true,
      unlockedAt: new Date().toISOString(),
    },
    {
      id: 'streak-7',
      title: 'Weekly Warrior',
      description: 'Maintained a 7-day study streak',
      icon: 'trophy',
      isUnlocked: false,
    }
  ];
  
  // Add personalized achievements based on interests
  if (interests.includes('math')) {
    baseAchievements.push({
      id: 'math-master',
      title: 'Math Master',
      description: 'Completed 10 math exercises with high scores',
      icon: 'badge-check',
      isUnlocked: false,
    });
  }
  
  if (interests.includes('science')) {
    baseAchievements.push({
      id: 'science-explorer',
      title: 'Science Explorer',
      description: 'Completed 5 science experiments',
      icon: 'badge-info',
      isUnlocked: false,
    });
  }
  
  if (interests.includes('reading')) {
    baseAchievements.push({
      id: 'bookworm',
      title: 'Bookworm',
      description: 'Read 5 books and completed their summaries',
      icon: 'badge-help',
      isUnlocked: false,
    });
  }
  
  // Add achievements based on learning style
  if (learningStyle === 'visual') {
    baseAchievements.push({
      id: 'visual-learner',
      title: 'Visual Virtuoso',
      description: 'Completed 10 visual learning activities',
      icon: 'badge',
      isUnlocked: false,
    });
  } else if (learningStyle === 'auditory') {
    baseAchievements.push({
      id: 'auditory-ace',
      title: 'Auditory Ace',
      description: 'Completed 10 listening exercises',
      icon: 'badge',
      isUnlocked: false,
    });
  }
  
  return baseAchievements;
};

// Provider component
export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        
        if (session?.user) {
          // When session changes, fetch user profile
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session on load
    const initializeUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    };

    initializeUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setUser({
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          onboardingStatus: data.onboarding_status as OnboardingStatus,
          nextConsultationDate: data.next_consultation_date,
          gamification: {
            level: 3,
            xp: 750,
            xpToNextLevel: 1000,
            streak: 7,
            interests: ['math', 'science', 'art'],
            learningStyle: 'visual',
            favoriteSubjects: ['Algebra', 'Biology'],
            achievements: getPersonalizedAchievements(['math', 'science', 'art'], 'visual'),
            badges: [
              {
                id: 'math-1',
                name: 'Math Enthusiast',
                description: 'Completed your first math assignment',
                icon: 'badge-plus',
                level: 1,
                isUnlocked: true
              },
              {
                id: 'streak-3',
                name: 'Consistency',
                description: 'Maintained a 3-day study streak',
                icon: 'trophy',
                level: 2,
                isUnlocked: true
              }
            ]
          }
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    
    // If there's a session, update the profile in Supabase
    if (session?.user) {
      try {
        const updateData: any = {};
        
        if (data.name) updateData.name = data.name;
        if (data.email) updateData.email = data.email;
        if (data.role) updateData.role = data.role;
        if (data.onboardingStatus) updateData.onboarding_status = data.onboardingStatus;
        if (data.nextConsultationDate) updateData.next_consultation_date = data.nextConsultationDate;
        
        if (Object.keys(updateData).length > 0) {
          const { error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', session.user.id);
            
          if (error) throw error;
        }
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    }
  };
  
  const updateOnboardingStatus = async (status: OnboardingStatus) => {
    setUser(prev => prev ? { ...prev, onboardingStatus: status } : null);
    
    // Update onboarding status in Supabase
    if (session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ onboarding_status: status })
          .eq('id', session.user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating onboarding status:', error);
      }
    }
  };

  const setConsultationDate = async (date: string) => {
    setUser(prev => prev ? { 
      ...prev, 
      nextConsultationDate: date,
      onboardingStatus: 'consultation-scheduled' as OnboardingStatus
    } : null);
    
    // Update consultation date in Supabase
    if (session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ 
            next_consultation_date: date,
            onboarding_status: 'consultation-scheduled'
          })
          .eq('id', session.user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating consultation date:', error);
      }
    }
  };
  
  const updateRole = async (role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : null);
    
    // Update role in Supabase if session exists
    if (session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', session.user.id);
          
        if (error) throw error;
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };
  
  // Gamification functions
  const unlockAchievement = (achievementId: string) => {
    setUser(prev => {
      if (!prev || !prev.gamification) return prev;
      
      const updatedAchievements = prev.gamification.achievements.map(achievement => 
        achievement.id === achievementId 
          ? { ...achievement, isUnlocked: true, unlockedAt: new Date().toISOString() } 
          : achievement
      );
      
      return {
        ...prev,
        gamification: {
          ...prev.gamification,
          achievements: updatedAchievements
        }
      };
    });
  };
  
  const earnXP = (amount: number) => {
    setUser(prev => {
      if (!prev || !prev.gamification) return prev;
      
      const currentXP = prev.gamification.xp + amount;
      const xpToNextLevel = prev.gamification.xpToNextLevel;
      let newLevel = prev.gamification.level;
      let remainingXP = currentXP;
      
      // Level up if enough XP
      if (currentXP >= xpToNextLevel) {
        newLevel += 1;
        remainingXP = currentXP - xpToNextLevel;
      }
      
      return {
        ...prev,
        gamification: {
          ...prev.gamification,
          level: newLevel,
          xp: remainingXP,
          xpToNextLevel: newLevel * 500  // Increase XP required for next level
        }
      };
    });
  };
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        session,
        updateUser, 
        updateOnboardingStatus,
        setConsultationDate,
        updateRole,
        unlockAchievement,
        earnXP,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
