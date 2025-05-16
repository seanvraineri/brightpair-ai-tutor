import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { Homework, HomeworkGenerationParams } from "@/types/homework";
import PdfUploader from "./PdfUploader";
import PreviewModal from "./PreviewModal";
import {
  extractPdfText,
  generateHomework,
  saveHomework,
  updateHomeworkStatus,
} from "@/services/homeworkService";
import { Textarea } from "@/components/ui/textarea";

interface Student {
  id: string;
  name: string;
}

interface HomeworkGeneratorProps {
  tutorId: string;
  students: Student[];
  defaultStudentId?: string;
  onSuccess?: () => void;
}

export const HomeworkGenerator: React.FC<HomeworkGeneratorProps> = ({
  tutorId,
  students,
  defaultStudentId,
  onSuccess,
}) => {
  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>(
    defaultStudentId || "",
  );
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [dueDateTime, setDueDateTime] = useState<string>("");
  const [generatedHomework, setGeneratedHomework] = useState<Homework | null>(
    null,
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );

  // Calculate default due date (7 days from now)
  const getDefaultDueDateTime = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    // Round to nearest hour
    date.setMinutes(0, 0, 0);
    return date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };

  // Handle PDF upload completion
  const handleUploadComplete = async (url: string, file: File) => {
    setPdfUrl(url);
    try {
      // Extract text from the PDF file
      const text = await extractPdfText(file);
      if (text) {
        setPdfText(text);
      }
    } catch (error) {
      console.error("Failed to extract PDF text:", error);
    }
  };

  // Handle PDF upload error
  const handleUploadError = (errorMessage: string) => {
    console.error("PDF upload error:", errorMessage);
    // Show some error notification to the user
  };

  // Handle generate homework
  const handleGenerateHomework = async () => {
    try {
      setIsGenerating(true);

      const params: HomeworkGenerationParams = {
        tutor_id: tutorId,
        student_id: selectedStudent,
        topic: topic,
        due_date: new Date(dueDateTime || getDefaultDueDateTime())
          .toISOString(),
        notes: notes.trim() || undefined,
        num_questions: numQuestions,
        difficulty,
      };

      if (pdfUrl) {
        params.pdf_path = pdfUrl;
      }

      if (pdfText) {
        params.pdf_text = pdfText;
      }

      const homework = await generateHomework(params);
      setGeneratedHomework(homework);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error("Error generating homework:", error);
      // Show some error notification to the user
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async (homework: Homework) => {
    try {
      setIsLoading(true);
      await saveHomework(homework);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving homework:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle assign homework
  const handleAssignHomework = async (homework: Homework) => {
    try {
      setIsLoading(true);
      await updateHomeworkStatus(homework.id, "assigned");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error assigning homework:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isPdfUploaded = !!pdfUrl;
  const isFormValid = selectedStudent.length > 0 &&
    topic.trim().length > 0 &&
    (dueDateTime || getDefaultDueDateTime()).length > 0 &&
    notes.trim().length > 0;

  return (
    <>
      <Card className="shadow-md border-none">
        <CardHeader className="bg-brightpair/5 rounded-t-lg">
          <CardTitle className="text-brightpair">
            Create Personalized Homework
          </CardTitle>
          <CardDescription>
            Generate personalized homework for{" "}
            {students.find((s) => s.id === selectedStudent)?.name ||
              "the selected student"}{" "}
            using AI. Optionally upload a PDF whose content will be turned into
            questions.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="student-select">Student</Label>
              <Select
                value={selectedStudent}
                onValueChange={setSelectedStudent}
                defaultValue=""
              >
                <SelectTrigger id="student-select">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pdf-upload">
                Upload Study Material (Optional)
              </Label>
              <PdfUploader
                onUploadComplete={handleUploadComplete}
                onUploadStart={() => {}}
                onError={handleUploadError}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic / Objective</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Quadratic Equations or 'Practice on mixed fractions'"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty-select">Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(val) => setDifficulty(val as any)}
              >
                <SelectTrigger id="difficulty-select">
                  <SelectValue placeholder="Medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num-questions">Number of Questions</Label>
              <Input
                id="num-questions"
                type="number"
                min={1}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Homework Details / Instructions</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what you want included or focus areas for this student..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due-datetime">Due Date & Time</Label>
              <Input
                id="due-datetime"
                type="datetime-local"
                value={dueDateTime || getDefaultDueDateTime()}
                onChange={(e) => setDueDateTime(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="py-4">
          <Button
            onClick={handleGenerateHomework}
            disabled={isGenerating || !isFormValid}
            className="w-full bg-brightpair hover:bg-brightpair-600 text-white"
          >
            {isGenerating
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              )
              : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate AI Homework
                </>
              )}
          </Button>
        </CardFooter>
      </Card>

      {generatedHomework && (
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          homework={generatedHomework}
          onSave={handleSaveDraft}
          onAssign={handleAssignHomework}
        />
      )}
    </>
  );
};

export default HomeworkGenerator;
