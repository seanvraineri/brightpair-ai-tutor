import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Calendar, Award, Brain, Lightbulb } from 'lucide-react';
import { LearningStyle } from '@/types/learning';

// This would normally come from user preferences in a real app
const MOCK_USER_ID = "current-user-id";
const MOCK_LEARNING_STYLE: LearningStyle = "visual";

// Define types that were previously imported from LMSIntegrationService
interface ActivitySuggestion {
  type: string;
  title: string;
  description: string;
  durationMinutes: number;
}

interface StudyPlanItem {
  title: string;
  subject: string;
  topics: string[];
  dueDate: string;
  suggestedActivities: ActivitySuggestion[];
  estimatedTimeMinutes: number;
}

interface AssignmentItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  subject: string;
  topics: string[];
  materials: string[];
  course: {
    id: string;
    name: string;
  };
  pointsPossible: number;
  status: string;
}

interface PersonalizedLearningPlan {
  userId: string;
  subjects: string[];
  topicsBySubject: Record<string, string[]>;
  upcomingDeadlines: AssignmentItem[];
  studyPlan: StudyPlanItem[];
  recommendedReviewAreas: string[];
  learningStyle: string;
}

// Sample personalized learning plan
const sampleLearningPlan: PersonalizedLearningPlan = {
  userId: MOCK_USER_ID,
  subjects: ["Mathematics", "English", "Science"],
  topicsBySubject: {
    "Mathematics": ["Algebra", "Linear Equations", "Polynomials"],
    "English": ["Literature", "Shakespeare", "Essay Writing"],
    "Science": ["Biology", "Chemistry"]
  },
  upcomingDeadlines: [
    {
      id: "assignment1",
      title: "Algebra Quiz",
      description: "Test your knowledge of linear equations",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      subject: "Mathematics",
      topics: ["Algebra", "Linear Equations"],
      materials: ["https://example.com/algebra-notes.pdf"],
      course: {
        id: "math101",
        name: "Algebra I"
      },
      pointsPossible: 100,
      status: "not_started"
    },
    {
      id: "assignment2",
      title: "Shakespeare Essay",
      description: "Analyze the main themes in Hamlet",
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      subject: "English",
      topics: ["Literature", "Shakespeare", "Essay Writing"],
      materials: [],
      course: {
        id: "eng101",
        name: "English Literature"
      },
      pointsPossible: 50,
      status: "not_started"
    }
  ],
  studyPlan: [
    {
      title: "Prepare for: Algebra Quiz",
      subject: "Mathematics",
      topics: ["Algebra", "Linear Equations"],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      suggestedActivities: [
        {
          type: "lesson",
          title: "Mathematics: Algebra",
          description: "Interactive lesson on Algebra, Linear Equations",
          durationMinutes: 15
        },
        {
          type: "video",
          title: "Visual explanation of Algebra",
          description: "Learn through diagrams, charts, and visual demonstrations",
          durationMinutes: 10
        },
        {
          type: "flashcards",
          title: "Visual concept cards for Mathematics",
          description: "Image-based flashcards for key concepts",
          durationMinutes: 8
        },
        {
          type: "quiz",
          title: "Practice quiz for Algebra Quiz",
          description: "Test your understanding before the real assignment",
          durationMinutes: 10
        }
      ],
      estimatedTimeMinutes: 43
    },
    {
      title: "Prepare for: Shakespeare Essay",
      subject: "English",
      topics: ["Literature", "Shakespeare", "Essay Writing"],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      suggestedActivities: [
        {
          type: "lesson",
          title: "English: Literature",
          description: "Interactive lesson on Literature, Shakespeare, Essay Writing",
          durationMinutes: 15
        },
        {
          type: "video",
          title: "Visual explanation of Literature",
          description: "Learn through diagrams, charts, and visual demonstrations",
          durationMinutes: 10
        },
        {
          type: "flashcards",
          title: "Visual concept cards for English",
          description: "Image-based flashcards for key concepts",
          durationMinutes: 8
        },
        {
          type: "quiz",
          title: "Practice quiz for Shakespeare Essay",
          description: "Test your understanding before the real assignment",
          durationMinutes: 10
        }
      ],
      estimatedTimeMinutes: 53
    }
  ],
  recommendedReviewAreas: ["Algebra", "Essay Writing", "Scientific Method"],
  learningStyle: "visual"
};

const PersonalizedLearningPanel: React.FC = () => {
  const [learningPlan, setLearningPlan] = useState<PersonalizedLearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudyPlan, setSelectedStudyPlan] = useState<StudyPlanItem | null>(null);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      setLoading(true);
      try {
        // In a real application, this would come from the API
        // For demonstration, we're using sample data
        setTimeout(() => {
          setLearningPlan(sampleLearningPlan);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching personalized learning plan:", error);
        setLoading(false);
      }
    };

    fetchLearningPlan();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  const calculateDaysUntil = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderActivityIcon = (type: string) => {
    switch(type) {
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case 'video':
        return <Lightbulb className="h-4 w-4 text-purple-600" />;
      case 'flashcards':
        return <Brain className="h-4 w-4 text-indigo-600" />;
      case 'quiz':
        return <Award className="h-4 w-4 text-orange-600" />;
      case 'interactive':
        return <Lightbulb className="h-4 w-4 text-green-600" />;
      default:
        return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Personalized Learning Plan</CardTitle>
          <CardDescription>Loading your customized study plan...</CardDescription>
        </CardHeader>
        <CardContent className="py-8 flex justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-200 rounded"></div>
            <div className="h-6 w-48 mt-4 bg-gray-200 rounded"></div>
            <div className="h-4 w-64 mt-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!learningPlan) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Personalized Learning</CardTitle>
          <CardDescription>Get personalized recommendations based on your learning style</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center">
          <p className="mb-4">No learning data available yet. Complete your learning profile to get started.</p>
          <Button className="bg-brightpair hover:bg-brightpair-600 text-white border border-brightpair-600">
            Complete Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-600" />
          Your Personalized Learning Plan
        </CardTitle>
        <CardDescription>
          Customized for your {learningPlan.learningStyle} learning style
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {selectedStudyPlan ? (
          // Detailed study plan view
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedStudyPlan.title}</h3>
              <Button 
                variant="outline" 
                className="border-gray-300 bg-white text-gray-800"
                onClick={() => setSelectedStudyPlan(null)}
              >
                Back to Overview
              </Button>
            </div>
            
            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-md">
              <div>
                <p className="text-sm font-medium">Course: {selectedStudyPlan.subject}</p>
                <p className="text-xs text-gray-500">
                  Topics: {selectedStudyPlan.topics.join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Due: {formatDate(selectedStudyPlan.dueDate)}</p>
                <p className="text-xs text-gray-500">
                  {calculateDaysUntil(selectedStudyPlan.dueDate)} days remaining
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  Estimated time: {selectedStudyPlan.estimatedTimeMinutes} minutes
                </span>
              </div>
              
              <h4 className="text-base font-medium mb-3">Recommended Learning Path</h4>
              <div className="space-y-3">
                {selectedStudyPlan.suggestedActivities.map((activity, index) => (
                  <div key={index} className="border rounded-md p-3 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{renderActivityIcon(activity.type)}</div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {activity.durationMinutes} min
                          </span>
                          <Button size="sm" className="bg-brightpair hover:bg-brightpair-600 text-white border border-brightpair-600">
                            Start {activity.type}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Overview view
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="review">Review Areas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="py-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-3">Upcoming Assignments</h3>
                  <div className="space-y-3">
                    {learningPlan.upcomingDeadlines.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="border rounded-md p-3 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{assignment.title}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {assignment.course.name} • Due {formatDate(assignment.dueDate)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-100 text-blue-800">
                              {calculateDaysUntil(assignment.dueDate)} days left
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium mb-3">Your Study Plan</h3>
                  <div className="space-y-3">
                    {learningPlan.studyPlan.map((plan, index) => (
                      <div key={index} className="border rounded-md p-3 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{plan.title}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <span>{plan.subject}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" /> {plan.estimatedTimeMinutes} min
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-brightpair hover:bg-brightpair-600 text-white border border-brightpair-600"
                            onClick={() => setSelectedStudyPlan(plan)}
                          >
                            View Plan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="subjects" className="py-4">
              <div className="space-y-6">
                <h3 className="text-base font-medium mb-3">Your Subjects</h3>
                <div className="space-y-4">
                  {learningPlan.subjects.map((subject, index) => (
                    <div key={index} className="border rounded-md p-4 bg-white">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{subject}</h4>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-gray-300 bg-white text-gray-800"
                        >
                          Explore
                        </Button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{15 + index * 25}%</span>
                        </div>
                        <Progress value={15 + index * 25} className="h-2" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mt-3 mb-2">Topics:</p>
                        <div className="flex flex-wrap gap-2">
                          {learningPlan.topicsBySubject[subject]?.map((topic, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="review" className="py-4">
              <div className="space-y-6">
                <h3 className="text-base font-medium mb-3">Recommended Review Areas</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Based on your upcoming assignments and past performance, we recommend reviewing these topics:
                </p>
                
                <div className="space-y-3">
                  {learningPlan.recommendedReviewAreas.map((area, index) => (
                    <div key={index} className="border rounded-md p-4 bg-white flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-indigo-100 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium">{area}</p>
                          <p className="text-sm text-gray-500">
                            {index === 0 ? 'High priority' : index === 1 ? 'Medium priority' : 'Standard review'}
                          </p>
                        </div>
                      </div>
                      <Button className="bg-brightpair hover:bg-brightpair-600 text-white border border-brightpair-600">
                        Review Now
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md mt-6">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Learning Style: {learningPlan.learningStyle.charAt(0).toUpperCase() + learningPlan.learningStyle.slice(1)}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {learningPlan.learningStyle === 'visual' 
                      ? 'Your content is optimized with diagrams, charts, and visual explanations to match your visual learning style.'
                      : learningPlan.learningStyle === 'auditory'
                      ? 'Your content includes more audio explanations and discussions to match your auditory learning style.'
                      : learningPlan.learningStyle === 'reading/writing'
                      ? 'Your content emphasizes written explanations and note-taking to match your reading/writing learning style.'
                      : 'Your content includes more hands-on activities and interactive examples to match your kinesthetic learning style.'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedLearningPanel; 