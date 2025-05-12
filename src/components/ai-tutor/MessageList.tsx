import React, { useRef, useEffect } from "react";
import ChatMarkdown from "@/components/ui/ChatMarkdown";

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Force scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <div 
      ref={containerRef} 
      className="flex-1 p-4 overflow-y-auto h-full max-h-[calc(100vh-180px)]"
      style={{ scrollbarWidth: 'thin' }}
    >
      <div className="space-y-4 pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-md p-3 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <div className="text-sm">
                {message.role === "user" 
                  ? message.content  // Don't use markdown for user messages
                  : <ChatMarkdown md={message.content} />}
              </div>
              <div
                className={`text-xs mt-2 ${
                  message.role === "user" ? "text-white/80" : "text-gray-500"
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
            <div className="max-w-[85%] rounded-md p-3 bg-gray-100">
              <div className="flex space-x-2 items-center">
                <div className="w-2 h-2 rounded-md bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-md bg-gray-400 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-md bg-gray-400 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
};

export default MessageList;
