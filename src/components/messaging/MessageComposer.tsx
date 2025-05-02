
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, Send } from "lucide-react";
import { useMessages } from "@/contexts/MessageContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";

interface MessageComposerProps {
  recipientId: string;
  recipientName: string;
  recipientRole: 'student' | 'teacher' | 'parent';
  onMessageSent?: () => void;
  replyToSubject?: string;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  recipientId,
  recipientName,
  recipientRole,
  onMessageSent,
  replyToSubject = ""
}) => {
  const [subject, setSubject] = useState(replyToSubject ? `Re: ${replyToSubject}` : "");
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { sendMessage } = useMessages();
  const { user } = useUser();
  const { toast } = useToast();
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };
  
  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };
  
  const handleSendMessage = () => {
    if (!content.trim()) {
      toast({
        title: "Cannot send empty message",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }
    
    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter a subject for your message.",
        variant: "destructive"
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }
    
    // Mocked attachment processing - in a real app, you'd upload these files
    const attachments = selectedFiles.length > 0 
      ? selectedFiles.map((file, index) => ({
          id: `att-${Date.now()}-${index}`,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file), // This is just for mock purposes
          size: file.size
        }))
      : undefined;
    
    sendMessage({
      senderId: user.role === 'student' ? 'student1' : (user.role === 'teacher' ? 'teacher1' : 'parent1'),
      senderName: user.name || 'User',
      senderRole: user.role,
      recipientId,
      recipientName,
      subject,
      content,
      attachments
    });
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully."
    });
    
    // Reset form
    setSubject("");
    setContent("");
    setSelectedFiles([]);
    
    if (onMessageSent) {
      onMessageSent();
    }
  };
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="font-semibold mb-4">New Message</h2>
      
      <div className="mb-4">
        <Label htmlFor="recipient">To</Label>
        <Input 
          id="recipient"
          value={recipientName}
          disabled
          className="bg-gray-50"
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="subject">Subject</Label>
        <Input 
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject..."
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message here..."
          className="min-h-[150px]"
        />
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="mb-4">
          <Label>Attachments</Label>
          <div className="mt-2 space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <div className="text-sm truncate">{file.name}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveFile(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center">
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileSelect}
          />
          <Label 
            htmlFor="file-upload" 
            className="flex items-center cursor-pointer text-sm text-gray-600 hover:text-gray-800"
          >
            <Paperclip className="h-4 w-4 mr-1" />
            Attach Files
          </Label>
        </div>
        
        <Button 
          onClick={handleSendMessage} 
          disabled={isUploading || !content.trim() || !subject.trim()}
          className="flex items-center"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default MessageComposer;
