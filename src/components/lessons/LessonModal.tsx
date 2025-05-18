import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ButtonPrimary from "@/components/ButtonPrimary";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, CheckCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import LessonContent from "./LessonContent";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";

interface LessonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
  onComplete?: () => void;
}

const LessonModal: React.FC<LessonModalProps> = (
  { open, onOpenChange, lessonId, onComplete },
) => {
  const { user } = useUser();
  const [lesson, setLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (!open) return;
    const fetchLesson = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();
      if (!error) setLesson(data);
      setLoading(false);
    };
    fetchLesson();
  }, [open, lessonId]);

  const handleComplete = async () => {
    await supabase
      .from("lessons")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", lessonId);
    onComplete?.();
    onOpenChange(false);
  };

  const handleSaveNote = async () => {
    if (!user) return;
    await supabase.from("tutor_notes").insert({
      content: noteText,
      student_id: lesson?.student_id,
      tutor_id: user.id,
      lesson_id: lessonId,
    });
    setNoteText("");
    onOpenChange(false);
  };

  const lessonContentMd: string = lesson?.content_md || "No content";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2 sticky top-0 bg-white z-10 border-b">
          <div className="flex justify-between items-center mb-2">
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
            >
              {lesson?.subject}
            </Badge>
            <Badge className="flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200">
              <Clock className="h-3 w-3" />
              {lesson?.duration}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {lesson?.title}
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
                  <span>Step 1 of 1</span>
                  <span>
                    100% complete
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-brightpair rounded"
                    style={{
                      width: "100%",
                    }}
                  >
                  </div>
                </div>
              </div>

              {/* Step title */}
              <h3 className="text-lg font-semibold mb-5 text-brightpair-700">
                {lesson?.title}
              </h3>

              {/* Step content - now using LessonContent component */}
              <div className="prose prose-gray max-w-none space-y-4">
                <LessonContent
                  content={lessonContentMd}
                  className="lesson-step-content"
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                <ButtonPrimary onClick={handleComplete}>
                  Mark as Complete
                </ButtonPrimary>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="m-0 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Related Resources
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Enhance your learning with these additional materials related
                  to {lesson?.title}.
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
                        <h4 className="font-medium">
                          {lesson?.relatedHomework}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Practice problems and assignments
                        </p>
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
                        <h4 className="font-medium">
                          {lesson?.relatedFlashcards}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Key terms and concepts
                        </p>
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
                        <h4 className="font-medium">{lesson?.relatedQuiz}</h4>
                        <p className="text-sm text-gray-500">
                          Test your understanding
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Additional Materials
                </h3>
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
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                  >
                    Save Notes
                  </Button>
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
