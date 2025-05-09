
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} className="bg-brightpair hover:bg-brightpair-600">
              Submit Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
