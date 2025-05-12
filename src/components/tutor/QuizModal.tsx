
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, BookText, Trophy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: string;
}

const QuizModal: React.FC<QuizModalProps> = ({ open, onOpenChange, topic }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  
  // Generate quiz questions based on the topic
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      // Reset state when the modal opens
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setQuizCompleted(false);
      
      // Generate questions based on topic
      const generatedQuestions = generateQuizQuestions(topic);
      setQuestions(generatedQuestions);
      setUserAnswers(Array(generatedQuestions.length).fill(null));
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [open, topic]);

  // Function to generate questions based on topic
  const generateQuizQuestions = (topic: string): QuizQuestion[] => {
    // In a real implementation, this would call an AI API to generate questions
    // For now, we'll use topic-specific mock questions
    
    const topicLower = topic.toLowerCase();
    
    if (topicLower === "algebra") {
      return [
        {
          question: "What is the slope of the line passing through points (2, 5) and (4, 9)?",
          options: ["1", "2", "3", "4"],
          correctAnswer: 1
        },
        {
          question: "Solve for x: 3x + 7 = 22",
          options: ["x = 3", "x = 5", "x = 7", "x = 15"],
          correctAnswer: 1
        },
        {
          question: "Factor the expression: x² + 7x + 12",
          options: ["(x + 3)(x + 4)", "(x + 6)(x + 2)", "(x - 3)(x - 4)", "(x - 6)(x - 2)"],
          correctAnswer: 0
        }
      ];
    } 
    else if (topicLower === "biology") {
      return [
        {
          question: "Which organelle is known as the 'powerhouse' of the cell?",
          options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Endoplasmic reticulum"],
          correctAnswer: 1
        },
        {
          question: "What is the process by which plants convert light energy to chemical energy?",
          options: ["Respiration", "Fermentation", "Photosynthesis", "Transpiration"],
          correctAnswer: 2
        },
        {
          question: "Which of these is NOT a part of the central dogma of molecular biology?",
          options: ["DNA replication", "DNA transcription to RNA", "RNA translation to proteins", "Protein folding to DNA"],
          correctAnswer: 3
        }
      ];
    }
    else if (topicLower === "geometry") {
      return [
        {
          question: "What is the formula for the area of a circle?",
          options: ["πr", "2πr", "πr²", "2πr²"],
          correctAnswer: 2
        },
        {
          question: "The sum of the angles in a triangle is:",
          options: ["90 degrees", "180 degrees", "270 degrees", "360 degrees"],
          correctAnswer: 1
        },
        {
          question: "What is the Pythagorean theorem?",
          options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c²"],
          correctAnswer: 0
        }
      ];
    }
    else {
      // Generic questions if topic isn't recognized
      return [
        {
          question: `What is a key concept in ${topic}?`,
          options: ["Concept A", "Concept B", "Concept C", "Concept D"],
          correctAnswer: 1
        },
        {
          question: `Which of these is NOT typically studied in ${topic}?`,
          options: ["Element 1", "Element 2", "Element 3", "Element 4"],
          correctAnswer: 3
        },
        {
          question: `Who is considered the founder of modern ${topic}?`,
          options: ["Scientist A", "Scientist B", "Scientist C", "Scientist D"],
          correctAnswer: 2
        }
      ];
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    // Record user's answer
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);
    
    setIsAnswerSubmitted(true);
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      toast({
        title: "Correct!",
        description: "Well done! That's the right answer.",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer is: ${questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctAnswer]}`,
        variant: "destructive",
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };

  const handleFinishQuiz = () => {
    onOpenChange(false);
    // In a real app, you would save the quiz results to the database
  };

  // Calculate score
  const calculateScore = () => {
    const correctCount = userAnswers.reduce((count, answer, index) => {
      return answer === questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    
    return {
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-4 pt-4 pb-2 bg-brightpair-50">
          <DialogTitle className="flex items-center text-brightpair-700">
            <BookText className="mr-2 h-5 w-5 text-brightpair" />
            {topic} Quiz
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Test your knowledge on {topic} concepts
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="w-10 h-10 border-4 border-t-brightpair border-brightpair-200 border-solid rounded-md animate-spin"></div>
              <p className="mt-3 text-sm text-gray-500">Generating {topic} questions...</p>
            </div>
          ) : quizCompleted ? (
            <div className="p-4">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-md bg-brightpair-50 mb-3">
                  {calculateScore().percentage >= 70 ? (
                    <Trophy size={28} className="text-brightpair" />
                  ) : (
                    <CheckCircle size={28} className="text-brightpair" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-brightpair-700">Quiz Completed!</h3>
                
                {/* Score display with improved visualization */}
                <div className="mt-3">
                  <div className="text-3xl font-bold text-brightpair">
                    {calculateScore().percentage}%
                  </div>
                  <p className="text-sm text-gray-600">
                    You got {calculateScore().correct} of {calculateScore().total} questions correct
                  </p>
                </div>
                
                <div className="mt-3">
                  <Progress 
                    value={calculateScore().percentage} 
                    className={cn(
                      "h-2",
                      calculateScore().percentage >= 70 ? "bg-secondary [&>div]:bg-green-500" : "bg-secondary [&>div]:bg-brightpair"
                    )}
                  />
                </div>
                
                {/* Feedback based on performance */}
                <div className="mt-4 p-3 rounded-md bg-gray-50 text-sm">
                  {calculateScore().percentage >= 90 ? (
                    <p>Excellent work! You've mastered this topic.</p>
                  ) : calculateScore().percentage >= 70 ? (
                    <p>Good job! You have a solid understanding of the material.</p>
                  ) : calculateScore().percentage >= 40 ? (
                    <p>Keep practicing! You're making progress with this topic.</p>
                  ) : (
                    <p>This topic needs more review. Let's keep studying!</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={handleFinishQuiz}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  Return to Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {/* Quiz progress */}
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete</span>
              </div>
              <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-1 mb-4" />
              
              {/* Question with improved styling */}
              <div className="mb-4">
                <h3 className="text-base font-medium mb-3 text-brightpair-700">
                  {questions[currentQuestionIndex].question}
                </h3>
                
                <RadioGroup value={selectedAnswer?.toString()} className="space-y-2">
                  {questions[currentQuestionIndex].options.map((option, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center space-x-2 p-2.5 rounded-md border cursor-pointer transition-all duration-200
                      ${selectedAnswer === idx 
                        ? isAnswerSubmitted 
                          ? idx === questions[currentQuestionIndex].correctAnswer 
                            ? 'border-green-500 bg-green-50 shadow-sm' 
                            : 'border-red-500 bg-red-50 shadow-sm'
                          : 'border-brightpair bg-brightpair-50 shadow-sm' 
                        : 'border-gray-200 hover:border-brightpair-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleAnswerSelect(idx)}
                    >
                      <RadioGroupItem 
                        value={idx.toString()} 
                        id={`option-${idx}`} 
                        disabled={isAnswerSubmitted}
                        className={isAnswerSubmitted && idx === questions[currentQuestionIndex].correctAnswer ? "text-green-500" : ""}
                      />
                      <Label 
                        htmlFor={`option-${idx}`} 
                        className="flex-1 cursor-pointer text-sm"
                      >
                        {option}
                      </Label>
                      {isAnswerSubmitted && idx === questions[currentQuestionIndex].correctAnswer && (
                        <CheckCircle size={14} className="text-green-500 ml-2" />
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Action buttons with improved styling */}
              <div className="flex justify-end space-x-2 mt-4">
                {isAnswerSubmitted ? (
                  <Button 
                    onClick={handleNextQuestion}
                    className="bg-brightpair hover:bg-brightpair-600 transition-colors shadow-sm"
                    size="sm"
                  >
                    {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="bg-brightpair hover:bg-brightpair-600 transition-colors shadow-sm"
                    size="sm"
                  >
                    Submit Answer
                  </Button>
                )}
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
