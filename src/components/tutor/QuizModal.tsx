
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";

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
  
  // Mock quiz data - in a real app, this would come from the AI
  const [questions, setQuestions] = useState<QuizQuestion[]>([
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
  ]);

  // Simulate loading quiz questions
  React.useEffect(() => {
    if (open) {
      setIsLoading(true);
      // Reset state when the modal opens
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setUserAnswers(Array(questions.length).fill(null));
      setQuizCompleted(false);
      
      // Simulate API call delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [open, questions.length]);

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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{topic} Quiz</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-t-brightpair border-brightpair-200 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Generating quiz questions...</p>
          </div>
        ) : quizCompleted ? (
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-brightpair-50 mb-4">
                <CheckCircle size={32} className="text-brightpair" />
              </div>
              <h3 className="text-xl font-bold">Quiz Completed!</h3>
              
              {/* Score display */}
              <div className="mt-4">
                <div className="text-3xl font-bold text-brightpair">
                  {calculateScore().percentage}%
                </div>
                <p className="text-gray-600">
                  {calculateScore().correct} of {calculateScore().total} correct
                </p>
              </div>
              
              <div className="mt-4">
                <Progress value={calculateScore().percentage} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleFinishQuiz}
                className="bg-brightpair hover:bg-brightpair-600"
              >
                Return to Chat
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            {/* Quiz progress */}
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% complete</span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-1 mb-6" />
            
            {/* Question */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{questions[currentQuestionIndex].question}</h3>
              
              <RadioGroup value={selectedAnswer?.toString()} className="space-y-3">
                {questions[currentQuestionIndex].options.map((option, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer
                    ${selectedAnswer === idx 
                      ? isAnswerSubmitted 
                        ? idx === questions[currentQuestionIndex].correctAnswer 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-red-500 bg-red-50'
                        : 'border-brightpair bg-brightpair-50' 
                      : 'border-gray-200'
                    }`}
                    onClick={() => handleAnswerSelect(idx)}
                  >
                    <RadioGroupItem 
                      value={idx.toString()} 
                      id={`option-${idx}`} 
                      disabled={isAnswerSubmitted}
                    />
                    <Label 
                      htmlFor={`option-${idx}`} 
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                    {isAnswerSubmitted && idx === questions[currentQuestionIndex].correctAnswer && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Action buttons */}
            <div className="flex justify-end space-x-2">
              {isAnswerSubmitted ? (
                <Button 
                  onClick={handleNextQuestion}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-brightpair hover:bg-brightpair-600"
                >
                  Submit Answer
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;
