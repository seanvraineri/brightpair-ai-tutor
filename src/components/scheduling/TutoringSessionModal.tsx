
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
import { useToast } from "@/components/ui/use-toast";

interface TutoringSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (sessionData: any) => void;
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
  selectedTutorId?: string;
  selectedTutorName?: string;
}

const TutoringSessionModal: React.FC<TutoringSessionModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  selectedDate,
  selectedTimeSlot,
  selectedTutorId,
  selectedTutorName,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("60");
  const [mode, setMode] = useState("remote");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a date and time for your session",
        variant: "destructive",
      });
      return;
    }
    
    onSchedule({
      title,
      subject,
      description,
      date: selectedDate,
      time: selectedTimeSlot,
      duration: Number(duration),
      mode,
      tutorId: selectedTutorId,
      tutorName: selectedTutorName,
    });
    
    // Reset form
    setTitle("");
    setSubject("");
    setDescription("");
    setDuration("60");
    setMode("remote");
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
            {selectedTutorName && ` with ${selectedTutorName}`}
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

          <div className="grid grid-cols-2 gap-4">
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
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration} required>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Session Mode</Label>
            <Select value={mode} onValueChange={setMode} required>
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select session mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Remote (Online)</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
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

          {selectedTutorName && (
            <div className="pt-2">
              <Label>Tutor</Label>
              <Input
                value={selectedTutorName}
                disabled
                className="bg-gray-50"
              />
            </div>
          )}

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
