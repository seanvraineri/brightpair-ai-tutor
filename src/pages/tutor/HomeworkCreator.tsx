import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Upload, FileText, Image, BookOpen, Sparkles, RefreshCw, Save, Calendar, ChevronLeft } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Mock student data
const MOCK_STUDENTS = [
  {
    id: 'student-1',
    full_name: 'Emma Johnson',
    grade_level: '8th',
    subject: 'Mathematics'
  },
  {
    id: 'student-2',
    full_name: 'Noah Williams',
    grade_level: '5th',
    subject: 'Science'
  },
  {
    id: 'student-3',
    full_name: 'Michael Chen',
    grade_level: '6th',
    subject: 'Science'
  }
];

// Form schema validation
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Homework title is required.",
  }),
  description: z.string().optional(),
  subject: z.string({
    required_error: "Please select a subject.",
  }),
  dueDate: z.string({
    required_error: "Due date is required.",
  }),
  students: z.array(z.string()).min(1, {
    message: "Please select at least one student.",
  }),
  personalize: z.boolean().default(true),
  difficulty: z.string().default('medium'),
  instructions: z.string().optional(),
});

type UploadedFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
};

const HomeworkCreator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTab, setCurrentTab] = useState<'upload' | 'create' | 'ai'>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [preselectedStudentId, setPreselectedStudentId] = useState<string | null>(null);
  
  // Check for studentId in URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const studentId = params.get('studentId');
    const template = params.get('template');
    
    if (studentId) {
      setPreselectedStudentId(studentId);
      form.setValue('students', [studentId]);
      
      // Find the student to get their info
      const student = MOCK_STUDENTS.find(s => s.id === studentId);
      if (student) {
        form.setValue('subject', student.subject);
      }
    }
    
    // If template is specified, prefill with template content
    if (template) {
      let templatePrompt = '';
      
      if (template === 'math') {
        templatePrompt = 'Create a mathematics homework assignment with algebraic equations and word problems';
        form.setValue('subject', 'Mathematics');
      } else if (template === 'reading') {
        templatePrompt = 'Create a reading comprehension assignment with questions about the text';
        form.setValue('subject', 'English');
      } else if (template === 'vocabulary') {
        templatePrompt = 'Create a vocabulary practice assignment with definitions and usage examples';
        form.setValue('subject', 'English');
      }
      
      if (templatePrompt) {
        setAiPrompt(templatePrompt);
        setCurrentTab('ai');
        
        // Auto-generate after a short delay
        setTimeout(() => {
          generateHomework();
        }, 500);
      }
    }
  }, [location.search]);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      personalize: true,
      difficulty: "medium",
      instructions: "",
      students: [],
    },
  });
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
    
    // Clear input value so the same file can be added again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Remove uploaded file
  const removeFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
  };
  
  // Generate homework with AI
  const generateHomework = async () => {
    try {
      setIsGenerating(true);
      
      // For demonstration, simulating AI homework generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const values = form.getValues();
      const subjectValue = values.subject;
      const difficultyValue = values.difficulty;
      const promptText = aiPrompt || `Create a ${difficultyValue} level ${subjectValue} homework assignment`;
      
      // Sample AI-generated content based on subject
      let sampleContent = '';
      if (subjectValue === 'Mathematics') {
        sampleContent = `# ${difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)} Mathematics Practice Problems\n\n`;
        sampleContent += "## Algebra Section\n\n";
        sampleContent += "1. Solve for x: 3x + 7 = 22\n";
        sampleContent += "2. If f(x) = 2x² - 3x + 4, find f(2)\n";
        sampleContent += "3. Solve the system of equations:\n   x + y = 5\n   2x - y = 1\n\n";
        sampleContent += "## Geometry Section\n\n";
        sampleContent += "4. Find the area of a triangle with base 8 cm and height 6 cm\n";
        sampleContent += "5. Calculate the circumference of a circle with radius 5 units (use π ≈ 3.14)\n\n";
        sampleContent += "## Word Problems\n\n";
        sampleContent += "6. A train travels at 60 mph. How long will it take to travel 240 miles?\n";
        sampleContent += "7. If a shirt costs $25 and is on sale for 20% off, what is the final price?\n";
      } else if (subjectValue === 'Science') {
        sampleContent = `# ${difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)} Science Assignment\n\n`;
        sampleContent += "## Biology Questions\n\n";
        sampleContent += "1. Describe the process of photosynthesis\n";
        sampleContent += "2. Name three organelles found in an animal cell and describe their functions\n";
        sampleContent += "3. Explain how DNA replication works\n\n";
        sampleContent += "## Chemistry Section\n\n";
        sampleContent += "4. Balance this chemical equation: H₂ + O₂ → H₂O\n";
        sampleContent += "5. Define the difference between an acid and a base\n\n";
        sampleContent += "## Experiment\n\n";
        sampleContent += "6. Design a simple experiment to test the effect of light on plant growth. Include:\n";
        sampleContent += "   - Hypothesis\n";
        sampleContent += "   - Materials needed\n";
        sampleContent += "   - Procedure\n";
        sampleContent += "   - How you would record and analyze results\n";
      } else {
        sampleContent = `# ${difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)} Homework Assignment\n\n`;
        sampleContent += "## Questions\n\n";
        sampleContent += "1. Question 1 about " + subjectValue + "\n";
        sampleContent += "2. Question 2 about " + subjectValue + "\n";
        sampleContent += "3. Question 3 about " + subjectValue + "\n\n";
        sampleContent += "## Tasks\n\n";
        sampleContent += "4. Task 1 related to " + subjectValue + "\n";
        sampleContent += "5. Task 2 related to " + subjectValue + "\n\n";
        sampleContent += "## Project\n\n";
        sampleContent += "6. Create a project that demonstrates your understanding of " + subjectValue + "\n";
      }
      
      // Set form values
      form.setValue('title', `${subjectValue} Homework - ${new Date().toLocaleDateString()}`);
      form.setValue('description', `${difficultyValue.charAt(0).toUpperCase() + difficultyValue.slice(1)} level homework for ${subjectValue}`);
      
      // Set content
      setGeneratedContent(sampleContent);
      
    } catch (error) {
      console.error('Error generating homework:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call 
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitting homework assignment:', {
        ...values,
        files: uploadedFiles,
        content: generatedContent
      });
      
      // In a real app, this would save to Supabase or your backend
      
      // Success notification
      alert('Homework assignment created successfully!');
      
      // If we came from student detail page, go back there
      if (preselectedStudentId) {
        navigate(`/tutor/student/${preselectedStudentId}?tab=homework`);
      } else {
        // Otherwise, go to dashboard homework tab
        navigate('/tutor/dashboard?tab=students');
      }
      
    } catch (error) {
      console.error('Error creating homework:', error);
      alert('Failed to create homework. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="ghost" 
              className="flex items-center"
              onClick={() => preselectedStudentId 
                ? navigate(`/tutor/student/${preselectedStudentId}`) 
                : navigate('/tutor/dashboard?tab=students')
              }
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {preselectedStudentId 
                ? "Back to Student Profile" 
                : "Back to Dashboard"
              }
            </Button>
          </div>
          
          <h1 className="text-2xl font-bold">
            {preselectedStudentId && MOCK_STUDENTS.find(s => s.id === preselectedStudentId)
              ? `Create Homework for ${MOCK_STUDENTS.find(s => s.id === preselectedStudentId)?.full_name}`
              : "Create Homework Assignment"
            }
          </h1>
          <p className="text-gray-500">Create a new homework assignment for your students</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>
              Fill out the information for the new homework assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Algebra Equations Practice" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Science">Science</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Art">Art</SelectItem>
                            <SelectItem value="Music">Music</SelectItem>
                            <SelectItem value="Physical Education">Physical Education</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Foreign Language">Foreign Language</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of the assignment"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <DatePicker 
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date.toISOString().split('T')[0])} 
                            minDate={new Date()}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="students"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Assign to Students</FormLabel>
                        <FormDescription>
                          Select which students will receive this assignment
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {MOCK_STUDENTS.map((student) => (
                          <FormField
                            key={student.id}
                            control={form.control}
                            name="students"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={student.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(student.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, student.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== student.id
                                              )
                                            )
                                      }}
                                      disabled={preselectedStudentId !== null && student.id !== preselectedStudentId}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="text-sm font-normal">
                                      {student.full_name}
                                    </FormLabel>
                                    <p className="text-xs text-muted-foreground">
                                      {student.grade_level} - {student.subject}
                                    </p>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="personalize"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Personalize for each student
                        </FormLabel>
                        <FormDescription>
                          Use AI to adapt content difficulty and examples to each student's learning style and pace
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Homework Content</h3>
                  
                  <Tabs defaultValue="upload" onValueChange={(v) => setCurrentTab(v as any)}>
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="upload" className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </TabsTrigger>
                      <TabsTrigger value="create" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Manually
                      </TabsTrigger>
                      <TabsTrigger value="ai" className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="upload" className="space-y-4">
                      <div 
                        className={`border-2 border-dashed rounded-md p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer ${uploadedFiles.length > 0 ? 'mb-4' : ''}`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDFs, Word documents, images (Max 10MB each)</p>
                        </div>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-3">
                          <Label>Uploaded Files</Label>
                          {uploadedFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between border rounded-md p-3">
                              <div className="flex items-center">
                                {file.type.startsWith('image/') ? (
                                  <Image className="h-5 w-5 text-gray-500 mr-2" />
                                ) : (
                                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                                )}
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => removeFile(file.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="pt-4">
                        <FormField
                          control={form.control}
                          name="instructions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Instructions for uploaded content</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Add instructions for how students should approach the uploaded files..."
                                  className="min-h-[100px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="create" className="space-y-4">
                      <Label htmlFor="homework-content">Create Assignment Content</Label>
                      <Textarea 
                        id="homework-content"
                        placeholder="Enter homework assignment content here..."
                        className="min-h-[300px] font-mono"
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Tip: You can use markdown formatting for better structure (e.g., # for headings, * for lists)
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="ai" className="space-y-4">
                      <div className="mb-4">
                        <Label htmlFor="ai-prompt">AI Generation Prompt</Label>
                        <Textarea 
                          id="ai-prompt"
                          placeholder="Enter a prompt for the AI to generate homework content..."
                          className="min-h-[100px]"
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Example: "Create a practice worksheet on linear equations" or "Generate 5 reading comprehension questions about mythology"
                        </p>
                      </div>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={isGenerating || !form.getValues().subject}
                        onClick={generateHomework}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Homework
                          </>
                        )}
                      </Button>
                      
                      {generatedContent && (
                        <div className="mt-4">
                          <Label htmlFor="generated-content">Generated Content</Label>
                          <Textarea 
                            id="generated-content"
                            className="min-h-[300px] font-mono"
                            value={generatedContent}
                            onChange={(e) => setGeneratedContent(e.target.value)}
                          />
                          <div className="flex justify-end mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateHomework}
                              disabled={isGenerating}
                            >
                              <RefreshCw className="h-3 w-3 mr-2" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => preselectedStudentId 
                      ? navigate(`/tutor/student/${preselectedStudentId}`) 
                      : navigate('/tutor/dashboard?tab=students')
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Create Assignment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HomeworkCreator; 