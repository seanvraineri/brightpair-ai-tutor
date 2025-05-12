// Define learning style preferences
export type LearningStyle = 'visual' | 'auditory' | 'reading/writing' | 'kinesthetic' | 'mixed';

// Define subject areas
export enum Subject {
  MATHEMATICS = "Mathematics",
  SCIENCE = "Science",
  ENGLISH = "English",
  HISTORY = "History",
  FOREIGN_LANGUAGE = "Foreign Language",
  COMPUTER_SCIENCE = "Computer Science",
  ARTS = "Arts",
  MUSIC = "Music",
  PHYSICAL_EDUCATION = "Physical Education",
  OTHER = "Other"
}

// Define specific topics within subjects
export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  description?: string;
  parentTopicId?: string; // For hierarchical topics
}

// User learning preferences
export interface LearningPreferences {
  preferredLearningStyle: LearningStyle;
  preferredSubjects: Subject[];
  preferredTopics: string[]; // Topic IDs
  preferredStudyDuration: number; // minutes
  preferredStudyTimes?: {
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    timeRanges: {
      start: string; // HH:MM format
      end: string; // HH:MM format
    }[];
  };
  difficultyPreference: 'easier' | 'standard' | 'challenging';
  feedbackFrequency: 'low' | 'medium' | 'high';
}

// Learning progress metrics
export interface LearningProgress {
  userId: string;
  subject: Subject;
  topic: string;
  strength: number; // 0-100 scale
  lastPracticed: string; // ISO date
  totalTimeSpent: number; // minutes
  masteryLevel: 'novice' | 'developing' | 'proficient' | 'advanced' | 'expert';
  needsReview: boolean;
}

// Learning goals
export interface LearningGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  subject?: Subject;
  topics?: string[]; // Topic IDs
  targetDate?: string; // ISO date
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number; // 0-100 scale
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

// AI tutor customization
export interface TutorProfile {
  teachingStyle: 'socratic' | 'direct' | 'guided_discovery' | 'problem_based';
  communicationTone: 'formal' | 'casual' | 'encouraging' | 'neutral';
  explanationDetail: 'concise' | 'detailed' | 'comprehensive';
  exampleFrequency: 'minimal' | 'moderate' | 'frequent';
  userInteractionLevel: 'low' | 'medium' | 'high';
} 