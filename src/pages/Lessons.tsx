
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BookOpen, BookText, GraduationCap, HelpCircle, ListTodo, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonPrimary from "@/components/ButtonPrimary";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import LessonModal from "@/components/lessons/LessonModal";

const Lessons: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("recommended");
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // This would come from an API in a real implementation
  const [lessonsByCategory, setLessonsByCategory] = useState({
    recommended: [
      {
        id: 1,
        title: "Understanding Quadratic Equations",
        subject: "Mathematics",
        description: "Learn how to solve and graph quadratic equations and understand their real-world applications.",
        progress: 0,
        duration: "25 min",
        level: "Intermediate",
        relatedHomework: "Quadratic Equations Practice",
        relatedFlashcards: "Algebra Fundamentals",
        relatedQuiz: "Quadratic Equations Quiz"
      },
      {
        id: 2,
        title: "Introduction to Photosynthesis",
        subject: "Biology",
        description: "Explore how plants convert light energy into chemical energy through the process of photosynthesis.",
        progress: 0,
        duration: "20 min",
        level: "Beginner",
        relatedHomework: "Plant Biology Lab Report",
        relatedFlashcards: "Cell Biology",
        relatedQuiz: "Plant Processes Quiz"
      },
      {
        id: 3,
        title: "Literary Analysis Techniques",
        subject: "English",
        description: "Master the skills needed to analyze and interpret literature through various critical lenses.",
        progress: 0,
        duration: "30 min",
        level: "Advanced",
        relatedHomework: "Short Story Analysis",
        relatedFlashcards: "Literary Terms",
        relatedQuiz: "Literature Interpretation"
      }
    ],
    inProgress: [
      {
        id: 4,
        title: "The American Revolution",
        subject: "History",
        description: "Examine the causes, events, and consequences of the American Revolutionary War.",
        progress: 65,
        duration: "40 min",
        level: "Intermediate",
        relatedHomework: "Revolutionary War Timeline",
        relatedFlashcards: "Historical Events",
        relatedQuiz: "American Revolution Quiz"
      }
    ],
    completed: [
      {
        id: 5,
        title: "Newton's Laws of Motion",
        subject: "Physics",
        description: "Understand the fundamental principles governing motion in classical mechanics.",
        progress: 100,
        duration: "35 min",
        level: "Intermediate",
        relatedHomework: "Physics Problem Set",
        relatedFlashcards: "Physics Formulas",
        relatedQuiz: "Laws of Motion Quiz"
      },
      {
        id: 6,
        title: "Basic Spanish Conversation",
        subject: "Spanish",
        description: "Learn essential conversational phrases and vocabulary for everyday situations.",
        progress: 100,
        duration: "45 min",
        level: "Beginner",
        relatedHomework: "Spanish Dialogue Writing",
        relatedFlashcards: "Spanish Vocabulary",
        relatedQuiz: "Basic Spanish Quiz"
      }
    ]
  });

  const getStatusColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress === 100) return "bg-green-500";
    return "bg-brightpair";
  };

  const getLessonIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "mathematics":
      case "physics":
        return <GraduationCap className="h-6 w-6 text-brightpair" />;
      case "english":
      case "spanish":
        return <BookText className="h-6 w-6 text-brightpair" />;
      default:
        return <BookOpen className="h-6 w-6 text-brightpair" />;
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  // Handler for opening the lesson modal
  const handleOpenLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  // Handler for completing a lesson
  const handleLessonComplete = () => {
    if (!selectedLesson) return;
    
    // Update the lesson progress
    const updatedLessonsByCategory = { ...lessonsByCategory };
    
    // Find and remove the lesson from its current category
    let foundLesson = false;
    for (const category in updatedLessonsByCategory) {
      if (foundLesson) break;
      
      const categoryLessons = updatedLessonsByCategory[category as keyof typeof lessonsByCategory];
      const lessonIndex = categoryLessons.findIndex(lesson => lesson.id === selectedLesson.id);
      
      if (lessonIndex !== -1) {
        // Update the lesson with 100% progress
        const updatedLesson = {...categoryLessons[lessonIndex], progress: 100};
        
        // Remove from current category
        updatedLessonsByCategory[category as keyof typeof lessonsByCategory] = 
          categoryLessons.filter(lesson => lesson.id !== selectedLesson.id);
        
        // Add to completed category
        updatedLessonsByCategory.completed = [...updatedLessonsByCategory.completed, updatedLesson];
        
        foundLesson = true;
      }
    }
    
    setLessonsByCategory(updatedLessonsByCategory);
    
    toast({
      title: "Lesson Completed!",
      description: `You've completed "${selectedLesson.title}". Great job!`,
    });
  };

  // Component for related resources links
  const RelatedResources = ({ homework, flashcards, quiz }: { homework: string, flashcards: string, quiz: string }) => (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-3">RELATED RESOURCES</p>
      <div className="flex flex-col gap-3">
        <Link 
          to="/homework" 
          className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ListTodo size={16} className="text-brightpair" />
            <span>{homework}</span>
          </div>
          <span className="text-xs text-gray-500">Homework</span>
        </Link>
        
        <Link 
          to="/flashcards" 
          className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-brightpair" />
            <span>{flashcards}</span>
          </div>
          <span className="text-xs text-gray-500">Flashcards</span>
        </Link>
        
        <Link 
          to="/quizzes" 
          className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={16} className="text-brightpair" />
            <span>{quiz}</span>
          </div>
          <span className="text-xs text-gray-500">Quiz</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">My Lessons</h1>
            <p className="text-gray-600 max-w-2xl">Complete your assigned lessons and explore recommended content tailored to your learning goals</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button asChild variant="outline" className="border-gray-300 shadow-sm">
              <Link to="/homework" className="flex items-center">
                <ListTodo className="mr-2 h-4 w-4" />
                Homework
              </Link>
            </Button>
            <ButtonPrimary asChild className="shadow-sm">
              <Link to="/quizzes" className="flex items-center">
                <HelpCircle className="mr-2 h-4 w-4" />
                Take a Quiz
              </Link>
            </ButtonPrimary>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger 
                value="recommended"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                Recommended
              </TabsTrigger>
              <TabsTrigger 
                value="inProgress"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(lessonsByCategory).map(([category, lessons]) => (
            <TabsContent value={category} key={category}>
              {lessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson) => (
                    <Card 
                      key={lesson.id} 
                      className="overflow-hidden border border-gray-200 transition-all hover:shadow-md bg-white"
                    >
                      <CardHeader className="pb-4 border-b border-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          {getLessonIcon(lesson.subject)}
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={getLevelBadgeColor(lesson.level)}
                            >
                              {lesson.level}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock size={12} />
                              {lesson.duration}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">{lesson.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-brightpair mr-1"></span>
                            {lesson.subject}
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium">
                              {lesson.progress === 0 ? "Not started" : 
                               lesson.progress === 100 ? (
                                <span className="flex items-center gap-1 text-green-600">
                                  <Award size={14} />
                                  Completed
                                </span>
                               ) : 
                               `${lesson.progress}% complete`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${getStatusColor(lesson.progress)} h-2 rounded-full transition-all duration-500`} 
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col">
                        <ButtonPrimary 
                          className="w-full"
                          onClick={() => handleOpenLesson(lesson)}
                        >
                          {lesson.progress === 0 ? "Start Lesson" : 
                           lesson.progress === 100 ? "Review Lesson" : 
                           "Continue Lesson"}
                        </ButtonPrimary>
                        
                        <RelatedResources 
                          homework={lesson.relatedHomework} 
                          flashcards={lesson.relatedFlashcards} 
                          quiz={lesson.relatedQuiz} 
                        />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg border border-dashed border-gray-300">
                  <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No lessons found</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                    There are no lessons in this category yet. Check back soon or explore other categories.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Lesson Modal */}
        {selectedLesson && (
          <LessonModal
            open={isLessonModalOpen}
            onOpenChange={setIsLessonModalOpen}
            lesson={selectedLesson}
            onComplete={handleLessonComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Lessons;
