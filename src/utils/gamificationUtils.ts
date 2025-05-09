
import { Achievement } from '@/contexts/UserTypes';

// Sample gamification data based on interests and learning style
export const getPersonalizedAchievements = (interests: string[], learningStyle: string): Achievement[] => {
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
