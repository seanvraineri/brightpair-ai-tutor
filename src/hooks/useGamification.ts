import { useEffect, useState } from "react";
import {
  Achievement,
  ActivityDetails,
  Badge,
  User,
} from "@/contexts/UserTypes";

// Define activity types and their XP rewards
export enum ActivityType {
  COMPLETE_QUIZ = "COMPLETE_QUIZ",
  COMPLETE_LESSON = "COMPLETE_LESSON",
  PRACTICE_FLASHCARDS = "PRACTICE_FLASHCARDS",
  COMPLETE_HOMEWORK = "COMPLETE_HOMEWORK",
  ATTEND_SESSION = "ATTEND_SESSION",
  DAILY_LOGIN = "DAILY_LOGIN",
  STREAK_MILESTONE = "STREAK_MILESTONE",
  PERFECT_QUIZ = "PERFECT_QUIZ",
}

interface XPRewards {
  [key: string]: number;
}

// XP rewards for different activities
const XP_REWARDS: XPRewards = {
  [ActivityType.COMPLETE_QUIZ]: 50,
  [ActivityType.PERFECT_QUIZ]: 100,
  [ActivityType.COMPLETE_LESSON]: 75,
  [ActivityType.PRACTICE_FLASHCARDS]: 30,
  [ActivityType.COMPLETE_HOMEWORK]: 60,
  [ActivityType.ATTEND_SESSION]: 80,
  [ActivityType.DAILY_LOGIN]: 15,
  [ActivityType.STREAK_MILESTONE]: 200,
};

// Achievement unlock criteria
interface AchievementCriteria {
  [key: string]: {
    activityType: string | null;
    threshold: number;
    requiresStreak?: boolean;
  };
}

const ACHIEVEMENT_CRITERIA: AchievementCriteria = {
  "first-quiz": { activityType: ActivityType.COMPLETE_QUIZ, threshold: 1 },
  "quiz-master": { activityType: ActivityType.COMPLETE_QUIZ, threshold: 10 },
  "perfect-score": { activityType: ActivityType.PERFECT_QUIZ, threshold: 1 },
  "knowledge-seeker": {
    activityType: ActivityType.COMPLETE_LESSON,
    threshold: 5,
  },
  "homework-hero": {
    activityType: ActivityType.COMPLETE_HOMEWORK,
    threshold: 10,
  },
  "flashcard-fanatic": {
    activityType: ActivityType.PRACTICE_FLASHCARDS,
    threshold: 20,
  },
  "dedicated-learner": {
    activityType: null,
    threshold: 500,
    requiresStreak: false,
  }, // Based on total XP
  "consistent-learner": {
    activityType: null,
    threshold: 7,
    requiresStreak: true,
  }, // Based on streak
};

// Extend the GamificationData to include lastLoginDate
export interface ExtendedGamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastLoginDate?: string;
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

// Activity log entry
interface ActivityLog {
  type: ActivityType;
  timestamp: string;
  details?: ActivityDetails;
  xpEarned: number;
}

export const useGamification = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
) => {
  // Track activity counts in memory
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>(
    {},
  );
  // Activity log to keep track of all user activities
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  // Load activity data from localStorage on init
  useEffect(() => {
    const loadActivityData = () => {
      try {
        const savedCounts = localStorage.getItem("activityCounts");
        const savedLog = localStorage.getItem("activityLog");

        if (savedCounts) {
          setActivityCounts(JSON.parse(savedCounts));
        }

        if (savedLog) {
          setActivityLog(JSON.parse(savedLog));
        }
      } catch (error) {
        console.error("Error loading activity data from localStorage:", error);
      }
    };

    loadActivityData();
  }, []);

  // Save activity data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(activityCounts).length > 0) {
      localStorage.setItem("activityCounts", JSON.stringify(activityCounts));
    }

    if (activityLog.length > 0) {
      localStorage.setItem("activityLog", JSON.stringify(activityLog));
    }
  }, [activityCounts, activityLog]);

  // Track and log user activity
  const trackActivity = async (
    userId: string,
    activityType: ActivityType,
    details?: ActivityDetails,
  ) => {
    if (!userId) return null;

    try {
      // Create activity log entry
      const timestamp = new Date().toISOString();
      const xpEarned = XP_REWARDS[activityType] || 0;

      const newActivity: ActivityLog = {
        type: activityType,
        timestamp,
        details: details || {},
        xpEarned,
      };

      // Update activity log
      setActivityLog((prev) => [...prev, newActivity]);

      // Update activity counts
      setActivityCounts((prev) => ({
        ...prev,
        [activityType]: (prev[activityType] || 0) + 1,
      }));

      // Award XP for the activity
      earnXP(xpEarned);

      // Check for achievements to unlock
      checkAchievements(activityType);

      // Check for streak-based achievements
      if (activityType === ActivityType.DAILY_LOGIN) {
        checkStreak();
      }

      return newActivity;
    } catch (error) {
      console.error("Error tracking activity:", error);
      return null;
    }
  };

  // Get activities by type
  const getActivitiesByType = (type: ActivityType) => {
    return activityLog.filter((activity) => activity.type === type);
  };

  // Get today's activities
  const getTodayActivities = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return activityLog.filter((activity) => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });
  };

  // Check and unlock achievements based on criteria
  const checkAchievements = (activityType: ActivityType) => {
    setUser((prev) => {
      if (!prev || !prev.gamification) return prev;

      const updatedAchievements = [...prev.gamification.achievements];

      // Check each achievement criteria
      Object.entries(ACHIEVEMENT_CRITERIA).forEach(
        ([achievementId, criteria]) => {
          // Find the achievement in user's list
          const achievementIndex = updatedAchievements.findIndex((a) =>
            a.id === achievementId
          );
          if (
            achievementIndex === -1 ||
            updatedAchievements[achievementIndex].isUnlocked
          ) return;

          // Check if this activity type matches the criteria
          if (
            criteria.activityType !== null &&
            criteria.activityType !== activityType
          ) return;

          // Check if the threshold is met
          const count = activityCounts[criteria.activityType || ""] || 0;
          const xpTotal = prev.gamification?.xp || 0;
          const streak = prev.gamification?.streak || 0;

          let isThresholdMet = false;

          if (criteria.requiresStreak) {
            isThresholdMet = streak >= criteria.threshold;
          } else if (criteria.activityType === null) {
            // For XP-based achievements
            isThresholdMet = xpTotal >= criteria.threshold;
          } else {
            isThresholdMet = count >= criteria.threshold;
          }

          // Unlock the achievement if threshold is met
          if (isThresholdMet) {
            updatedAchievements[achievementIndex] = {
              ...updatedAchievements[achievementIndex],
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
            };
          }
        },
      );

      return {
        ...prev,
        gamification: {
          ...prev.gamification,
          achievements: updatedAchievements,
        },
      };
    });
  };

  // Check for streak-based achievements and update streak
  const checkStreak = async () => {
    setUser((prev) => {
      if (!prev || !prev.gamification) return prev;

      const gamification = prev.gamification as ExtendedGamificationData;

      // Check if this is a new day compared to last login
      const lastLoginDate = gamification.lastLoginDate
        ? new Date(gamification.lastLoginDate)
        : null;

      const today = new Date();
      const isNewDay = lastLoginDate
        ? today.getDate() !== lastLoginDate.getDate() ||
          today.getMonth() !== lastLoginDate.getMonth() ||
          today.getFullYear() !== lastLoginDate.getFullYear()
        : true;

      if (!isNewDay) return prev;

      // Check if this continues the streak (within 1 day of last login)
      const isStreakContinued = lastLoginDate
        ? Math.abs(today.getTime() - lastLoginDate.getTime()) <= 86400000 // 24 hours in ms
        : true;

      let newStreak = prev.gamification.streak || 0;

      if (isStreakContinued) {
        newStreak += 1;
      } else {
        newStreak = 1; // Reset streak
      }

      // Check for streak milestones (7, 30, 100 days)
      if (newStreak === 7 || newStreak === 30 || newStreak === 100) {
        // Award bonus XP for streak milestone
        earnXP(XP_REWARDS[ActivityType.STREAK_MILESTONE]);
      }

      return {
        ...prev,
        gamification: {
          ...prev.gamification,
          streak: newStreak,
          lastLoginDate: today.toISOString(),
        },
      };
    });
  };

  // Unlock an achievement manually
  const unlockAchievement = (achievementId: string) => {
    setUser((prev) => {
      if (!prev || !prev.gamification) return prev;

      const updatedAchievements = prev.gamification.achievements.map(
        (achievement) =>
          achievement.id === achievementId
            ? {
              ...achievement,
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
            }
            : achievement
      );

      return {
        ...prev,
        gamification: {
          ...prev.gamification,
          achievements: updatedAchievements,
        },
      };
    });
  };

  // Earn XP and level up if enough XP
  const earnXP = (amount: number) => {
    setUser((prev) => {
      if (!prev || !prev.gamification) return prev;

      const currentXP = prev.gamification.xp + amount;
      const xpToNextLevel = prev.gamification.xpToNextLevel;
      let newLevel = prev.gamification.level;
      let remainingXP = currentXP;

      // Level up if enough XP
      if (currentXP >= xpToNextLevel) {
        newLevel += 1;
        remainingXP = currentXP - xpToNextLevel;

        // Unlock level-based badges
        const updatedBadges = [...prev.gamification.badges];
        if (newLevel >= 5) {
          const bronzeBadgeIndex = updatedBadges.findIndex((b) =>
            b.id === "bronze-scholar"
          );
          if (
            bronzeBadgeIndex !== -1 &&
            !updatedBadges[bronzeBadgeIndex].isUnlocked
          ) {
            updatedBadges[bronzeBadgeIndex].isUnlocked = true;
          }
        }
        if (newLevel >= 10) {
          const silverBadgeIndex = updatedBadges.findIndex((b) =>
            b.id === "silver-scholar"
          );
          if (
            silverBadgeIndex !== -1 &&
            !updatedBadges[silverBadgeIndex].isUnlocked
          ) {
            updatedBadges[silverBadgeIndex].isUnlocked = true;
          }
        }
        if (newLevel >= 20) {
          const goldBadgeIndex = updatedBadges.findIndex((b) =>
            b.id === "gold-scholar"
          );
          if (
            goldBadgeIndex !== -1 && !updatedBadges[goldBadgeIndex].isUnlocked
          ) {
            updatedBadges[goldBadgeIndex].isUnlocked = true;
          }
        }

        return {
          ...prev,
          gamification: {
            ...prev.gamification,
            level: newLevel,
            xp: remainingXP,
            xpToNextLevel: newLevel * 500, // Increase XP required for next level
            badges: updatedBadges,
          },
        };
      }

      return {
        ...prev,
        gamification: {
          ...prev.gamification,
          xp: remainingXP,
        },
      };
    });
  };

  // Calculate percentage completion for a subject
  const calculateSubjectProgress = (subjectId: string): number => {
    // Filter activities by subject
    const subjectActivities = activityLog.filter((a) =>
      a.details?.subjectId === subjectId
    );

    // Calculate total completed lessons/quizzes
    const completedLessons =
      subjectActivities.filter((a) => a.type === ActivityType.COMPLETE_LESSON)
        .length;

    const completedQuizzes =
      subjectActivities.filter((a) => a.type === ActivityType.COMPLETE_QUIZ)
        .length;

    // Assuming each subject has about 20 total activities to complete (adjust as needed)
    const totalActivitiesPerSubject = 20;

    // Calculate percentage
    const percentage = Math.min(
      100,
      Math.round(
        ((completedLessons + completedQuizzes) / totalActivitiesPerSubject) *
          100,
      ),
    );

    return percentage;
  };

  return {
    unlockAchievement,
    earnXP,
    trackActivity,
    checkStreak,
    calculateSubjectProgress,
    getActivitiesByType,
    getTodayActivities,
    ActivityType,
    activityLog,
  };
};
