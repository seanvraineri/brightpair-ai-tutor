
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Plus, Trash, Download, FileText, MessageSquare, Mic, Sparkles, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAITutor } from "@/hooks/useAITutor";
import { useUser } from "@/contexts/UserContext";

interface TutorFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const AITutorChat: React.FC = () => {
  const { user } = useUser();
  const { messages, sendMessage, clearConversation, isLoading } = useAITutor();
  const [input, setInput] = useState<string>("");
  const [notesDialogOpen, setNotesDialogOpen] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [tutorFunctionOpen, setTutorFunctionOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = `Hi${user?.name ? ' ' + user.name : ''}! I'm your personal AI tutor. I'm here to help you with your studies. How can I assist you today?`;
      sendMessage("Hello");
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Predefined tutor functions with improved icons and descriptions
  const tutorFunctions: TutorFunction[] = [
    {
      id: "upload-notes",
      name: "Upload Notes",
      description: "Share your notes for personalized help",
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
      description: "Learn through voice conversation (coming soon)",
      icon: <Mic className="h-5 w-5" />,
    },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput("");
  };

  const handleTutorFunctionClick = (functionId: string) => {
    setTutorFunctionOpen(false);
    switch(functionId) {
      case "upload-notes":
        setNotesDialogOpen(true);
        break;
      case "talk":
        handlePresetMessage("Let's talk about the concepts I'm currently studying.");
        break;
      case "voice-chat":
        // Future feature
        break;
      default:
        break;
    }
  };

  const handlePresetMessage = (message: string) => {
    setInput(message);
  };

  const handleSubmitNotes = async () => {
    if (!noteContent.trim()) return;
    
    await sendMessage(`I've uploaded my notes on the following material:\n\n${noteContent}`);
    setNotesDialogOpen(false);
    setNoteContent("");
  };

  // Format message with improved handling of formatting
  const formatMessage = (content: string) => {
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
            {user?.gamification?.learningStyle && (
              <p className="text-gray-600">Personalized for your {user.gamification.learningStyle} learning style</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearConversation} className="text-xs">
              <Trash size={14} className="mr-1" />
              Clear
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download size={14} className="mr-1" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Quick Action Buttons */}
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
        
        {/* Chat container */}
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
          
          {/* Input area */}
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

      {/* Notes Upload Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">Upload Your Notes</DialogTitle>
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
    </div>
  );
};

export default AITutorChat;
