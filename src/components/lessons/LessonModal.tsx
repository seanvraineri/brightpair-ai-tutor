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
import LessonContent from "./LessonContent";

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

  // Define all handler functions before any JSX or references
  const handleComplete = () => {
    setIsCompleted(true);
    onComplete();
  };

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

  // This updated content includes math examples
  const lessonContent = [
    {
      title: "Introduction",
      content: `Welcome to ${lesson.title}! In this lesson, you will learn about the core concepts and gain a solid understanding of this subject.

This lesson is designed to be interactive and engaging. You'll find explanations, examples, and practice questions to help you master the material.

By the end of this lesson, you should be able to:
- Understand the fundamental principles of ${lesson.subject}
- Apply these concepts to solve related problems
- Connect this knowledge to other areas of study`
    },
    {
      title: "Key Concepts",
      content: `Let's explore the key concepts of ${lesson.title}:

The First Principle explains how elements interact within this system. This forms the foundation for understanding more complex concepts later.

${lesson.subject === "Mathematics" || lesson.subject === "Calculus" || lesson.subject === "Algebra" ? 
`For example, in mathematics, the fundamental concepts include:

$$y = mx + b$$

Where $m$ represents the slope and $b$ is the y-intercept of a line.

Another core concept is the quadratic formula:

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

Which is used to solve equations of the form $ax^2 + bx + c = 0$` : 

lesson.subject === "Physics" ?
`For example, in physics, Newton's Second Law is expressed as:

$$F = ma$$

Where $F$ is force, $m$ is mass, and $a$ is acceleration.

Another important concept is the conservation of energy:

$$E_{potential} + E_{kinetic} = \\text{constant}$$` :

lesson.subject === "Chemistry" ?
`For example, in chemistry, the ideal gas law is expressed as:

$$PV = nRT$$

Where $P$ is pressure, $V$ is volume, $n$ is the number of moles, $R$ is the gas constant, and $T$ is temperature.` :

`The key principles in this field form the foundation for more advanced topics.`}

Building on the first principle, we can now explore how these interactions lead to predictable outcomes and patterns.`
    },
    {
      title: "Examples & Practice",
      content: `Let's see these concepts in action with some examples:

Example 1: 
${lesson.subject === "Mathematics" || lesson.subject === "Calculus" || lesson.subject === "Algebra" ? 
`Find the derivative of $f(x) = x^2 \\sin(x)$.

Solution:
Using the product rule, we get:
$$f'(x) = 2x\\sin(x) + x^2\\cos(x)$$` :

lesson.subject === "Physics" ?
`A 2 kg object is subjected to a force of 10 N. What is its acceleration?

Solution:
Using $F = ma$, we get:
$$a = \\frac{F}{m} = \\frac{10 \\text{ N}}{2 \\text{ kg}} = 5 \\text{ m/s}^2$$` :

lesson.subject === "Chemistry" ?
`Calculate the pH of a solution with a hydrogen ion concentration of $1.0 \\times 10^{-5}$ mol/L.

Solution:
Using $\\text{pH} = -\\log[\\text{H}^+]$, we get:
$$\\text{pH} = -\\log(1.0 \\times 10^{-5}) = 5.0$$` :

`Let's explore how these concepts apply in a practical example.`}

Try solving this problem using what you've learned:`
    },
    {
      title: "Summary & Next Steps",
      content: `Key Takeaways:
- You've learned the fundamental principles of ${lesson.title}
- You understand how to apply these concepts in different contexts
- You can recognize patterns and solve related problems

Next Steps:
To further your understanding:
- Complete the related homework assignment
- Practice with the flashcards to reinforce key terms
- Test your knowledge with the quiz

Ready to demonstrate your understanding?`
    }
  ];

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
            <Badge className="flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200">
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
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Step {currentStep + 1} of {lessonContent.length}</span>
                  <span>{Math.round((currentStep + 1) / lessonContent.length * 100)}% complete</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-md overflow-hidden">
                  <div 
                    className="h-full bg-brightpair rounded"
                    style={{ width: `${((currentStep + 1) / lessonContent.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Step title */}
              <h3 className="text-lg font-semibold mb-5 text-brightpair-700">
                {lessonContent[currentStep].title}
              </h3>
              
              {/* Step content - now using LessonContent component */}
              <div className="prose prose-gray max-w-none space-y-4">
                <LessonContent 
                  content={lessonContent[currentStep].content} 
                  className="lesson-step-content"
                />
              </div>
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                
                {currentStep < lessonContent.length - 1 ? (
                  <Button onClick={handleNextStep}>
                    Next
                  </Button>
                ) : (
                  <ButtonPrimary onClick={handleComplete}>
                    {isCompleted ? "Review Complete" : "Mark as Complete"}
                  </ButtonPrimary>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="m-0 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Related Resources</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enhance your learning with these additional materials related to {lesson.title}.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    to="/homework" 
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-brightpair-50 flex items-center justify-center">
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
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-brightpair-50 flex items-center justify-center">
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
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-brightpair-50 flex items-center justify-center">
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
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>Supplementary Reading</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
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
              
              <div className="border border-gray-200 rounded-md p-5 bg-gray-50">
                <textarea 
                  className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brightpair focus:border-transparent"
                  placeholder="Type your notes here..."
                ></textarea>
                <div className="flex justify-end mt-3">
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
