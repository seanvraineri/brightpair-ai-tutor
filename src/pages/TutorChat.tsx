
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Trash, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
    
    if (input.includes("help") || input.includes("stuck")) {
      return `I can see you might be feeling stuck, and that's completely normal when learning new concepts. Let's break this down into smaller steps that match your visual learning style. Would you like me to create a diagram or show you a step-by-step process with visual cues?`;
    }
    
    return `I understand you're a visual learner preparing for the SAT, so let's approach this with some clear examples and diagrams. Based on what you've shared, would you like me to help you with algebra concepts or something else? I can create some practice problems that match your learning style.`;
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

  const formatMessage = (content: string) => {
    // Replace line breaks with <br> tags
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="h-screen flex flex-col pt-6 md:pt-8 px-4 md:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display">Your AI Tutor</h1>
            <p className="text-gray-600">Personalized for Emma's visual learning style</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearChat}>
              <Trash size={16} className="mr-2" />
              Clear Chat
            </Button>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Save Notes
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto pb-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-brightpair text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="text-sm">{formatMessage(message.content)}</div>
                  <div
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-white border border-gray-200">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-brightpair-300 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-brightpair-500 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-brightpair-700 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <div className="mt-4">
            <form onSubmit={handleSendMessage} className="relative">
              <Input
                placeholder="Ask your AI tutor a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pr-24 py-6"
                disabled={isLoading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  <Plus size={18} />
                  <span className="sr-only">Add attachment</span>
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 bg-brightpair hover:bg-brightpair-600"
                  disabled={!input.trim() || isLoading}
                >
                  <Send size={16} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </form>
            <div className="mt-2 text-xs text-gray-500 text-center">
              Your AI tutor is personalized for your learning style and goals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;
