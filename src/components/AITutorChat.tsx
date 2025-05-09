
import React, { useState, useEffect } from "react";
import { FileText, MessageSquare, Mic, BookOpen } from "lucide-react";
import { useAITutor } from "@/hooks/useAITutor";
import { useUser } from "@/contexts/UserContext";
import { formatMessage } from "@/utils/messageFormatters";
import ChatHeader from "@/components/ai-tutor/ChatHeader";
import QuickActions from "@/components/ai-tutor/QuickActions";
import MessageList from "@/components/ai-tutor/MessageList";
import MessageInput from "@/components/ai-tutor/MessageInput";
import NotesDialog from "@/components/ai-tutor/NotesDialog";

interface TutorFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const AITutorChat: React.FC = () => {
  const { user } = useUser();
  const { messages, sendMessage, clearConversation, isLoading } = useAITutor();
  const [notesDialogOpen, setNotesDialogOpen] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [tutorFunctionOpen, setTutorFunctionOpen] = useState<boolean>(false);
  
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
  
  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = `Hi${user?.name ? ' ' + user.name : ''}! I'm your personal AI tutor. I'm here to help you with your studies. How can I assist you today?`;
      sendMessage("Hello");
    }
  }, []);

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
    sendMessage(message);
  };

  const handleSubmitNotes = async () => {
    if (!noteContent.trim()) return;
    
    await sendMessage(`I've uploaded my notes on the following material:\n\n${noteContent}`);
    setNotesDialogOpen(false);
    setNoteContent("");
  };

  // Subtitle for chat header
  const getSubtitle = () => {
    if (user?.gamification?.learningStyle) {
      return `Personalized for your ${user.gamification.learningStyle} learning style`;
    }
    return undefined;
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-brightpair-50 overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1 p-4 md:p-6">
        <ChatHeader 
          title="Your AI Tutor"
          subtitle={getSubtitle()}
          onClear={clearConversation}
          onSave={() => {}} // Future feature
        />
        
        <QuickActions 
          tutorFunctions={tutorFunctions} 
          onFunctionClick={handleTutorFunctionClick} 
        />
        
        <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-lg shadow-md border border-gray-100">
          <MessageList 
            messages={messages}
            isLoading={isLoading}
            formatMessage={formatMessage}
          />
          
          <MessageInput 
            onSendMessage={sendMessage}
            isLoading={isLoading}
            tutorFunctions={tutorFunctions}
            tutorFunctionOpen={tutorFunctionOpen}
            setTutorFunctionOpen={setTutorFunctionOpen}
            onTutorFunctionClick={handleTutorFunctionClick}
          />
        </div>
      </div>

      <NotesDialog 
        open={notesDialogOpen}
        onOpenChange={setNotesDialogOpen}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        onSubmit={handleSubmitNotes}
      />
    </div>
  );
};

export default AITutorChat;
