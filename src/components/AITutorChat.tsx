import React, { useState, useEffect, useRef } from "react";
import { FileText, MessageSquare, Mic, BookOpen } from "lucide-react";
import { useAITutor } from "@/hooks/useAITutor";
import { useUser } from "@/contexts/UserContext";
import { formatMessage } from "@/utils/messageFormatters";
import ChatHeader from "@/components/ai-tutor/ChatHeader";
import QuickActions from "@/components/ai-tutor/QuickActions";
import MessageList from "@/components/ai-tutor/MessageList";
import MessageInput from "@/components/ai-tutor/MessageInput";
import NotesDialog from "@/components/ai-tutor/NotesDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TutorFunction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const AITutorChat: React.FC = () => {
  const { user } = useUser();
  const { 
    messages, 
    sendMessage, 
    clearConversation, 
    isLoading,
    learningHistory,
    isLoadingHistory,
    refreshLearningHistory
  } = useAITutor();
  const [notesDialogOpen, setNotesDialogOpen] = useState<boolean>(false);
  const [noteContent, setNoteContent] = useState<string>("");
  const [tutorFunctionOpen, setTutorFunctionOpen] = useState<boolean>(false);
  const [showHomeworkDetails, setShowHomeworkDetails] = useState<boolean>(false);
  const [activeHomeworkId, setActiveHomeworkId] = useState<string | null>(null);
  
  // Use a ref to detect when we should inject homework context
  const lastUserMessageRef = useRef<string>("");
  
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
  
  // Effect to detect homework-related queries and show relevant homework details
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        lastUserMessageRef.current = lastMessage.content.toLowerCase();
        
        // Check if message is about homework
        if (
          lastUserMessageRef.current.includes('homework') || 
          lastUserMessageRef.current.includes('assignment') ||
          lastUserMessageRef.current.includes('help me with') ||
          lastUserMessageRef.current.includes('my work')
        ) {
          setShowHomeworkDetails(true);
          // If we've got homework data, try to set an active homework
          if (learningHistory?.homework?.length > 0) {
            // Default to the most recent homework
            setActiveHomeworkId(learningHistory.homework[0].id);
          }
        }
      }
    }
  }, [messages]);
  
  // Fetch fresh learning history data when showing homework details
  useEffect(() => {
    if (showHomeworkDetails) {
      refreshLearningHistory();
    }
  }, [showHomeworkDetails]);

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
  
  const handleSelectHomework = async (homeworkId: string) => {
    // Set active homework
    setActiveHomeworkId(homeworkId);
    
    // Find the selected homework
    const homework = learningHistory?.homework.find(hw => hw.id === homeworkId);
    
    if (homework) {
      // Send a message that references this specific homework
      await sendMessage(`I need help with my homework assignment "${homework.title}" for ${homework.subject}. ${homework.description ? `Here's what I need to do: ${homework.description}` : ''}`);
      
      // Once we've sent the message, we can hide the homework details panel
      setShowHomeworkDetails(false);
    }
  };

  // Subtitle for chat header
  const getSubtitle = () => {
    if (user?.gamification?.learningStyle) {
      return `Personalized for your ${user.gamification.learningStyle} learning style`;
    }
    return undefined;
  };

  // Format learning history summary for quick reference
  const renderLearningContextBadges = () => {
    if (isLoadingHistory) {
      return (
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
      );
    }
    
    if (!learningHistory || (
      !learningHistory.homework.length && 
      !learningHistory.quizzes.length &&
      !learningHistory.lessons.length &&
      !learningHistory.tracks.length
    )) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-2 mb-2">
        {learningHistory.homework.length > 0 && (
          <Badge 
            variant="outline" 
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
            onClick={() => setShowHomeworkDetails(prev => !prev)}
          >
            {learningHistory.homework.length} Homework{learningHistory.homework.length > 1 ? 's' : ''}
          </Badge>
        )}
        
        {learningHistory.quizzes.length > 0 && (
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            {learningHistory.quizzes.length} Quiz{learningHistory.quizzes.length > 1 ? 'zes' : ''}
          </Badge>
        )}
        
        {learningHistory.lessons.length > 0 && (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
            {learningHistory.lessons.length} Lesson{learningHistory.lessons.length > 1 ? 's' : ''}
          </Badge>
        )}
        
        {learningHistory.tracks.length > 0 && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
            {learningHistory.tracks.length} Active Track{learningHistory.tracks.length > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    );
  };
  
  // Render the homework details panel when a user mentions homework
  const renderHomeworkDetailsPanel = () => {
    if (!showHomeworkDetails || !learningHistory?.homework?.length) {
      return null;
    }
    
    return (
      <div className="mb-4 animate-fadeIn">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-brightpair-700">Your Homework Assignments</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHomeworkDetails(false)}
              >
                Hide
              </Button>
            </div>
            <div className="space-y-2">
              {learningHistory.homework.map((hw) => (
                <div 
                  key={hw.id}
                  className={`p-2 border rounded-md cursor-pointer transition-colors ${
                    activeHomeworkId === hw.id 
                      ? 'bg-brightpair-50 border-brightpair-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectHomework(hw.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{hw.title}</span>
                    <Badge variant={hw.status === 'pending' ? 'outline' : 'secondary'}>
                      {hw.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{hw.subject}</div>
                  {hw.description && (
                    <div className="text-sm mt-1 text-gray-600 line-clamp-2">{hw.description}</div>
                  )}
                  {hw.due_date && (
                    <div className="text-xs mt-1 text-gray-500">
                      Due: {new Date(hw.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Add some CSS for better math rendering
  const styles = {
    mathContent: `
      .math-content {
        font-family: 'Cambria Math', 'Times New Roman', serif;
        line-height: 1.5;
        padding: 0.25rem 0;
      }
      
      .equation-block {
        background-color: #f5f8ff;
        border-radius: 0.375rem;
        padding: 0.75rem;
        margin: 0.75rem 0;
        overflow-x: auto;
        font-family: 'Cambria Math', 'Times New Roman', serif;
        border-left: 3px solid #4263eb;
      }
    `
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
        
        {renderLearningContextBadges()}
        
        {renderHomeworkDetailsPanel()}
        
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
