
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BookText, GraduationCap, HelpCircle, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";

const Lessons: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("recommended");

  // This would come from an API in a real implementation
  const lessonsByCategory = {
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
  };

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

  // Component for related resources links
  const RelatedResources = ({ homework, flashcards, quiz }: { homework: string, flashcards: string, quiz: string }) => (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-xs font-medium text-gray-500 mb-2">RELATED RESOURCES</p>
      <div className="flex flex-wrap gap-2">
        <Link to="/homework" className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-full hover:bg-gray-100">
          <ListTodo size={12} className="mr-1" />
          {homework}
        </Link>
        <Link to="/flashcards" className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-full hover:bg-gray-100">
          <BookOpen size={12} className="mr-1" />
          {flashcards}
        </Link>
        <Link to="/quizzes" className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded-full hover:bg-gray-100">
          <HelpCircle size={12} className="mr-1" />
          {quiz}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Lessons</h1>
            <p className="text-gray-600">Personalized learning materials tailored to your progress</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button asChild variant="outline">
              <Link to="/homework">View Homework</Link>
            </Button>
            <Button asChild className="bg-brightpair hover:bg-brightpair-600">
              <Link to="/quizzes">Take a Quiz</Link>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(lessonsByCategory).map(([category, lessons]) => (
            <TabsContent value={category} key={category}>
              {lessons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lessons.map((lesson) => (
                    <Card key={lesson.id} className="overflow-hidden border border-gray-200 transition-all hover:shadow-md">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          {getLessonIcon(lesson.subject)}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                              {lesson.level}
                            </span>
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <CardTitle className="text-lg">{lesson.title}</CardTitle>
                          <CardDescription className="text-sm text-gray-500">{lesson.subject}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">
                              {lesson.progress === 0 ? "Not started" : 
                               lesson.progress === 100 ? "Completed" : 
                               `${lesson.progress}% complete`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`${getStatusColor(lesson.progress)} h-1.5 rounded-full`} 
                              style={{ width: `${lesson.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button className="w-full bg-brightpair hover:bg-brightpair-600 text-white">
                            {lesson.progress === 0 ? "Start Lesson" : 
                             lesson.progress === 100 ? "Review Lesson" : 
                             "Continue Lesson"}
                          </Button>
                        </div>
                        
                        <RelatedResources 
                          homework={lesson.relatedHomework} 
                          flashcards={lesson.relatedFlashcards} 
                          quiz={lesson.relatedQuiz} 
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No lessons found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    There are no lessons in this category yet.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Lessons;
