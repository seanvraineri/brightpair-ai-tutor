
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import "katex/dist/katex.min.css";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  formatMessage: (content: string) => React.ReactNode;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, formatMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <ScrollArea className="flex-1 p-4">
      <style>
        {`
          .math-content {
            font-family: 'Merriweather', serif;
            line-height: 1.6;
            padding: 0.25rem 0;
            letter-spacing: 0.01em;
          }
          
          .katex-display {
            margin: 0.75rem 0;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0.25rem;
          }
          
          .katex {
            font-size: 1.1rem;
            line-height: 1.3;
          }
          
          .quadratic-formula {
            background-color: #f5f8ff;
            border-radius: 0.375rem;
            padding: 0.75rem;
            margin: 0.75rem 0;
            border-left: 3px solid #4263eb;
          }
        `}
      </style>
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
                  ? "bg-gradient-to-r from-brightpair-500 to-brightpair-600 text-white font-sans"
                  : "bg-white border border-gray-200 font-tutor"
              }`}
            >
              <div className={`text-sm leading-relaxed ${message.role === "assistant" ? "math-content" : ""}`}>{formatMessage(message.content)}</div>
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
            <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-200 shadow-sm font-tutor">
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
  );
};

export default MessageList;
