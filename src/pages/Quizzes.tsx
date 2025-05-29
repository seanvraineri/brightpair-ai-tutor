import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  getAvailableQuizzes,
  getQuizHistory,
  Quiz,
  QuizQuestion,
  QuizRow,
} from "@/services/quizService";
import QuizGenerator from "@/components/quizzes/QuizGenerator";
import QuizUploader from "@/components/quizzes/QuizUploader";
import AdaptiveQuiz from "@/components/quizzes/AdaptiveQuiz";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IS_DEVELOPMENT } from "@/config/env";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/contexts/UserContext";
import { logger } from '@/services/logger';

// Rename the old quiz interfaces to avoid conflicts
interface LegacyQuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LegacyQuiz {
  id: string;
  title: string;
  subject: string;
  questions: LegacyQuizQuestion[];
  created_at?: string;
  completed_at?: string;
  score?: number;
}

const Quizzes: React.FC = () => {
  const { toast } = useToast();
  const [activeQuiz, setActiveQuiz] = useState<LegacyQuiz | null>(null);
  const [quizMode, setQuizMode] = useState<
    "browse" | "taking" | "results" | "adaptive"
  >("browse");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [newQuizTopic, setNewQuizTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizResults, setQuizResults] = useState<
    {
      score: number;
      totalQuestions: number;
      correctAnswers: number;
    } | null
  >(null);

  // New state for adaptive quiz
  const [adaptiveQuiz, setAdaptiveQuiz] = useState<Quiz | null>(null);

  const [availableQuizzes, setAvailableQuizzes] = useState<LegacyQuiz[]>([]);
  const [quizHistory, setQuizHistory] = useState<LegacyQuiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);

  const { user } = useUser();

  const isLoading = isLoadingQuizzes;

  const startQuiz = (quiz: LegacyQuiz) => {
    setActiveQuiz(quiz);
    setQuizMode("taking");
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (activeQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate results
      if (!activeQuiz) return;

      const correctAnswers = userAnswers.reduce((count, answer, index) => {
        if (answer === activeQuiz.questions[index].correctAnswer) {
          return count + 1;
        }
        return count;
      }, 0);

      const score = Math.round(
        (correctAnswers / activeQuiz.questions.length) * 100,
      );

      setQuizResults({
        score,
        totalQuestions: activeQuiz.questions.length,
        correctAnswers,
      });

      setQuizMode("results");
    }
  };

  const generateNewQuiz = () => {
    if (!newQuizTopic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic for your new quiz",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate API call to GPT-4
    setTimeout(() => {
      toast({
        title: "Quiz Generated!",
        description:
          `A new quiz on ${newQuizTopic} has been created with 5 questions.`,
      });
      setIsGenerating(false);
      setNewQuizTopic("");
    }, 2000);
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setAdaptiveQuiz(null);
    setQuizMode("browse");
    setUserAnswers([]);
    setQuizResults(null);
  };

  // Handler for when a new adaptive quiz is generated
  const handleQuizGenerated = (quiz: Quiz) => {
    setAdaptiveQuiz(quiz);
    setQuizMode("adaptive");
  };

  // Handler for when the adaptive quiz is completed
  const handleAdaptiveQuizComplete = () => {
    exitQuiz();
  };

  // Transform DB row to LegacyQuiz format
  const transformRow = (row: QuizRow): LegacyQuiz => {
    // quiz_json may be stored as an object or a stringified JSON.
    const raw = typeof row.quiz_json === "string"
      ? (() => {
        try {
          return JSON.parse(row.quiz_json);
        } catch {
          return {};
        }
      })()
      : (row.quiz_json as any) ?? {};

    const questions = Array.isArray(raw.questions) ? raw.questions : [];

    return {
      id: row.id,
      title: raw.title || "Untitled Quiz",
      subject: raw.subject || "General",
      questions: questions as LegacyQuizQuestion[],
      created_at: row.created_at,
      completed_at: row.completed_at ?? undefined,
      score: raw.score ?? undefined,
    };
  };

  // Fetch quizzes from Supabase
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user?.id) return;
      setIsLoadingQuizzes(true);
      try {
        const [avail, history] = await Promise.all([
          getAvailableQuizzes(user.id),
          getQuizHistory(user.id),
        ]);
        setAvailableQuizzes(avail.map(transformRow));
        setQuizHistory(history.map(transformRow));
      } catch (error) {
      logger.debug('Caught error:', error);
        
      
    } finally {
        setIsLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, [user?.id]);

  const renderBrowseMode = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Available Quizzes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading
                ? (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                )
                : availableQuizzes.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <BookOpen className="h-10 w-10 mb-2" />
                    <p>No quizzes available yet.</p>
                  </div>
                )
                : (
                  availableQuizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="p-4 border rounded-md hover:border-brightpair hover:bg-brightpair-50 transition-colors cursor-pointer"
                      onClick={() => startQuiz(quiz)}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <h3 className="font-medium">{quiz.title}</h3>
                          <p className="text-sm text-gray-500">
                            {quiz.subject} • {quiz.questions.length} questions
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-brightpair hover:bg-brightpair-600 text-white border"
                        >
                          Start
                        </Button>
                      </div>
                    </div>
                  ))
                )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quiz History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading
                ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                )
                : quizHistory.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Clock className="h-10 w-10 mb-2" />
                    <p>No quiz history yet.</p>
                  </div>
                )
                : (
                  quizHistory.map((quiz) => {
                    const questionCount = quiz.questions.length;
                    const completedDate = quiz.completed_at
                      ? new Date(quiz.completed_at).toLocaleDateString()
                      : "";
                    const scoreVal = quiz.score ?? 0;
                    return (
                      <div key={quiz.id} className="p-4 border rounded">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <h3 className="font-medium">{quiz.title}</h3>
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{completedDate}</span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="text-lg font-semibold">
                              {scoreVal}%
                            </div>
                            <p className="text-xs text-gray-500">
                              {Math.round(scoreVal / 100 * questionCount)} of
                              {" "}
                              {questionCount} correct
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={scoreVal} className="h-2" />
                        </div>
                      </div>
                    );
                  })
                )}

              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
                >
                  View All Quiz History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="topic">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="topic" className="flex-1">
                Generate from Topic
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex-1">
                Generate from Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topic">
              <QuizGenerator onQuizGenerated={handleQuizGenerated} />
            </TabsContent>

            <TabsContent value="upload">
              <QuizUploader onQuizGenerated={handleQuizGenerated} />
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quiz Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-brightpair-50 p-2 rounded-md mr-3 flex-shrink-0">
                    <Calendar size={16} className="text-brightpair" />
                  </div>
                  <div>
                    <h4 className="font-medium">Regular Practice</h4>
                    <p className="text-sm text-gray-600">
                      Regular quizzing helps reinforce learning and improves
                      long-term retention.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-brightpair-50 p-2 rounded-md mr-3 flex-shrink-0">
                    <BookOpen size={16} className="text-brightpair" />
                  </div>
                  <div>
                    <h4 className="font-medium">Review Mistakes</h4>
                    <p className="text-sm text-gray-600">
                      After each quiz, review any questions you missed to
                      strengthen your understanding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-brightpair-50 p-2 rounded-md mr-3 flex-shrink-0">
                    <FileText size={16} className="text-brightpair" />
                  </div>
                  <div>
                    <h4 className="font-medium">Upload Your Material</h4>
                    <p className="text-sm text-gray-600">
                      Upload your own study notes or materials to create custom
                      quizzes tailored to what you're studying.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderTakingQuizMode = () => {
    if (!activeQuiz) return null;

    const currentQuestion = activeQuiz.questions[currentQuestionIndex];
    const hasAnswered = userAnswers[currentQuestionIndex] !== null;

    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">{activeQuiz.title}</h2>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of{" "}
              {activeQuiz.questions.length}
            </p>
          </div>
          <Button variant="outline" onClick={exitQuiz}>Exit Quiz</Button>
        </div>

        <Progress
          value={(currentQuestionIndex / activeQuiz.questions.length) * 100}
          className="h-2 mb-8"
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={userAnswers[currentQuestionIndex]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-md border ${
                    userAnswers[currentQuestionIndex] === index
                      ? "border-brightpair bg-brightpair-50"
                      : "border-gray-200"
                  }`}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                  />
                  <Label
                    className="flex-1 cursor-pointer"
                    htmlFor={`option-${index}`}
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleNextQuestion}
              disabled={!hasAnswered}
              className="bg-brightpair hover:bg-brightpair-600"
            >
              {currentQuestionIndex === activeQuiz.questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderResultsMode = () => {
    if (!activeQuiz || !quizResults) return null;

    return (
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-md bg-brightpair-50 mb-4">
                <Award size={40} className="text-brightpair" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
              <p className="text-gray-600">
                You scored {quizResults.score}% ({quizResults.correctAnswers} of
                {" "}
                {quizResults.totalQuestions} correct)
              </p>
            </div>

            <div className="my-6">
              <Progress value={quizResults.score} className="h-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-500">Questions</p>
                <p className="text-xl font-semibold">
                  {quizResults.totalQuestions}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-500">Correct</p>
                <p className="text-xl font-semibold text-green-600">
                  {quizResults.correctAnswers}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded">
                <p className="text-sm text-gray-500">Incorrect</p>
                <p className="text-xl font-semibold text-red-600">
                  {quizResults.totalQuestions - quizResults.correctAnswers}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Button
                onClick={exitQuiz}
                variant="outline"
                className="w-full sm:w-auto bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
              >
                Return to Quizzes
              </Button>
              <Button className="bg-brightpair hover:bg-brightpair-600 text-white w-full sm:w-auto border">
                Review Answers
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
              >
                <Sparkles size={16} className="mr-2" />
                Create Flashcards
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-brightpair-50 p-4 rounded-md mb-4">
          <div className="flex items-start">
            <div className="p-2 bg-white rounded-md mr-3">
              <Sparkles size={16} className="text-brightpair" />
            </div>
            <div>
              <h3 className="font-medium">AI Tutor Feedback</h3>
              <p className="text-sm">
                You did well with algebraic manipulation, but might need more
                practice with factoring expressions. I've prepared some
                additional exercises focused on this area.
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeQuiz.questions.map((question, qIndex) => {
                const userAnswer = userAnswers[qIndex];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={qIndex}
                    className="border rounded-md overflow-hidden"
                  >
                    <div
                      className={`p-4 ${
                        isCorrect ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Question {qIndex + 1}</h3>
                        {isCorrect
                          ? (
                            <span className="flex items-center text-green-600 text-sm font-medium">
                              <CheckCircle size={16} className="mr-1" /> Correct
                            </span>
                          )
                          : (
                            <span className="flex items-center text-red-600 text-sm font-medium">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                              </svg>
                              Incorrect
                            </span>
                          )}
                      </div>
                      <p>{question.question}</p>
                    </div>

                    <div className="p-4 border-t">
                      <div className="mb-3">
                        <p className="text-sm font-medium">Your answer:</p>
                        <p
                          className={userAnswer !== null
                            ? (isCorrect ? "text-green-600" : "text-red-600")
                            : "text-gray-500"}
                        >
                          {userAnswer !== null
                            ? question.options[userAnswer]
                            : "No answer provided"}
                        </p>
                      </div>

                      {!isCorrect && (
                        <div className="mb-3">
                          <p className="text-sm font-medium">Correct answer:</p>
                          <p className="text-green-600">
                            {question.options[question.correctAnswer]}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-medium">Explanation:</p>
                        <p className="text-gray-600 whitespace-pre-line">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {quizMode === "browse" && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display mb-1">
                  Quizzes
                </h1>
                <p className="text-gray-600">
                  Test your knowledge and track your progress
                </p>
              </div>
            </div>
            {renderBrowseMode()}
          </>
        )}

        {quizMode === "taking" && renderTakingQuizMode()}
        {quizMode === "results" && renderResultsMode()}

        {quizMode === "adaptive" && adaptiveQuiz && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Adaptive Quiz</h1>
              <Button variant="outline" onClick={exitQuiz}>Exit Quiz</Button>
            </div>
            <AdaptiveQuiz
              quiz={adaptiveQuiz}
              onQuizComplete={handleAdaptiveQuizComplete}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Quizzes;
