import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Quiz,
  QuizQuestion,
  submitQuizAnswer,
  updateSkillMastery,
} from "@/services/quizService";
import PrettyMath from "@/components/ui/PrettyMath";

interface AdaptiveQuizProps {
  quiz: Quiz;
  onQuizComplete: () => void;
}

const AdaptiveQuiz: React.FC<AdaptiveQuizProps> = (
  { quiz, onQuizComplete },
) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    new Array(quiz.quiz.length).fill(""),
  );
  const [answerFeedback, setAnswerFeedback] = useState<
    {
      isCorrect: boolean;
      explanation: string;
    } | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const { toast } = useToast();
  const { user } = useUser();

  const currentQuestion = quiz.quiz[currentQuestionIndex];

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = value;
    setUserAnswers(newAnswers);
    // Clear feedback when answer changes
    setAnswerFeedback(null);
  };

  const handleSubmitAnswer = async () => {
    const answer = userAnswers[currentQuestionIndex];

    if (!answer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the answer for grading
      const result = await submitQuizAnswer(
        answer,
        currentQuestion.id,
        currentQuestion,
      );

      // Update UI with feedback
      setAnswerFeedback({
        isCorrect: result.is_correct,
        explanation: result.explanation,
      });

      // If answer is correct, increment the count
      if (result.is_correct) {
        setCorrectAnswersCount((prev) => prev + 1);
      }

      // Update the user's mastery level in the database
      if (
        user && (user as any)?.id && result.tool_calls &&
        result.tool_calls.length > 0
      ) {
        const toolCall = result.tool_calls[0];
        if (toolCall.name === "updateSkill" && toolCall.arguments) {
          await updateSkillMastery(
            (user as any).id,
            toolCall.arguments.skill_id,
            toolCall.arguments.delta,
          );
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "Submission Error",
        description: error instanceof Error
          ? error.message
          : "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    // Move to the next question if there is one
    if (currentQuestionIndex < quiz.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswerFeedback(null);
    } else if (!isCompleted) {
      // Quiz completed
      setIsCompleted(true);
      toast({
        title: "Quiz Completed!",
        description:
          `You got ${correctAnswersCount} out of ${quiz.quiz.length} questions correct.`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswerFeedback(null);
    }
  };

  const renderQuestionContent = (question: QuizQuestion) => {
    return (
      <div className="mb-6">
        <div className="text-lg mb-4">
          <PrettyMath latex={question.stem} />
        </div>

        {/* For multiple choice questions */}
        {question.type === "mcq" && question.choices && (
          <RadioGroup
            value={userAnswers[currentQuestionIndex]}
            onValueChange={handleAnswerChange}
            className="space-y-3"
            disabled={!!answerFeedback}
          >
            {question.choices.map((choice, idx) => (
              <div
                key={idx}
                className={`flex items-center space-x-2 p-3 rounded-md border 
                  ${
                  answerFeedback
                    ? idx.toString() === question.answer
                      ? "bg-green-50 border-green-200"
                      : userAnswers[currentQuestionIndex] === idx.toString() &&
                          !answerFeedback.isCorrect
                      ? "bg-red-50 border-red-200"
                      : "border-gray-200"
                    : userAnswers[currentQuestionIndex] === idx.toString()
                    ? "border-brightpair bg-brightpair-50"
                    : "border-gray-200"
                }`}
              >
                <RadioGroupItem
                  value={idx.toString()}
                  id={`option-${idx}`}
                />
                <Label
                  className="flex-1 cursor-pointer"
                  htmlFor={`option-${idx}`}
                >
                  <PrettyMath latex={choice} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {/* For short answer questions */}
        {question.type === "short" && (
          <div className="mb-4">
            <Input
              placeholder="Enter your answer"
              value={userAnswers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={!!answerFeedback}
              className="font-mono"
            />
          </div>
        )}

        {/* For LaTeX questions */}
        {question.type === "latex" && (
          <div className="mb-4">
            <Input
              placeholder="Enter your answer (LaTeX format)"
              value={userAnswers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={!!answerFeedback}
              className="font-mono"
            />
            <div className="mt-2 p-2 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Preview:</p>
              <PrettyMath
                latex={userAnswers[currentQuestionIndex] ||
                  "\\text{Your answer will appear here}"}
              />
            </div>
          </div>
        )}

        {/* For cloze questions */}
        {question.type === "cloze" && (
          <div className="mb-4">
            <Input
              placeholder="Fill in the blank"
              value={userAnswers[currentQuestionIndex]}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={!!answerFeedback}
            />
          </div>
        )}
      </div>
    );
  };

  const renderFeedback = () => {
    if (!answerFeedback) return null;

    return (
      <div
        className={`p-4 mb-4 rounded-md ${
          answerFeedback.isCorrect ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div className="flex items-start">
          {answerFeedback.isCorrect
            ? (
              <CheckCircle
                className="text-green-600 mt-1 mr-2 flex-shrink-0"
                size={20}
              />
            )
            : (
              <AlertCircle
                className="text-red-600 mt-1 mr-2 flex-shrink-0"
                size={20}
              />
            )}
          <div>
            <p className="font-medium">
              {answerFeedback.isCorrect ? "Correct!" : "Incorrect"}
            </p>
            <p className="text-sm mt-1">
              {answerFeedback.explanation}
            </p>
            {!answerFeedback.isCorrect && currentQuestion.type === "mcq" && (
              <p className="text-sm mt-2 font-medium">
                Correct answer:{" "}
                <PrettyMath
                  latex={currentQuestion.choices
                    ?.[parseInt(currentQuestion.answer)] || ""}
                />
              </p>
            )}
            {!answerFeedback.isCorrect && currentQuestion.type !== "mcq" && (
              <p className="text-sm mt-2 font-medium">
                Correct answer: <PrettyMath latex={currentQuestion.answer} />
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isCompleted) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-md bg-brightpair-50 mb-4">
              <div className="text-2xl font-bold text-brightpair">
                {Math.round((correctAnswersCount / quiz.quiz.length) * 100)}%
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
            <p className="text-gray-600">
              You answered {correctAnswersCount} out of {quiz.quiz.length}{" "}
              questions correctly.
            </p>
          </div>

          <div className="mb-6">
            <Progress
              value={(correctAnswersCount / quiz.quiz.length) * 100}
              className="h-3"
            />
          </div>

          {/* Skill improvement section */}
          <div className="bg-brightpair-50 p-4 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Skill Progress Updated</h3>
            <p className="text-sm">
              Your mastery of these skills has been updated based on your quiz
              performance. Continue practicing to further improve your
              understanding.
            </p>
          </div>

          <div className="mt-6">
            <Button
              onClick={onQuizComplete}
              className="w-full bg-brightpair hover:bg-brightpair-600"
            >
              Return to Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestionIndex + 1} of {quiz.quiz.length}
          </CardTitle>
          <div className="text-sm font-medium px-2 py-1 bg-gray-100 rounded">
            {currentQuestion.difficulty === "easy"
              ? "Easy"
              : currentQuestion.difficulty === "med"
              ? "Medium"
              : "Hard"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Progress
          value={(currentQuestionIndex / quiz.quiz.length) * 100}
          className="h-2 mb-6"
        />

        {renderQuestionContent(currentQuestion)}
        {renderFeedback()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
        >
          <ChevronLeft className="mr-1" size={16} />
          Previous
        </Button>

        <div>
          {!answerFeedback
            ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!userAnswers[currentQuestionIndex] || isSubmitting}
                className="bg-brightpair hover:bg-brightpair-600 text-white border"
              >
                {isSubmitting ? "Checking..." : "Submit Answer"}
              </Button>
            )
            : (
              <Button
                onClick={handleNext}
                className="bg-brightpair hover:bg-brightpair-600 text-white border"
              >
                {currentQuestionIndex === quiz.quiz.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
                <ChevronRight className="ml-1" size={16} />
              </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdaptiveQuiz;
