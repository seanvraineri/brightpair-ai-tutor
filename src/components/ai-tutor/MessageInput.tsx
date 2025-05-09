
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Plus } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { BookOpen } from "lucide-react";

interface TutorFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  tutorFunctions: TutorFunction[];
  tutorFunctionOpen: boolean;
  setTutorFunctionOpen: (open: boolean) => void;
  onTutorFunctionClick: (functionId: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  tutorFunctions,
  tutorFunctionOpen,
  setTutorFunctionOpen,
  onTutorFunctionClick
}) => {
  const [input, setInput] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
      <form onSubmit={handleSubmit} className="relative">
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
                    onClick={() => onTutorFunctionClick(func.id)}
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
  );
};

export default MessageInput;
