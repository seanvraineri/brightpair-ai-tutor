import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Trash, Download, Upload, FileText, MessageSquare, Mic, Sparkles, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuizModal from "@/components/tutor/QuizModal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TutorFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const TutorChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi Emma! I'm your personal AI tutor. I'm here to help you with your studies. How can I assist you today? Would you like to continue working on algebra?",
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Dialog states
  const [notesDialogOpen, setNotesDialogOpen] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [tutorFunctionOpen, setTutorFunctionOpen] = useState<boolean>(false);
  
  // Quiz modal state
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [quizTopic, setQuizTopic] = useState<string>("Algebra");
  
  // Mock student profile data - in a real app, this would come from your Supabase database
  const studentProfile = {
    name: "Emma",
    grade: "9th",
    learningStyle: "visual",
    subjects: ["algebra", "biology"],
    studyGoals: "Preparing for the SAT",
    motivationStyle: "praise",
    preferredTone: "calm",
  };

  // Predefined tutor functions with improved icons and descriptions
  const tutorFunctions: TutorFunction[] = [
    {
      id: "upload-notes",
      name: "Upload Notes",
      description: "Share your notes for personalized help",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      id: "quiz-me",
      name: "Quiz Me",
      description: "Test your knowledge with interactive quizzes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "talk",
      name: "Discussion",
      description: "Have an in-depth conversation about a topic",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: "voice-chat",
      name: "Voice Chat",
      description: "Learn through voice conversation",
      icon: <Mic className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // In a real implementation, here you would call your Supabase function 
      // that processes the message and calls the GPT-4o API with the personalized context
      
      // Mock GPT-4o response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: generateMockResponse(input),
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Mock response generator - in a real app, this would be GPT-4o
  const generateMockResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes("algebra") || input.includes("equation")) {
      // Visual learning style response with equations and examples
      return `Since you're a visual learner, let me show you how to solve this step by step:\n\n1️⃣ First, we identify the equation: 2x + 5 = 13\n\n2️⃣ Our goal is to isolate x by subtracting 5 from both sides:\n2x + 5 - 5 = 13 - 5\n2x = 8\n\n3️⃣ Now divide both sides by 2:\n2x ÷ 2 = 8 ÷ 2\nx = 4\n\nGreat job following along! 👍 Would you like to try another equation?`;
    }
    
    if (input.includes("biology") || input.includes("cell")) {
      // Visual learning response for biology
      return `For visual learners like you, Emma, I'll explain cell structure with a mental image. Imagine a cell as a tiny factory:\n\n🏭 The cell membrane is like the factory walls that control what goes in and out\n💻 The nucleus is like the control room containing DNA instructions\n🔋 Mitochondria are the power plants creating energy\n📦 The endoplasmic reticulum is like a delivery system moving materials\n\nDoes this help you visualize the cell structure better?`;
    }

    if (input.includes("quiz") || input.includes("test me")) {
      return `Great! Let's test your knowledge with some algebra questions tailored to your visual learning style.\n\n1️⃣ If 3x + 7 = 22, what is the value of x?\n\n2️⃣ Solve for y: 2y - 5 = 15\n\n3️⃣ If x² + 6x + 9 = 36, what are the values of x?\n\nWhenever you're ready, just send your answers and I'll check them for you!`;
    }

    if (input.includes("notes") || input.includes("upload")) {
      return `I see you want to upload your notes. That's a great way for me to understand what you're studying. Once you upload them, I can help you review the concepts, clarify any topics you find difficult, or create practice problems based on your material. What subject are your notes on?`;
    }
    
    if (input.includes("help") || input.includes("stuck")) {
      return `I can see you might be feeling stuck, and that's completely normal when learning new concepts. Let's break this down into smaller steps that match your visual learning style. Would you like me to create a diagram or show you a step-by-step process with visual cues?`;
    }
    
    return `I understand you're a visual learner preparing for the SAT, so let's approach this with some clear examples and diagrams. Based on what you've shared, would you like me to help you with algebra concepts or something else? I can create some practice problems that match your learning style.`;
  };

  const handleTutorFunctionClick = (functionId: string) => {
    setTutorFunctionOpen(false);
    switch(functionId) {
      case "upload-notes":
        setNotesDialogOpen(true);
        break;
      case "quiz-me":
        // Get more specific topic from recent messages or prompt user
        const specificTopic = determineSpecificTopic();
        setQuizTopic(specificTopic);
        setQuizModalOpen(true);
        break;
      case "talk":
        handlePresetMessage("Let's talk about the biology concepts I'm currently studying.");
        break;
      case "voice-chat":
        toast({
          title: "Voice Chat",
          description: "Voice chat functionality is coming soon!",
        });
        break;
      default:
        break;
    }
  };

  // Determine a more specific quiz topic based on recent messages
  const determineSpecificTopic = (): string => {
    // Check recent messages for specific topic mentions
    const recentMessages = messages.slice(-8);
    const topicKeywords = {
      "algebra": ["equation", "solve", "algebra", "variable", "expression", "factor"],
      "biology": ["cell", "biology", "organism", "dna", "protein"],
      "geometry": ["geometry", "triangle", "circle", "angle", "theorem"]
    };
    
    // Search for the most recent specific topic mentioned
    for (const message of recentMessages) {
      const content = message.content.toLowerCase();
      
      for (const [topic, keywords] of Object.entries(topicKeywords)) {
        for (const keyword of keywords) {
          if (content.includes(keyword)) {
            // Capitalize first letter
            return topic.charAt(0).toUpperCase() + topic.slice(1);
          }
        }
      }
    }
    
    // If no specific topic is found in messages, check student profile subjects
    return studentProfile.subjects[0].charAt(0).toUpperCase() + studentProfile.subjects[0].slice(1);
  };

  // Determine quiz topic based on recent messages or student profile
  const determineQuizTopic = (): string => {
    // Check recent messages for subject mentions
    const recentMessages = messages.slice(-5);
    for (const message of recentMessages) {
      if (message.content.toLowerCase().includes("algebra")) return "Algebra";
      if (message.content.toLowerCase().includes("biology")) return "Biology";
      if (message.content.toLowerCase().includes("geometry")) return "Geometry";
    }
    
    // Default to first subject in student profile
    return studentProfile.subjects[0].charAt(0).toUpperCase() + studentProfile.subjects[0].slice(1);
  };

  const handlePresetMessage = (message: string) => {
    setInput(message);
    // Optional: automatically send the message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Mock GPT-4o response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(message),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSubmitNotes = () => {
    if (!noteContent.trim()) {
      toast({
        title: "Empty Notes",
        description: "Please add some content to your notes.",
        variant: "destructive",
      });
      return;
    }
    
    // Add user message about notes
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `I've uploaded my notes on the following material:\n\n${noteContent}`,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNotesDialogOpen(false);
    setNoteContent("");
    setIsLoading(true);
    
    // Mock AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Thanks for sharing your notes! I've analyzed them and can help you better understand these concepts. What specific part would you like me to explain in more detail?`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const clearChat = () => {
    if (confirm("Are you sure you want to clear this conversation?")) {
      setMessages([{
        id: "1",
        role: "assistant",
        content: "Hi Emma! I'm your personal AI tutor. How can I help you today?",
        timestamp: new Date(),
      }]);
    }
  };

  // Format message with improved handling of formatting
  const formatMessage = (content: string) => {
    // Enhanced formatting for different content types (lists, equations, etc)
    return content.split('\n').map((line, i) => {
      // Highlight equations or formulas with special styling
      if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/)) {
        return (
          <div key={i} className="bg-brightpair-50 px-2 py-1 rounded my-1 font-mono text-brightpair-700">
            {line}
          </div>
        );
      }
      // Highlight numbered steps with emphasis
      else if (line.match(/^\d+[\.\)].*$/)) {
        return (
          <div key={i} className="font-medium">
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </div>
        );
      }
      // Regular text
      return (
        <React.Fragment key={i}>
          {line}
          {i < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-brightpair-50 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display flex items-center text-brightpair-700">
              <Sparkles className="mr-2 h-6 w-6 text-brightpair" />
              Your AI Tutor
            </h1>
            <p className="text-gray-600">Personalized for Emma's visual learning style</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearChat} className="text-xs">
              <Trash size={14} className="mr-1" />
              Clear
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download size={14} className="mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Quick Action Buttons - Improved layout and visual style */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tutorFunctions.map((func) => (
            <Button
              key={func.id}
              variant="outline"
              className="border-brightpair text-brightpair hover:bg-brightpair/10 transition-colors duration-200 shadow-sm"
              size="sm"
              onClick={() => handleTutorFunctionClick(func.id)}
            >
              {func.icon}
              <span className="ml-2">{func.name}</span>
            </Button>
          ))}
        </div>
        
        {/* Chat container with improved visuals */}
        <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow-md border border-gray-100">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm transition-all duration-200 animate-fade-in ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-brightpair-500 to-brightpair-600 text-white"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{formatMessage(message.content)}</div>
                    <div
                      className={`text-xs mt-2 flex justify-between items-center ${
                        message.role === "user" ? "text-white/80" : "text-gray-400"
                      }`}
                    >
                      <span className="font-medium">
                        {message.role === "assistant" ? "AI Tutor" : "You"}
                      </span>
                      <span>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-200 shadow-sm">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-brightpair-300 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-brightpair-500 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-brightpair-700 animate-pulse delay-300"></div>
                      <span className="text-sm text-gray-400 ml-2">AI Tutor is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input area with improved styling and usability */}
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
            <form onSubmit={handleSendMessage} className="relative">
              <Input
                placeholder="Ask your AI tutor a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pr-24 py-6 bg-white rounded-full shadow-sm border-gray-200 focus:border-brightpair focus:ring-brightpair"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Popover open={tutorFunctionOpen} onOpenChange={setTutorFunctionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-brightpair-50"
                      disabled={isLoading}
                    >
                      <Plus size={18} />
                      <span className="sr-only">Add attachment</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-2" align="end">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium px-2 py-1">Learning Tools</h4>
                      {tutorFunctions.map((func) => (
                        <Button
                          key={func.id}
                          variant="ghost"
                          className="w-full justify-start text-left hover:bg-brightpair-50 hover:text-brightpair"
                          onClick={() => handleTutorFunctionClick(func.id)}
                        >
                          <div className="mr-3 text-brightpair">{func.icon}</div>
                          <div>
                            <div className="font-medium">{func.name}</div>
                            <div className="text-xs text-gray-500">{func.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-brightpair hover:bg-brightpair-600 transition-colors"
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={14} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
            <div className="mt-2 text-xs text-gray-500 text-center flex items-center justify-center">
              <BookOpen size={12} className="mr-1 text-brightpair" />
              <span>Personalized for your learning style and goals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Upload Dialog with improved styling */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5 text-brightpair" />
              Upload Your Notes
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Paste your notes below and I'll analyze them to help with your studies.
            </p>
            <Textarea 
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Paste or type your notes here..."
              className="min-h-[200px] focus:border-brightpair focus:ring-brightpair"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNotes} className="bg-brightpair hover:bg-brightpair-600">
                Submit Notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Modal */}
      <QuizModal 
        open={quizModalOpen}
        onOpenChange={setQuizModalOpen}
        topic={quizTopic}
      />
    </div>
  );
};

export default TutorChat;
