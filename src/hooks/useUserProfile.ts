
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, OnboardingStatus } from '@/contexts/UserTypes';
import { getPersonalizedAchievements } from '@/utils/gamificationUtils';

export const useUserProfile = () => {
  const [user, setUser] = useState<User | null>(null);

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

  const updateUser = async (session: any, data: Partial<User>) => {
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
  
  const updateOnboardingStatus = async (session: any, status: OnboardingStatus) => {
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

  const setConsultationDate = async (session: any, date: string) => {
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
  
  const updateRole = async (session: any, role: UserRole) => {
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

  return {
    user,
    setUser,
    fetchUserProfile,
    updateUser,
    updateOnboardingStatus,
    setConsultationDate,
    updateRole
  };
};
