
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ButtonPrimary from "@/components/ButtonPrimary";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, CheckCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

interface LessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: {
    id: number;
    title: string;
    subject: string;
    description: string;
    progress: number;
    duration: string;
    level: string;
    relatedHomework: string;
    relatedFlashcards: string;
    relatedQuiz: string;
  };
  onComplete: () => void;
}

const LessonModal: React.FC<LessonModalProps> = ({ 
  open, 
  onOpenChange, 
  lesson, 
  onComplete 
}) => {
  const [activeTab, setActiveTab] = useState("content");
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lesson.progress === 100);

  // This would come from an API in a real implementation
  const lessonContent = [
    {
      title: "Introduction",
      content: (
        <div className="space-y-4">
          <p>Welcome to {lesson.title}! In this lesson, you will learn about the core concepts and gain a solid understanding of this subject.</p>
          <p>This lesson is designed to be interactive and engaging. You'll find explanations, examples, and practice questions to help you master the material.</p>
          <p>By the end of this lesson, you should be able to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Understand the fundamental principles of {lesson.subject}</li>
            <li>Apply these concepts to solve related problems</li>
            <li>Connect this knowledge to other areas of study</li>
          </ul>
        </div>
      )
    },
    {
      title: "Key Concepts",
      content: (
        <div className="space-y-4">
          <p>Let's explore the key concepts of {lesson.title}:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-brightpair mb-2">First Principle</h4>
            <p>The first principle explains how elements interact within this system. This forms the foundation for understanding more complex concepts later.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-brightpair mb-2">Second Principle</h4>
            <p>Building on the first principle, we can now explore how these interactions lead to predictable outcomes and patterns.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-brightpair mb-2">Practical Applications</h4>
            <p>These principles have wide-ranging applications in real-world scenarios, from everyday problem solving to advanced research.</p>
          </div>
        </div>
      )
    },
    {
      title: "Examples & Practice",
      content: (
        <div className="space-y-4">
          <p>Let's see these concepts in action with some examples:</p>
          
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-2">Example 1</h4>
            <p className="mb-3">Here's a practical example of how these concepts are applied:</p>
            <div className="bg-gray-50 p-3 rounded-md mb-2">
              <p className="font-mono text-sm">Example implementation or problem</p>
            </div>
            <p>The solution demonstrates how the principles work together to achieve the desired outcome.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Practice Question</h4>
            <p className="mb-3">Try solving this problem using what you've learned:</p>
            <div className="bg-gray-50 p-3 rounded-md mb-3">
              <p className="font-mono text-sm">Practice problem statement</p>
            </div>
            <Button variant="outline" className="w-full justify-between">
              View Solution <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Summary & Next Steps",
      content: (
        <div className="space-y-4">
          <h4 className="font-medium">Key Takeaways</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>You've learned the fundamental principles of {lesson.title}</li>
            <li>You understand how to apply these concepts in different contexts</li>
            <li>You can recognize patterns and solve related problems</li>
          </ul>
          
          <h4 className="font-medium mt-4">Next Steps</h4>
          <p>To further your understanding:</p>
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Complete the related homework assignment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Practice with the flashcards to reinforce key terms</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Test your knowledge with the quiz</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-4">Ready to demonstrate your understanding?</p>
            <ButtonPrimary onClick={handleComplete} className="w-full">
              Mark Lesson as Complete
            </ButtonPrimary>
          </div>
        </div>
      )
    }
  ];

  const handleNextStep = () => {
    if (currentStep < lessonContent.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
          <div className="flex justify-between items-center mb-2">
            <Badge 
              variant="outline" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
            >
              {lesson.subject}
            </Badge>
            <Badge className="flex items-center gap-1 bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Clock className="h-3 w-3" />
              {lesson.duration}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {lesson.title}
          </DialogTitle>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3 mb-2">
              <TabsTrigger value="content">Lesson Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="notes">My Notes</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <TabsContent value="content" className="m-0">
            <div className="p-6">
              {/* Progress indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                  <span>Step {currentStep + 1} of {lessonContent.length}</span>
                  <span>{Math.round((currentStep + 1) / lessonContent.length * 100)}% complete</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brightpair rounded-full"
                    style={{ width: `${((currentStep + 1) / lessonContent.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Step title */}
              <h3 className="text-lg font-semibold mb-4 text-brightpair-700">
                {lessonContent[currentStep].title}
              </h3>
              
              {/* Step content */}
              <div className="prose prose-gray max-w-none">
                {lessonContent[currentStep].content}
              </div>
              
              {/* Navigation buttons */}
              {!isCompleted && (
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                  <Button 
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  
                  {currentStep < lessonContent.length - 1 ? (
                    <ButtonPrimary onClick={handleNextStep}>
                      Next <ArrowRight className="ml-1 h-4 w-4" />
                    </ButtonPrimary>
                  ) : (
                    <ButtonPrimary onClick={handleComplete}>
                      Complete Lesson <CheckCircle className="ml-1 h-4 w-4" />
                    </ButtonPrimary>
                  )}
                </div>
              )}
              
              {isCompleted && (
                <div className="mt-8 pt-4 border-t border-gray-100 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Lesson Completed!</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Great job! You've completed this lesson. Continue your learning journey with the related resources.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                      Close
                    </Button>
                    <ButtonPrimary asChild>
                      <Link to="/quizzes">Take Quiz</Link>
                    </ButtonPrimary>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="m-0 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Related Resources</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enhance your learning with these additional materials related to {lesson.title}.
                </p>
                
                <div className="space-y-3">
                  <Link 
                    to="/homework" 
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brightpair-50 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-brightpair" />
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.relatedHomework}</h4>
                        <p className="text-sm text-gray-500">Practice problems and assignments</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  
                  <Link 
                    to="/flashcards" 
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brightpair-50 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-brightpair" />
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.relatedFlashcards}</h4>
                        <p className="text-sm text-gray-500">Key terms and concepts</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>
                  
                  <Link 
                    to="/quizzes" 
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-brightpair-50 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-brightpair" />
                      </div>
                      <div>
                        <h4 className="font-medium">{lesson.relatedQuiz}</h4>
                        <p className="text-sm text-gray-500">Test your understanding</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Materials</h3>
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>Supplementary Reading</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>Downloadable Worksheet</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="m-0 p-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">My Notes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Take notes while studying to help reinforce your learning.
              </p>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <textarea 
                  className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brightpair focus:border-transparent"
                  placeholder="Type your notes here..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <Button variant="outline" className="text-sm">Save Notes</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
