import React, { useState } from 'react';
import { Lesson } from "@/hooks/useLesson";
import ChatMarkdown from "@/components/ui/ChatMarkdown";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, CheckCircle, Award, Brain, PenTool } from "lucide-react";
import PrettyMath from "@/components/ui/PrettyMath";

// Style overrides for math in lessons
const mathStyles = `
  .katex-display {
    margin: 1em 0 !important;
    overflow-x: auto;
    overflow-y: hidden;
  }

  .katex {
    font-size: 1.1em !important;
    line-height: 1.2 !important;
  }

  .quiz-stem .katex,
  .quiz-choice .katex {
    font-size: 1.05em !important;
  }
`;

interface LessonViewerProps {
  lesson: Lesson;
  onComplete?: (score: number) => void;
}

export default function LessonViewer({ lesson, onComplete }: LessonViewerProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const totalSections = lesson.sections.length;
  const progress = ((currentSection + 1) / totalSections) * 100;
  
  const currentContent = lesson.sections[currentSection];
  const isQuizSection = currentContent.type === "quiz";
  const isLastSection = currentSection === totalSections - 1;
  
  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };
  
  const handleSubmitQuiz = () => {
    if (!isQuizSection) return;
    
    // Calculate score
    const quizSection = currentContent as { type: "quiz", questions: any[] };
    const questions = quizSection.questions;
    
    let correctCount = 0;
    questions.forEach(question => {
      if (answers[question.id]?.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);
    
    if (onComplete) {
      onComplete(calculatedScore);
    }
  };
  
  // Helper to render math content in quiz questions and choices
  const renderMathContent = (text: string) => {
    const containsMath = text.includes('$');
    if (!containsMath) return text;
    
    // If entire text is a math expression
    if ((text.startsWith('$') && text.endsWith('$')) || 
        (text.startsWith('$$') && text.endsWith('$$'))) {
      return <PrettyMath latex={text} displayMode={text.startsWith('$$')} />;
    }
    
    // For mixed content with math
    const parts = text.split(/(\$\$[\s\S]*?\$\$)|(\$[^\$]*?\$)/g).filter(Boolean);
    return (
      <>
        {parts.map((part, i) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            return <PrettyMath key={i} latex={part} displayMode={true} />;
          }
          if (part.startsWith('$') && part.endsWith('$')) {
            return <PrettyMath key={i} latex={part} displayMode={false} />;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };
  
  const renderQuizQuestion = (question: any, index: number) => {
    const questionId = question.id;
    
    if (question.type === "mcq") {
      return (
        <div key={questionId} className="mb-6">
          <p className="font-medium mb-3 quiz-stem">{index + 1}. {renderMathContent(question.stem)}</p>
          
          <RadioGroup
            value={answers[questionId] || ""}
            onValueChange={(value) => handleAnswerChange(questionId, value)}
            disabled={quizSubmitted}
          >
            <div className="space-y-2">
              {question.choices.map((choice: string, choiceIndex: number) => (
                <div key={choiceIndex} className={`flex items-center space-x-2 p-3 rounded-md border ${
                  quizSubmitted 
                    ? choice === question.answer 
                      ? "bg-green-50 border-green-200" 
                      : answers[questionId] === choiceIndex.toString() && choice !== question.answer 
                        ? "bg-red-50 border-red-200" 
                        : "border-gray-200"
                    : answers[questionId] === choiceIndex.toString() 
                      ? "border-brightpair bg-brightpair-50" 
                      : "border-gray-200"
                }`}>
                  <RadioGroupItem 
                    value={choiceIndex.toString()} 
                    id={`q${questionId}-${choiceIndex}`}
                  />
                  <Label htmlFor={`q${questionId}-${choiceIndex}`} className="flex-1 cursor-pointer quiz-choice">
                    {renderMathContent(choice)}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
          
          {quizSubmitted && (
            <div className={`mt-3 p-3 rounded-md ${
              answers[questionId] === question.answer ? "bg-green-50" : "bg-red-50"
            }`}>
              <p className="font-medium">
                {answers[questionId] === question.answer 
                  ? "✓ Correct!" 
                  : `✗ Incorrect. The correct answer is: ${question.choices[parseInt(question.answer)]}`
                }
              </p>
            </div>
          )}
        </div>
      );
    }
    
    if (question.type === "short") {
      return (
        <div key={questionId} className="mb-6">
          <p className="font-medium mb-3 quiz-stem">{index + 1}. {renderMathContent(question.stem)}</p>
          
          <Input
            value={answers[questionId] || ""}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            disabled={quizSubmitted}
            className="w-full"
            placeholder="Enter your answer..."
          />
          
          {quizSubmitted && (
            <div className={`mt-3 p-3 rounded-md ${
              answers[questionId]?.trim().toLowerCase() === question.answer.trim().toLowerCase() 
                ? "bg-green-50" 
                : "bg-red-50"
            }`}>
              <p className="font-medium">
                {answers[questionId]?.trim().toLowerCase() === question.answer.trim().toLowerCase() 
                  ? "✓ Correct!" 
                  : <>Incorrect. The correct answer is: {renderMathContent(question.answer)}</>
                }
              </p>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  const renderSection = () => {
    if (isQuizSection) {
      const quizSection = currentContent as { type: "quiz", questions: any[] };
      
      return (
        <div>
          <h2 className="text-xl font-semibold mb-4">Self-Check Quiz</h2>
          
          {quizSection.questions.map(renderQuizQuestion)}
          
          {quizSubmitted && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-md bg-brightpair-50 mb-3">
                <span className="text-2xl font-bold text-brightpair">{score}%</span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Quiz Complete!</h3>
              <p className="text-gray-600">
                You answered {Math.round((score / 100) * quizSection.questions.length)} out of {quizSection.questions.length} questions correctly.
              </p>
            </div>
          )}
          
          {!quizSubmitted && (
            <Button 
              onClick={handleSubmitQuiz} 
              className="w-full mt-4 bg-brightpair hover:bg-brightpair-600 text-white"
              disabled={Object.keys(answers).length < quizSection.questions.length}
            >
              Submit Answers
            </Button>
          )}
        </div>
      );
    }
    
    // Regular content section with enhanced math rendering
    return (
      <div className="lesson-content">
        <style>{mathStyles}</style>
        <ChatMarkdown md={currentContent.content_md} />
      </div>
    );
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>{lesson.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              <span>{lesson.duration} min</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        
        <CardContent>
          {renderSection()}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-3">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            Previous
          </Button>
          
          {isQuizSection ? (
            quizSubmitted && (
              <Button 
                onClick={() => onComplete && onComplete(score)} 
                className="bg-brightpair hover:bg-brightpair-600 text-white"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Lesson
              </Button>
            )
          ) : (
            <Button onClick={handleNext} disabled={isLastSection}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center">
          <BookOpen className="mr-1 h-4 w-4" />
          <span>Lesson</span>
        </div>
        <div className="flex items-center">
          <PenTool className="mr-1 h-4 w-4" />
          <span>Example</span>
        </div>
        <div className="flex items-center">
          <Brain className="mr-1 h-4 w-4" />
          <span>Quiz</span>
        </div>
        <div className="flex items-center">
          <Award className="mr-1 h-4 w-4" />
          <span>Mastery</span>
        </div>
      </div>
    </div>
  );
} 