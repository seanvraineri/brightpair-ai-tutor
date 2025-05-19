import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { BarChart, Download, Loader2, Mail, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface StudentReportGeneratorProps {
  studentId: string;
  studentName: string;
  onReportGenerated?: (reportId: string) => void;
  onCancel?: () => void;
}

interface GeneratedReport {
  id: string;
  student_id: string;
  report_date: string;
  strengths: string[];
  areas_for_improvement: string[];
  next_steps: string[];
  tutor_comments?: string;
}

// Local interface for reports table (not in generated types)
interface StudentProgressReportRow {
  id: string;
  student_id: string;
  tutor_id: string;
  report_date: string;
  strengths: string[];
  areas_for_improvement: string[];
  next_steps: string[];
  tutor_comments: string | null;
}

const StudentReportGenerator: React.FC<StudentReportGeneratorProps> = ({
  studentId,
  studentName,
  onReportGenerated,
  onCancel,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<
    GeneratedReport | null
  >(null);
  const [tutorComments, setTutorComments] = useState("");
  const [includeRecentSessions, setIncludeRecentSessions] = useState(true);
  const [includeHomework, setIncludeHomework] = useState(true);
  const [includeLearningStyle, setIncludeLearningStyle] = useState(true);
  const [emailToParent, setEmailToParent] = useState(false);

  // Mock function to simulate AI generating a report
  const generateAIReport = async () => {
    setIsGenerating(true);

    // In a real implementation, this would call your AI service
    try {
      // Fetch data about the student
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // This is a simplified example - in a real app you'd:
      // 1. Fetch recent session data, notes, and learning patterns
      // 2. Pass that data to an API endpoint that calls ChatGPT/Claude
      // 3. Process the AI response and format it for display

      // For now, we'll just wait and return mock data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulating an AI-generated report
      setGeneratedReport({
        id: `report-${Date.now()}`,
        student_id: studentId,
        report_date: new Date().toISOString(),
        strengths: [
          "Shows excellent problem-solving skills in algebraic equations",
          "Consistently completes homework assignments on time",
          "Actively participates in tutoring sessions with thoughtful questions",
        ],
        areas_for_improvement: [
          "Could benefit from additional practice with word problems",
          "Sometimes struggles with showing all steps in complex problems",
          "May need more work on geometry concepts",
        ],
        next_steps: [
          "Focus next three sessions on word problem strategies",
          "Provide additional practice worksheets on showing work step-by-step",
          "Introduce visual aids for geometry concepts",
        ],
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Failed to Generate Report",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveReport = async () => {
    if (!generatedReport) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const client = supabase as unknown as SupabaseClient<any, "public", any>;
      const { data, error } = await client
        .from("student_progress_reports")
        .insert({
          student_id: studentId,
          tutor_id: user.id,
          report_date: new Date().toISOString(),
          strengths: generatedReport.strengths,
          areas_for_improvement: generatedReport.areas_for_improvement,
          next_steps: generatedReport.next_steps,
          tutor_comments: tutorComments.trim() || null,
        })
        .select()
        .single<StudentProgressReportRow>();

      if (error) throw error;

      if (emailToParent) {
        // In a real app, you would implement email sending here
        console.log("Would send email to parent with report");
      }

      if (data && onReportGenerated) {
        onReportGenerated(data.id);
      }
    } catch (error) {
      console.error("Error saving report:", error);
      toast({
        title: "Failed to Save Report",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Generate Progress Report</CardTitle>
        <CardDescription>
          Create an AI-assisted progress report for {studentName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!generatedReport
          ? (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  About AI-Generated Reports
                </h3>
                <p className="text-sm text-blue-700">
                  The AI will analyze the student's recent sessions, notes, and
                  progress to generate a comprehensive report. You'll be able to
                  review and edit before finalizing.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Include in Analysis:</h3>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-sessions"
                    checked={includeRecentSessions}
                    onCheckedChange={setIncludeRecentSessions}
                  />
                  <Label htmlFor="include-sessions">
                    Recent tutoring sessions
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-homework"
                    checked={includeHomework}
                    onCheckedChange={setIncludeHomework}
                  />
                  <Label htmlFor="include-homework">
                    Homework completion patterns
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-style"
                    checked={includeLearningStyle}
                    onCheckedChange={setIncludeLearningStyle}
                  />
                  <Label htmlFor="include-style">
                    Learning style preferences
                  </Label>
                </div>
              </div>

              <Button
                onClick={generateAIReport}
                disabled={isGenerating}
                className="w-full bg-brightpair hover:bg-brightpair-600"
              >
                {isGenerating
                  ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Report...
                    </>
                  )
                  : (
                    <>
                      <BarChart className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
              </Button>
            </div>
          )
          : (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium">Strengths</h3>
                  <ul className="space-y-2">
                    {generatedReport.strengths.map((strength, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{strength}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Areas for Improvement</h3>
                  <ul className="space-y-2">
                    {generatedReport.areas_for_improvement.map((
                      area,
                      index,
                    ) => (
                      <li key={index} className="flex gap-2 items-start">
                        <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{area}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Recommended Next Steps</h3>
                  <ul className="space-y-2">
                    {generatedReport.next_steps.map((step, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <div className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{step}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="tutor-comments">
                  Additional Comments (Optional)
                </Label>
                <Textarea
                  id="tutor-comments"
                  placeholder="Add any additional observations or recommendations..."
                  className="min-h-[100px]"
                  value={tutorComments}
                  onChange={(e) => setTutorComments(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email-parent"
                  checked={emailToParent}
                  onCheckedChange={(checked) =>
                    setEmailToParent(checked === true)}
                />
                <Label htmlFor="email-parent">
                  Send report to parent by email
                </Label>
              </div>
            </div>
          )}
      </CardContent>

      <CardFooter className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>

        {generatedReport && (
          <Button
            disabled={isSaving}
            onClick={saveReport}
            className="bg-brightpair hover:bg-brightpair-600"
          >
            {isSaving
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              )
              : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Report
                </>
              )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudentReportGenerator;
