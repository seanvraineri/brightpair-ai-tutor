import React from "react";
import { QuizQuestion as QuizQuestionType } from "@/services/quizService";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PrettyMath from "@/components/ui/PrettyMath";

interface QuizQuestionProps {
  question: QuizQuestionType;
  userAnswer: string;
  answerFeedback?: {
    isCorrect: boolean;
    explanation: string;
  } | null;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  userAnswer,
  answerFeedback,
  onAnswerChange,
  onSubmit,
  questionNumber,
  totalQuestions,
}) => {
  // Check if content contains math expressions
  const containsMath = (text: string) => 
    text.includes('$') || 
    text.includes('^') || 
    text.includes('\\frac') || 
    text.includes('\\sqrt') ||
    text.includes('\\int') ||
    text.includes('\\sum') ||
    text.includes('\\lim') ||
    (text.includes('=') && 
      (text.includes('^') || 
       text.includes('_') || 
       text.includes('sqrt') || 
       text.includes('frac')));

  // Render content with math support
  const renderMathContent = (content: string, displayMode: boolean = false) => {
    if (containsMath(content)) {
      return <PrettyMath latex={content} displayMode={displayMode} />;
    }
    
    return content;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-between">
          <span className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm text-gray-500">
            {question.difficulty === "easy" ? "Easy" : 
             question.difficulty === "med" ? "Medium" : "Hard"}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            {renderMathContent(question.stem)}
          </h3>
          
          {/* Multiple choice questions */}
          {question.type === "mcq" && question.choices && (
            <RadioGroup
              value={userAnswer}
              onValueChange={onAnswerChange}
              className="space-y-3"
              disabled={!!answerFeedback}
            >
              {question.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center space-x-2 p-3 rounded-md
                    ${!!answerFeedback && index.toString() === question.answer
                      ? "bg-green-50 border border-green-200"
                      : !!answerFeedback && userAnswer === index.toString() && index.toString() !== question.answer
                      ? "bg-red-50 border border-red-200"
                      : "hover:bg-gray-50 border border-gray-200"
                    }
                  `}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${questionNumber}-${index}`}
                  />
                  <Label
                    htmlFor={`option-${questionNumber}-${index}`}
                    className="flex-grow cursor-pointer"
                  >
                    {renderMathContent(choice)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Short answer questions */}
          {question.type === "short" && (
            <div className="mb-4">
              <Input
                placeholder="Enter your answer"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={!!answerFeedback}
                className="w-full"
              />
            </div>
          )}

          {/* LaTeX questions */}
          {question.type === "latex" && (
            <div className="mb-4">
              <Input
                placeholder="Enter your answer (LaTeX format)"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={!!answerFeedback}
                className="font-mono w-full"
              />
              {userAnswer && (
                <div className="mt-2 p-2 border rounded-md bg-gray-50">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <PrettyMath latex={userAnswer} />
                </div>
              )}
            </div>
          )}

          {/* Cloze questions */}
          {question.type === "cloze" && (
            <div className="mb-4">
              <Input
                placeholder="Fill in the blank"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                disabled={!!answerFeedback}
                className="w-full"
              />
            </div>
          )}

          {/* Feedback after answering */}
          {answerFeedback && (
            <div
              className={`mt-4 p-4 rounded-md ${
                answerFeedback.isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <h4
                className={`font-medium mb-2 ${
                  answerFeedback.isCorrect ? "text-green-700" : "text-red-700"
                }`}
              >
                {answerFeedback.isCorrect ? "Correct!" : "Incorrect"}
              </h4>
              <div className="text-gray-700">
                {renderMathContent(answerFeedback.explanation)}
              </div>
            </div>
          )}

          {/* Submit button */}
          {!answerFeedback && (
            <Button
              onClick={onSubmit}
              disabled={!userAnswer.trim()}
              className="w-full mt-4 bg-brightpair hover:bg-brightpair-600 text-white"
            >
              Submit Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion; 