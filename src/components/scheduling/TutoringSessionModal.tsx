
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface TutoringSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (sessionData: any) => void;
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
}

const TutoringSessionModal: React.FC<TutoringSessionModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  selectedDate,
  selectedTimeSlot,
}) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule({
      title,
      subject,
      description,
      date: selectedDate,
      time: selectedTimeSlot,
    });
    
    // Reset form
    setTitle("");
    setSubject("");
    setDescription("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Tutoring Session</DialogTitle>
          <DialogDescription>
            {selectedDate && selectedTimeSlot
              ? `Create a new session for ${format(selectedDate, "PPP")} at ${selectedTimeSlot}`
              : "Select date and time for your session"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Math Tutoring, Science Help, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="history">History</SelectItem>
                <SelectItem value="language">Foreign Language</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What topics would you like to cover in this session?"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 pt-2">
            <div className="flex-1">
              <Label>Date</Label>
              <Input
                value={selectedDate ? format(selectedDate, "PPP") : ""}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div className="flex-1">
              <Label>Time</Label>
              <Input
                value={selectedTimeSlot || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Schedule Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TutoringSessionModal;
