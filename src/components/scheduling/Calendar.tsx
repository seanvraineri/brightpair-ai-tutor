
import React, { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import TutoringSessionModal from "./TutoringSessionModal";

// Mock tutors - in a real app, this would come from an API
const TUTORS = [
  { id: "1", name: "Dr. Alex Johnson", subjects: ["Mathematics", "Physics"] },
  { id: "2", name: "Sarah Williams", subjects: ["English Literature", "Writing"] },
  { id: "3", name: "Michael Chen", subjects: ["Computer Science", "Programming"] },
  { id: "4", name: "Dr. Emily Rodriguez", subjects: ["Biology", "Chemistry"] },
  { id: "5", name: "James Wilson", subjects: ["History", "Political Science"] },
];

const Calendar = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedTutorId, setSelectedTutorId] = useState<string>("");

  // Mock tutoring sessions
  const sessions = [
    {
      date: new Date(2025, 5, 4),
      time: "16:00",
      title: "Math Tutoring",
      tutor: "Dr. Smith",
    },
    {
      date: new Date(2025, 5, 6),
      time: "15:30",
      title: "Physics Review",
      tutor: "Prof. Johnson",
    },
    {
      date: new Date(2025, 5, 10),
      time: "17:00",
      title: "English Essay Help",
      tutor: "Ms. Williams",
    },
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setIsSessionModalOpen(true);
  };

  const handleSessionSchedule = (sessionData: any) => {
    setIsSessionModalOpen(false);
    toast({
      title: "Session Scheduled",
      description: `${sessionData.title} scheduled for ${format(date!, "PPP")} at ${selectedTimeSlot}`,
    });
  };

  // Get the selected tutor name based on the ID
  const getSelectedTutorName = () => {
    const tutor = TUTORS.find(t => t.id === selectedTutorId);
    return tutor ? tutor.name : "";
  };

  // Filter sessions for the selected date
  const selectedDateSessions = sessions.filter(
    (session) => date && session.date.toDateString() === date.toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date for your tutoring session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <CalendarUI
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                className="rounded-md border shadow-sm"
                initialFocus
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Available Time Slots</CardTitle>
            <CardDescription>
              {date ? `Select a time on ${format(date, "PPPP")}` : "Choose a date first"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tutor (Optional)
              </label>
              <Select value={selectedTutorId} onValueChange={setSelectedTutorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Available Tutor</SelectItem>
                  {TUTORS.map(tutor => (
                    <SelectItem key={tutor.id} value={tutor.id}>
                      {tutor.name} - {tutor.subjects.join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {date ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {timeSlots.map((timeSlot) => (
                  <Button
                    key={timeSlot}
                    variant="outline"
                    className="text-center hover:bg-brightpair/10 hover:text-brightpair"
                    onClick={() => handleTimeSlotSelect(timeSlot)}
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">
                Please select a date to see available time slots
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scheduled Sessions for the Selected Date */}
      <Card>
        <CardHeader>
          <CardTitle>
            {date ? `Sessions on ${format(date, "PP")}` : "Scheduled Sessions"}
          </CardTitle>
          <CardDescription>
            {date
              ? "Your tutoring sessions for the selected date"
              : "Select a date to view sessions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDateSessions.length > 0 ? (
            <div className="space-y-3">
              {selectedDateSessions.map((session, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-gray-500">
                        {format(session.date, "PP")} at {session.time}
                      </p>
                    </div>
                    <p className="text-sm">Tutor: {session.tutor}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">
              {date
                ? "No sessions scheduled for this date"
                : "Select a date to view sessions"}
            </p>
          )}
        </CardContent>
      </Card>

      <TutoringSessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onSchedule={handleSessionSchedule}
        selectedDate={date}
        selectedTimeSlot={selectedTimeSlot}
        selectedTutorId={selectedTutorId || undefined}
        selectedTutorName={selectedTutorId ? getSelectedTutorName() : undefined}
      />
    </div>
  );
};

export default Calendar;
