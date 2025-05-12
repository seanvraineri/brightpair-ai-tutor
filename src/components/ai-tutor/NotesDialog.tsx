import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileText, Upload, FileX } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteContent: string;
  setNoteContent: (content: string) => void;
  onSubmit: () => void;
}

const NotesDialog: React.FC<NotesDialogProps> = ({
  open,
  onOpenChange,
  noteContent,
  setNoteContent,
  onSubmit,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type and size
      const allowedTypes = [
        'application/pdf', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/msword', // doc
        'text/plain',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
        'application/vnd.ms-powerpoint' // ppt
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, Word document, text file, or PowerPoint",
          variant: "destructive",
        });
        return;
      }
      
      // 10MB limit
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitWithFile = () => {
    if (file) {
      setIsUploading(true);
      
      // Simulate file processing (in a real implementation, this would extract text from the file)
      setTimeout(() => {
        setIsUploading(false);
        toast({
          title: "Document processed",
          description: `${file.name} has been processed and added to the chat.`,
        });
        onSubmit();
      }, 1500);
    } else {
      // If no file, just submit the text notes
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">Upload Your Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Paste your notes below or upload a document, and I'll analyze them to help with your studies.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Document (Optional)</Label>
            
            {!file ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOCX, TXT, PPT (Max 10MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt,.pptx,.ppt"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-brightpair mr-2" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRemoveFile}
                    disabled={isUploading}
                  >
                    <FileX className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Label htmlFor="note-content" className="mb-1 block">Or type your notes</Label>
            <Textarea 
              id="note-content"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Paste or type your notes here..."
              className="min-h-[150px] focus:border-brightpair focus:ring-brightpair"
              disabled={isUploading}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitWithFile} 
              className="bg-brightpair hover:bg-brightpair-600"
              disabled={isUploading || (!file && !noteContent.trim())}
            >
              {isUploading ? "Processing..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
