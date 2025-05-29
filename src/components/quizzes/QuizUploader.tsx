import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, FileEdit, FileText, FileX, Upload } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  generateQuiz,
  getStudentMastery,
  getTopicPassages,
  Quiz,
} from "@/services/quizService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/contexts/UserTypes";

interface QuizUploaderProps {
  onQuizGenerated: (quiz: Quiz) => void;
}

const QuizUploader: React.FC<QuizUploaderProps> = ({ onQuizGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");
  const [inputMethod, setInputMethod] = useState<"file" | "notes">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Check file type and size
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/msword", // doc
        "text/plain",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
        "application/vnd.ms-powerpoint", // ppt
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description:
            "Please upload a PDF, Word document, text file, or PowerPoint",
          variant: "destructive",
        });
        return;
      }

      // 10MB limit
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    // Validate based on the selected input method
    if (inputMethod === "file" && !file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (inputMethod === "notes" && !notes.trim()) {
      toast({
        title: "Notes required",
        description: "Please enter some notes to process",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      setIsProcessing(true);

      // Get the student's mastery data
      const studentSnapshot = user && user.id
        ? await getStudentMastery(user.id)
        : null;

      // Mock processing the document/notes
      const contentToProcess = inputMethod === "file"
        ? `Content from ${file?.name}`
        : notes;

      // Generate the quiz using the existing quiz service
      const quiz = await generateQuiz(
        studentSnapshot || {
          student_id: "anonymous",
          name: "Guest",
          learning_style: "visual",
          goals: ["Improve knowledge"],
          lowest_mastery: [{
            skill_id: "general",
            name: "General Knowledge",
            mastery: 0.5,
          }],
          current_track: { id: "general", name: "General" },
          deadline_days: 30,
        },
        contentToProcess,
        "med", // default difficulty
      );

      setIsProcessing(false);

      toast({
        title: "Quiz Generated Successfully",
        description:
          `Created a quiz with ${quiz.quiz.length} questions based on your ${
            inputMethod === "file" ? "document" : "notes"
          }`,
      });

      // Pass the generated quiz to the parent component
      onQuizGenerated(quiz);

      // Reset the form
      setFile(null);
      setNotes("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error
          ? error.message
          : "Failed to generate quiz from your content",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">
          Generate Quiz from Material
        </h2>
        <div className="space-y-4">
          <Tabs
            defaultValue="file"
            onValueChange={(value) => setInputMethod(value as "file" | "notes")}
          >
            <TabsList className="w-full mb-2">
              <TabsTrigger value="file" className="flex-1">
                <Upload size={16} className="mr-2" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">
                <FileEdit size={16} className="mr-2" />
                Type or Paste Notes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Study Material</Label>

                {!file
                  ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, TXT, PPT (Max 10MB)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.doc,.txt,.pptx,.ppt"
                        onChange={handleFileChange}
                      />
                    </div>
                  )
                  : (
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-brightpair mr-3" />
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                          disabled={isUploading || isProcessing}
                        >
                          <FileX className="h-5 w-5 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            </TabsContent>

            <TabsContent value="notes">
              <div className="space-y-2">
                <Label htmlFor="notes-input">Enter Your Study Notes</Label>
                <Textarea
                  id="notes-input"
                  placeholder="Paste or type your notes here... Include key concepts, definitions, and facts you want to be quizzed on."
                  className="min-h-[200px] resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isUploading || isProcessing}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="pt-2">
            <Button
              onClick={handleUpload}
              disabled={(inputMethod === "file" && !file) ||
                (inputMethod === "notes" && !notes.trim()) ||
                isUploading ||
                isProcessing}
              className="w-full bg-brightpair hover:bg-brightpair-600 text-white border"
            >
              {isProcessing
                ? "Generating Quiz..."
                : isUploading
                ? "Uploading..."
                : "Generate Quiz from Content"}
            </Button>
          </div>

          <div className="bg-brightpair-50 p-4 rounded">
            <div className="flex items-start">
              <CheckCircle size={18} className="text-brightpair mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-sm">
                  AI-Powered Quiz Generation
                </p>
                <p className="text-sm text-gray-600">
                  Upload your study materials and our AI will generate a
                  customized quiz to test your understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizUploader;
