
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define user onboarding status types
export type OnboardingStatus = 'pending' | 'consultation-scheduled' | 'consultation-complete' | 'onboarding-complete' | 'active';

// Define user interface
interface User {
  name?: string;
  email?: string;
  onboardingStatus: OnboardingStatus;
  nextConsultationDate?: string;
}

// Context interface
interface UserContextType {
  user: User | null;
  updateUser: (data: Partial<User>) => void;
  updateOnboardingStatus: (status: OnboardingStatus) => void;
  setConsultationDate: (date: string) => void;
}

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  updateUser: () => {},
  updateOnboardingStatus: () => {},
  setConsultationDate: () => {},
});

// Hook for using the context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    name: 'Emma', // Default name, would typically come from auth
    email: 'emma@example.com',
    onboardingStatus: 'pending',
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
  
  return (
    <UserContext.Provider 
      value={{ 
        user, 
        updateUser, 
        updateOnboardingStatus,
        setConsultationDate
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
