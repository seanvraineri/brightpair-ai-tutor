
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user onboarding status types
export type OnboardingStatus = 'pending' | 'consultation-scheduled' | 'consultation-complete' | 'onboarding-complete' | 'active';

// Define user role type
export type UserRole = 'student' | 'teacher' | 'parent';

// Define user interface
interface User {
  name?: string;
  email?: string;
  onboardingStatus: OnboardingStatus;
  nextConsultationDate?: string;
  role: UserRole;
}

// Context interface
interface UserContextType {
  user: User | null;
  updateUser: (data: Partial<User>) => void;
  updateOnboardingStatus: (status: OnboardingStatus) => void;
  setConsultationDate: (date: string) => void;
  updateRole: (role: UserRole) => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
  updateOnboardingStatus: () => {},
  setConsultationDate: () => {},
  updateRole: () => {},
});

// Hook for using the context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    name: 'Emma', // Default name, would typically come from auth
    email: 'emma@example.com',
    onboardingStatus: 'pending',
    role: 'student', // Default role
  });

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };
  
  const updateOnboardingStatus = (status: OnboardingStatus) => {
    setUser(prev => prev ? { ...prev, onboardingStatus: status } : null);
  };

  const setConsultationDate = (date: string) => {
    setUser(prev => prev ? { 
      ...prev, 
      nextConsultationDate: date,
      onboardingStatus: 'consultation-scheduled' as OnboardingStatus
    } : null);
  };
  
  const updateRole = (role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : null);
  };
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser, 
        updateOnboardingStatus,
        setConsultationDate,
        updateRole
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
