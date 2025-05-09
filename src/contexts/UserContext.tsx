
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole, OnboardingStatus, UserContextType, Achievement, Badge } from './UserTypes';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useGamification } from '@/hooks/useGamification';
import { useAuth } from '@/hooks/useAuth';

// Export types from UserTypes.ts
export type { UserRole, OnboardingStatus, User, Achievement, Badge };

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

// Provider component
export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { 
    user, 
    setUser, 
    fetchUserProfile,
    updateUser: updateUserProfile,
    updateOnboardingStatus: updateUserOnboardingStatus,
    setConsultationDate: setUserConsultationDate,
    updateRole: updateUserRole
  } = useUserProfile();
  
  const { session, setSession, signOut } = useAuth();
  const { unlockAchievement, earnXP } = useGamification(setUser);

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

  // Wrapper functions to provide session to the hooks
  const updateUser = (data: Partial<User>) => {
    updateUserProfile(session, data);
  };
  
  const updateOnboardingStatus = (status: OnboardingStatus) => {
    updateUserOnboardingStatus(session, status);
  };
  
  const setConsultationDate = (date: string) => {
    setUserConsultationDate(session, date);
  };
  
  const updateRole = (role: UserRole) => {
    updateUserRole(session, role);
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
