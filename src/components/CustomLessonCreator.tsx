import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomLesson } from '@/hooks/useCustomLesson';
import { Loader2, UploadCloud, FileText, Book, File } from 'lucide-react';

const difficultyOptions = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
];

export function CustomLessonCreator() {
  const { generateCustomLesson, isGenerating, isUploading } = useCustomLesson();
  const [activeTab, setActiveTab] = useState('notes');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [focus, setFocus] = useState('');
  const [learningGoal, setLearningGoal] = useState('');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  // Handle file drop
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title || !topic || (activeTab === 'notes' && !notes) || (activeTab === 'upload' && !file)) {
      // Show error or toast notification
      return;
    }
    
    // Call the hook to generate the lesson
    generateCustomLesson({
      title,
      topic,
      text: activeTab === 'notes' ? notes : undefined,
      file: activeTab === 'upload' ? file || undefined : undefined,
      difficulty,
      focus: focus || undefined,
      learningGoal: learningGoal || undefined,
    });
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Custom Lesson</CardTitle>
        <CardDescription>
          Upload your notes, documents, or PDFs to generate a personalized lesson
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                placeholder="Enter a title for your lesson"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic">Main Topic</Label>
              <Input
                id="topic"
                placeholder="E.g., Calculus, World History"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="focus">Focus Area (Optional)</Label>
              <Input
                id="focus"
                placeholder="E.g., Chain Rule, WWII"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="learningGoal">Learning Goal (Optional)</Label>
            <Input
              id="learningGoal"
              placeholder="What do you want to learn from this material?"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <FileText size={16} /> Type Notes
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <UploadCloud size={16} /> Upload File
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="space-y-2 mt-4">
              <Label htmlFor="notes">Your Notes</Label>
              <Textarea
                id="notes"
                placeholder="Type or paste your notes here..."
                className="min-h-[200px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4 mt-4">
              <div
                className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
              >
                {file ? (
                  <div className="flex flex-col items-center justify-center">
                    <File size={40} className="mb-2 text-primary" />
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <UploadCloud size={40} className="mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Drag & drop a file or click to browse</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports PDF, Word, and plain text files
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => {
            setTitle('');
            setTopic('');
            setNotes('');
            setFile(null);
            setDifficulty('medium');
            setFocus('');
            setLearningGoal('');
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}>
            Reset
          </Button>
          
          <Button type="submit" disabled={isGenerating || isUploading}>
            {(isGenerating || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            <Book className="mr-2 h-4 w-4" />
            Generate Lesson
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 