import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Lesson, useLesson } from "@/hooks/useLesson";
import LessonViewer from "@/components/LessonViewer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Clock,
  History,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { FEATURES, IS_DEVELOPMENT } from "@/config/env";
import { Database } from "@/integrations/supabase/types";

interface PastLesson {
  id: string;
  title: string;
  skill_id?: string;
  created_at: string;
  completed_at?: string;
  skill_name?: string;
  duration: number;
  lesson_json: Lesson;
  topic?: string;
  source?: string;
}

interface LessonRecord {
  id: string;
  title: string;
  skill_id?: string;
  topic?: string;
  created_at: string;
  completed_at?: string;
  duration: number;
  lesson_json: Lesson;
  source?: string;
}

interface Skill {
  id: string;
  name: string;
  mastery: number;
  description?: string;
}

const Lessons: React.FC = () => {
  const { user, session } = useUser();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isLessonStarted, setIsLessonStarted] = useState<boolean>(false);
  const [pastLessons, setPastLessons] = useState<PastLesson[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isLoadingSkills, setIsLoadingSkills] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<PastLesson | null>(null);
  const { toast } = useToast();
  const availableTabRef = useRef<HTMLButtonElement>(null);

  // Use the React Query hook to fetch the lesson
  const lessonQuery = useLesson(
    user?.id || "anonymous",
    selectedSkill || "",
  );

  // Fetch available skills from the database
  useEffect(() => {
    const fetchAvailableSkills = async () => {
      if (!session?.user?.id) return;

      setIsLoadingSkills(true);
      try {
        // Query the student's skills with mastery and join to skills table for names
        const { data, error } = await supabase
          .from("student_skills")
          .select("skill_id, mastery_level, skills(name, description)")
          .eq("student_id", session.user.id);

        if (error) throw error;

        if (data && data.length > 0) {
          const skillsWithMastery = data.map((
            row: {
              skill_id: string;
              mastery_level: number | null;
              skills?: { name?: string; description?: string };
            },
          ) => ({
            id: row.skill_id,
            name: row.skills?.name ?? row.skill_id,
            mastery: row.mastery_level !== null
              ? Math.round(row.mastery_level * 100)
              : 0,
            description: row.skills?.description ?? undefined,
          }));

          setAvailableSkills(skillsWithMastery);
        } else {
          setAvailableSkills([]);
        }
      } catch (error) {
        console.error("Error fetching available skills:", error);

        setAvailableSkills([]);

        toast({
          title: "Error",
          description: "Failed to load available skills",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSkills(false);
      }
    };

    fetchAvailableSkills();
  }, [session?.user?.id, toast]);

  // Fetch past lessons from history
  useEffect(() => {
    const fetchPastLessons = async () => {
      if (!session?.user?.id) return;

      setIsLoadingHistory(true);
      try {
        // Query the lessons table for this student
        const { data, error } = await supabase
          .from("lessons")
          .select("*")
          .eq("student_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;

        // Transform the lessons data to include skill names from our skills array
        const transformedLessons = data.map(
          (lesson: Database["public"]["Tables"]["lessons"]["Row"]) => {
            const matchingSkill = availableSkills.find((s) =>
              s.id === lesson.track_id // Use track_id for skill matching if skill_id is not present
            );
            let lessonJson: Lesson = { title: "", duration: 0, sections: [] };
            if (lesson.content) {
              try {
                const parsed = JSON.parse(lesson.content);
                if (parsed && typeof parsed === "object") {
                  lessonJson = parsed as Lesson;
                }
              } catch {
                // fallback to empty lesson
              }
            }
            return {
              id: lesson.id,
              title: lesson.title ||
                (matchingSkill?.name
                  ? `Lesson on ${matchingSkill.name}`
                  : "Untitled Lesson"),
              skill_id: lesson.track_id, // fallback to track_id
              topic: lesson.subject,
              created_at: lesson.created_at,
              completed_at: lesson.completed_at || undefined,
              skill_name: matchingSkill?.name || lesson.subject ||
                lesson.track_id,
              duration: 0, // not present in schema, set to 0
              lesson_json: lessonJson,
              source: undefined, // not present in schema
            };
          },
        );

        setPastLessons(transformedLessons);
      } catch (error) {
        console.error("Error fetching lesson history:", error);
        toast({
          title: "Error",
          description: "Failed to load your lesson history",
          variant: "destructive",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (availableSkills.length > 0) {
      fetchPastLessons();
    }
  }, [session?.user?.id, availableSkills, toast]);

  // Handle starting a new lesson
  const handleStartLesson = (skillId: string, skillName: string) => {
    setSelectedSkill(skillId);
    setSelectedLesson(null);
    setIsLessonStarted(true);
  };

  // Handle viewing a past lesson
  const handleViewPastLesson = (lesson: PastLesson) => {
    setSelectedLesson(lesson);
    setIsLessonStarted(true);
  };

  // Handle completing a lesson
  const handleLessonComplete = (score: number) => {
    // Update the database to mark the lesson as completed
    if (selectedLesson?.id && session?.user?.id) {
      try {
        supabase
          .from("lessons")
          .update({
            completed_at: new Date().toISOString(),
            score: score,
          })
          .eq("id", selectedLesson.id)
          .then(() => {
            toast({
              title: "Lesson Completed",
              description:
                `You scored ${score}%. Your progress has been saved.`,
            });
          });
      } catch (error) {
        console.error("Error updating lesson completion:", error);
      }
    } else {
      toast({
        title: "Lesson Completed",
        description: `You scored ${score}% on the quiz.`,
      });
    }

    setIsLessonStarted(false);
    setSelectedSkill(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  // Get the source display text
  const getLessonSourceText = (lesson: PastLesson) => {
    if (lesson.source === "user_content") {
      return "Custom Content";
    }
    return lesson.skill_name || "Curriculum";
  };

  // Render the lesson selection screen
  const renderLessonSelection = () => {
    return (
      <Tabs defaultValue="history">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="history">Lesson History</TabsTrigger>
          <TabsTrigger value="available" ref={availableTabRef}>
            Available Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Lessons</CardTitle>
              <CardDescription>
                Review and continue working with lessons you've previously
                completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory
                ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                )
                : pastLessons.length > 0
                ? (
                  <div className="space-y-4">
                    {pastLessons.map((lesson: PastLesson) => (
                      <div
                        key={lesson.id}
                        className="flex flex-col md:flex-row md:items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={() => handleViewPastLesson(lesson)}
                      >
                        <div className="flex-grow mb-3 md:mb-0">
                          <h3 className="font-medium">{lesson.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {formatDate(lesson.created_at)}
                            </div>
                            {lesson.source === "user_content" && (
                              <span className="bg-brightpair bg-opacity-10 text-brightpair text-xs px-2 py-0.5 rounded-full">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                        <Button size="sm">
                          View Lesson
                        </Button>
                      </div>
                    ))}
                  </div>
                )
                : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">
                      No lesson history found. Start learning!
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        const tabElement = availableTabRef.current;
                        if (tabElement) {
                          tabElement.click();
                        }
                      }}
                    >
                      Explore Available Lessons
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="available" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingSkills
              ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))
              )
              : availableSkills.length > 0
              ? (
                <>
                  {availableSkills.map((skill) => (
                    <Card key={skill.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle>{skill.name}</CardTitle>
                        <CardDescription>
                          Mastery: {skill.mastery}%
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {skill.description ||
                            `Enhance your understanding of ${skill.name} through personalized micro-lessons.`}
                        </p>
                        <Button
                          onClick={() =>
                            handleStartLesson(skill.id, skill.name)}
                          className="w-full"
                        >
                          Start Lesson
                        </Button>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Learning tips card */}
                  <Card className="overflow-hidden border-brightpair border-opacity-50">
                    <CardHeader className="pb-2 bg-brightpair bg-opacity-5">
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-brightpair" />
                        Learning Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex">
                          <ArrowRight className="h-4 w-4 mr-2 text-brightpair mt-0.5" />
                          <span>
                            Regular practice improves retention by up to 75%
                          </span>
                        </li>
                        <li className="flex">
                          <ArrowRight className="h-4 w-4 mr-2 text-brightpair mt-0.5" />
                          <span>
                            Review completed lessons to reinforce knowledge
                          </span>
                        </li>
                        <li className="flex">
                          <ArrowRight className="h-4 w-4 mr-2 text-brightpair mt-0.5" />
                          <span>Try explaining concepts in your own words</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              )
              : (
                <div className="col-span-full text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">No lessons available</h3>
                  <p className="text-sm text-gray-500 mt-1 mb-4">
                    {IS_DEVELOPMENT
                      ? "No skills found in the database. This may be due to using a development environment."
                      : "Please check back later or contact support."}
                  </p>
                </div>
              )}
          </div>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Curriculum Lessons</h1>
        <p className="text-muted-foreground">
          Access lessons from our curriculum and track your learning progress
        </p>
      </div>

      {!isLessonStarted
        ? (
          renderLessonSelection()
        )
        : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                onClick={() => setIsLessonStarted(false)}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons
              </Button>

              <Button
                variant="default"
                onClick={() =>
                  handleLessonComplete(Math.floor(Math.random() * 40) + 60)} // For demo purposes
                className="flex items-center"
              >
                Complete Lesson
              </Button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              {lessonQuery.isLoading
                ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                )
                : selectedLesson
                ? (
                  <LessonViewer
                    lesson={selectedLesson.lesson_json}
                    onComplete={handleLessonComplete}
                  />
                )
                : lessonQuery.data && lessonQuery.data.lesson
                ? (
                  <LessonViewer
                    lesson={lessonQuery.data.lesson}
                    onComplete={handleLessonComplete}
                  />
                )
                : (
                  <div className="text-center py-8">
                    <p className="text-xl text-gray-500">
                      No lesson data available
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setIsLessonStarted(false)}
                    >
                      Go Back
                    </Button>
                  </div>
                )}
            </div>
          </div>
        )}
    </div>
  );
};

export default Lessons;
