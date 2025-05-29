import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Info,
  Lightbulb,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { IS_DEVELOPMENT } from "@/config/env";
import { toast } from "@/hooks/use-toast";
import { logger } from '@/services/logger';

interface Student {
  id: string;
  full_name: string;
  grade_level: string;
  subject: string;
}

interface Parent {
  id: string;
  full_name: string;
  email: string;
  relationship: string;
  student_id: string;
  student_name: string;
}

interface Template {
  id: string;
  title: string;
  template_type: string;
  content: string;
  tone: string;
}

interface AIEnhancement {
  original: string;
  enhanced: string;
  tone: string;
  explanation: string;
}

interface MessageComposerProps {
  studentId?: string;
  parentId?: string;
  initialSubject?: string;
  initialMessage?: string;
  onMessageSent?: () => void;
}

// Mock data for development
const MOCK_PARENTS: Parent[] = [
  {
    id: "parent-1",
    full_name: "Alex Johnson",
    email: "alex.johnson@example.com",
    relationship: "Father",
    student_id: "student-1",
    student_name: "Emma Johnson",
  },
  {
    id: "parent-2",
    full_name: "Madison Johnson",
    email: "madison.johnson@example.com",
    relationship: "Mother",
    student_id: "student-1",
    student_name: "Emma Johnson",
  },
  {
    id: "parent-3",
    full_name: "Taylor Williams",
    email: "taylor.williams@example.com",
    relationship: "Mother",
    student_id: "student-2",
    student_name: "Noah Williams",
  },
];

const MOCK_STUDENTS: Student[] = [
  {
    id: "student-1",
    full_name: "Emma Johnson",
    grade_level: "8th",
    subject: "Mathematics",
  },
  {
    id: "student-2",
    full_name: "Noah Williams",
    grade_level: "5th",
    subject: "Science",
  },
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "template-1",
    title: "Progress Update",
    template_type: "progress",
    content:
      "Dear [parent_name],\n\nI wanted to provide an update on [student_name]'s recent progress in [subject]. [Student_pronoun] has been working on [topic] and has shown [positive_trait].\n\nIn our recent sessions, we've focused on [focus_area], and I've noticed [observation]. Moving forward, we'll be continuing to work on [next_steps].\n\nPlease let me know if you have any questions or concerns.\n\nBest regards,\n[tutor_name]",
    tone: "professional",
  },
  {
    id: "template-2",
    title: "Homework Reminder",
    template_type: "homework",
    content:
      "Hi [parent_name],\n\nJust a friendly reminder about [student_name]'s homework assignments for this week. [Student_pronoun] should be working on [assignment_details] which is due on [due_date].\n\nThis assignment will help reinforce our work on [topic] from our recent sessions.\n\nPlease encourage [student_name] to reach out if [student_pronoun] has any questions!\n\nThanks,\n[tutor_name]",
    tone: "friendly",
  },
  {
    id: "template-3",
    title: "Session Scheduling",
    template_type: "scheduling",
    content:
      "Hello [parent_name],\n\nI need to make a slight adjustment to our upcoming tutoring session with [student_name] that was scheduled for [original_date_time].\n\nI would like to propose rescheduling to [proposed_date_time]. Please let me know if this works for your family's schedule.\n\nIf this time doesn't work, please suggest some alternatives that would be convenient for you.\n\nThank you for your flexibility.\n\nRegards,\n[tutor_name]",
    tone: "formal",
  },
];

// Mock AI response for development
const MOCK_AI_ENHANCE = (
  originalMessage: string,
  tone: string,
): Promise<AIEnhancement> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const enhancements: Record<string, AIEnhancement> = {
        "professional": {
          original: originalMessage,
          enhanced: originalMessage.replace(
            "I wanted to provide an update on Emma's recent progress in Mathematics.",
            "I am pleased to provide you with a comprehensive update regarding Emma's recent academic progress in Mathematics.",
          ).replace(
            "She has been working on",
            "Emma has been diligently focusing on",
          ).replace(
            "Moving forward",
            "As we progress in our educational journey",
          ),
          tone: "professional",
          explanation:
            "Enhanced with more formal language and professional tone appropriate for academic progress updates. Added specific details about the student's achievements and clear next steps.",
        },
        "friendly": {
          original: originalMessage,
          enhanced: originalMessage.replace(
            "I wanted to provide an update on Emma's recent progress in Mathematics.",
            "I thought I'd share some great news about how Emma's doing in her Math work!",
          ).replace(
            "She has been working on",
            "She's been tackling",
          ).replace(
            "Moving forward",
            "Looking ahead",
          ),
          tone: "friendly",
          explanation:
            "Made the message warmer and more conversational while maintaining professionalism. Used more approachable language and added encouraging phrases.",
        },
        "casual": {
          original: originalMessage,
          enhanced: originalMessage.replace(
            "I wanted to provide an update on Emma's recent progress in Mathematics.",
            "Hey there! Just wanted to loop you in on how Emma's math skills are coming along.",
          ).replace(
            "She has been working on",
            "She's been getting into",
          ).replace(
            "Moving forward",
            "Going forward",
          ),
          tone: "casual",
          explanation:
            "Transformed the message to be more casual and conversational. Used shorter sentences and more everyday language while still covering all the important points.",
        },
      };

      resolve(
        enhancements[tone] || {
          original: originalMessage,
          enhanced: originalMessage,
          tone: tone,
          explanation: "The message was kept in its original form.",
        },
      );
    }, 1500);
  });
};

const MessageComposer: React.FC<MessageComposerProps> = ({
  studentId,
  parentId,
  initialSubject = "",
  initialMessage = "",
  onMessageSent,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [enhancingMessage, setEnhancingMessage] = useState(false);

  const [selectedStudentId, setSelectedStudentId] = useState(studentId || "");
  const [selectedParentId, setSelectedParentId] = useState(parentId || "");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState(initialMessage);
  const [useAI, setUseAI] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("friendly");

  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [aiEnhancement, setAiEnhancement] = useState<AIEnhancement | null>(
    null,
  );
  const [usesEnhanced, setUsesEnhanced] = useState(false);

  // Trigger to use the enhanced message when available
  useEffect(() => {
    if (aiEnhancement && usesEnhanced) {
      setMessage(aiEnhancement.enhanced);
    }
  }, [aiEnhancement, usesEnhanced]);

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // For development and production, use mock data
        // until we properly set up the database schema
        await new Promise((resolve) => setTimeout(resolve, 800));

        setStudents(MOCK_STUDENTS);

        // If studentId is provided, filter parents for this student
        if (studentId) {
          setParents(
            MOCK_PARENTS.filter((parent) => parent.student_id === studentId),
          );
        } else {
          setParents(MOCK_PARENTS);
        }

        setTemplates(MOCK_TEMPLATES);
      } catch (error) {
      logger.debug('Caught error:', error);
      
    } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // When student selection changes, filter parents
  useEffect(() => {
    if (selectedStudentId) {
      setParents(
        MOCK_PARENTS.filter((parent) =>
          parent.student_id === selectedStudentId
        ),
      );

      // If there's only one parent, select them automatically
      const filteredParents = MOCK_PARENTS.filter((parent) =>
        parent.student_id === selectedStudentId
      );
      if (filteredParents.length === 1) {
        setSelectedParentId(filteredParents[0].id);
      } else {
        setSelectedParentId("");
      }
    } else {
      setParents(MOCK_PARENTS);
      setSelectedParentId("");
    }
  }, [selectedStudentId]);

  // When template selection changes, populate the message
  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate);
      if (template) {
        const selectedStudent = students.find((s) =>
          s.id === selectedStudentId
        );
        const selectedParent = parents.find((p) => p.id === selectedParentId);

        let populatedContent = template.content;

        if (selectedStudent) {
          populatedContent = populatedContent
            .replace(/\[student_name\]/g, selectedStudent.full_name)
            .replace(/\[subject\]/g, selectedStudent.subject)
            .replace(/\[student_pronoun\]/g, "they") // In a real app, would use actual pronouns
            .replace(/\[topic\]/g, selectedStudent.subject)
            .replace(/\[focus_area\]/g, selectedStudent.subject)
            .replace(/\[next_steps\]/g, "developing core skills");
        }

        if (selectedParent) {
          populatedContent = populatedContent.replace(
            /\[parent_name\]/g,
            selectedParent.full_name,
          );
        }

        populatedContent = populatedContent
          .replace(/\[tutor_name\]/g, "Dr. Michael Chen") // Would be dynamic in real app
          .replace(/\[original_date_time\]/g, "Tuesday at 4:00 PM")
          .replace(/\[proposed_date_time\]/g, "Wednesday at 4:30 PM")
          .replace(/\[assignment_details\]/g, "the practice problems")
          .replace(/\[due_date\]/g, "Friday")
          .replace(/\[observation\]/g, "significant improvement")
          .replace(/\[positive_trait\]/g, "great enthusiasm");

        setMessage(populatedContent);
        setSelectedTone(template.tone);

        // Set a default subject based on template type
        if (!subject) {
          setSubject(
            template.title + ` for ${selectedStudent?.full_name || ""}`,
          );
        }
      }
    }
  }, [
    selectedTemplate,
    selectedStudentId,
    selectedParentId,
    subject,
    students,
    parents,
    templates,
  ]);

  // Enhance with AI
  const enhanceMessage = async () => {
    if (!message) return;

    try {
      setEnhancingMessage(true);
      setAiEnhancement(null);

      // In a production app, call your AI service
      // For now, we'll use a mock function
      const enhancement = await MOCK_AI_ENHANCE(message, selectedTone);

      setAiEnhancement(enhancement);
      setUsesEnhanced(true);
    } catch (error) {
      logger.debug('Caught error:', error);
    
    } finally {
      setEnhancingMessage(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!selectedParentId || !subject || !message) return;

    try {
      setSendingMessage(true);

      // Simulate API call for both dev and production
      // until we properly set up the database schema
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message sent",
        description: `Message sent to ${
          getParentName(selectedParentId)
        } about ${getStudentName(selectedStudentId || "")}`,
      });

      // Call success callback
      if (onMessageSent) {
        onMessageSent();
      }

      // Reset form
      setSubject("");
      setMessage("");
      setAiEnhancement(null);

      setSendingMessage(false);
    } catch (error) {
      setSendingMessage(false);

      // Show error message
      toast({
        title: "Error Sending Message",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  // Save as template
  const saveAsTemplate = async () => {
    if (!message || !subject) return;

    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast({
        title: "Template Saved",
        description: "Your template was saved successfully.",
        variant: "default",
      });
    } catch (error) {
      // Show error message
      toast({
        title: "Error Saving Template",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get a student name by ID
  const getStudentName = (id: string) => {
    const student = students.find((s) => s.id === id);
    return student ? student.full_name : "";
  };

  // Get a parent name by ID
  const getParentName = (id: string) => {
    const parent = parents.find((p) => p.id === id);
    return parent ? parent.full_name : "";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Compose Message</CardTitle>
        <CardDescription>
          Send a personalized message to parent
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading
          ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-brightpair" />
            </div>
          )
          : (
            <>
              {/* Student & Parent Selection */}
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* Student Selection */}
                <div className="space-y-2">
                  <Label htmlFor="student">Student</Label>
                  <Select
                    value={selectedStudentId}
                    onValueChange={setSelectedStudentId}
                    disabled={!!studentId || students.length === 0}
                  >
                    <SelectTrigger id="student">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name} - {student.grade_level} Grade
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Parent Selection */}
                <div className="space-y-2">
                  <Label htmlFor="parent">Parent</Label>
                  <Select
                    value={selectedParentId}
                    onValueChange={setSelectedParentId}
                    disabled={!selectedStudentId || !!parentId ||
                      parents.length === 0}
                  >
                    <SelectTrigger id="parent">
                      <SelectValue placeholder="Select a parent" />
                    </SelectTrigger>
                    <SelectContent>
                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.full_name} ({parent.relationship})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter message subject"
                />
              </div>

              {/* Template & AI Section */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="font-medium">Message Assistant</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">AI Enhancement</span>
                    <Switch
                      checked={useAI}
                      onCheckedChange={setUseAI}
                    />
                  </div>
                </div>

                <Tabs defaultValue="templates" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="templates" className="flex-1">
                      Templates
                    </TabsTrigger>
                    <TabsTrigger value="tone" className="flex-1">
                      Tone & Style
                    </TabsTrigger>
                    {aiEnhancement && (
                      <TabsTrigger value="ai-suggestions" className="flex-1">
                        AI Suggestions
                        <Badge className="ml-2 bg-brightpair text-white">
                          New
                        </Badge>
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {/* Templates Tab */}
                  <TabsContent value="templates" className="py-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {templates.map((template) => (
                          <Button
                            key={template.id}
                            variant={selectedTemplate === template.id
                              ? "default"
                              : "outline"}
                            onClick={() => setSelectedTemplate(template.id)}
                            className="justify-start h-auto py-2 px-3"
                          >
                            <div className="text-left">
                              <div className="font-medium">
                                {template.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {template.template_type} • {template.tone}
                              </div>
                            </div>
                          </Button>
                        ))}

                        <Button
                          variant="outline"
                          className="justify-start h-auto py-2 px-3 border-dashed"
                        >
                          <div className="flex items-center space-x-2">
                            <UserPlus className="h-4 w-4" />
                            <span>Create New</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tone & Style Tab */}
                  <TabsContent value="tone" className="py-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                        {["friendly", "professional", "casual", "formal"].map((
                          tone,
                        ) => (
                          <Button
                            key={tone}
                            variant={selectedTone === tone
                              ? "default"
                              : "outline"}
                            onClick={() => setSelectedTone(tone)}
                            className="justify-start h-auto py-2 px-3"
                          >
                            <div className="text-left capitalize">
                              {tone}
                            </div>
                          </Button>
                        ))}
                      </div>

                      {useAI && (
                        <div className="flex justify-end">
                          <Button
                            onClick={enhanceMessage}
                            disabled={enhancingMessage || !message ||
                              !selectedTone}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            {enhancingMessage
                              ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Enhancing...
                                </>
                              )
                              : (
                                <>
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Enhance Message
                                </>
                              )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* AI Suggestions Tab */}
                  {aiEnhancement && (
                    <TabsContent value="ai-suggestions" className="py-2">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-2 text-sm bg-amber-50 border border-amber-200 rounded-md p-3">
                          <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800">
                              AI Enhancement Explanation
                            </p>
                            <p className="text-gray-600 mt-1">
                              {aiEnhancement.explanation}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant={usesEnhanced ? "default" : "outline"}
                            onClick={() =>
                              setUsesEnhanced(true)}
                            className={usesEnhanced
                              ? "bg-brightpair hover:bg-brightpair-600"
                              : ""}
                          >
                            Use Enhanced
                          </Button>
                          <Button
                            variant={!usesEnhanced ? "default" : "outline"}
                            onClick={() => {
                              setUsesEnhanced(false);
                              setMessage(aiEnhancement.original);
                            }}
                          >
                            Use Original
                          </Button>
                          <div className="flex-1"></div>
                          <Button
                            variant="outline"
                            onClick={enhanceMessage}
                            disabled={enhancingMessage}
                            className="flex items-center"
                          >
                            <RefreshCw
                              className={`h-4 w-4 mr-2 ${
                                enhancingMessage ? "animate-spin" : ""
                              }`}
                            />
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="message">Message</Label>
                  {selectedStudentId && selectedParentId && (
                    <div className="text-sm text-gray-500">
                      To: {getParentName(selectedParentId)}
                      <span className="mx-1">•</span>
                      Re: {getStudentName(selectedStudentId)}
                    </div>
                  )}
                </div>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message here..."
                  className="min-h-[200px]"
                />
              </div>
            </>
          )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={saveAsTemplate}
                  disabled={loading || !message}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save as template</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Info className="h-3 w-3" />
                  <span>All messages are logged for your records</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>A copy of all messages is saved to your account history</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              // In a real app, this would navigate back or cancel
              if (confirm("Discard this message?")) {
                navigate("/tutor/messages");
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={sendMessage}
            disabled={sendingMessage || !selectedParentId || !subject ||
              !message}
            className="bg-brightpair hover:bg-brightpair-600"
          >
            {sendingMessage
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              )
              : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageComposer;
