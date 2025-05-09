
import { useState } from 'react';
import { User } from '@/contexts/UserTypes';

export const useGamification = (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  
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

  return {
    unlockAchievement,
    earnXP
  };
};
