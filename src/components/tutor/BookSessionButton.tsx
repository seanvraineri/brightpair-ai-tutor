
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import TutoringSessionModal from "../scheduling/TutoringSessionModal";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BookSessionButtonProps {
  tutorId: string;
  tutorName: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const BookSessionButton: React.FC<BookSessionButtonProps> = ({
  tutorId,
  tutorName,
  variant = "default",
  size = "default",
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>("4:00 PM");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookSession = () => {
    setIsModalOpen(true);
  };

  const handleSchedule = (sessionData: any) => {
    toast({
      title: "Session Scheduled",
      description: `Your session with ${tutorName} has been scheduled for ${sessionData.date.toDateString()} at ${sessionData.time}`,
    });
    setIsModalOpen(false);
    
    // In a real app, you would save the session to the database here
    // and then navigate to the scheduling page
    navigate("/scheduling");
  };

  return (
    <>
      <Button
        onClick={handleBookSession}
        variant={variant}
        size={size}
        className={className}
      >
        <Calendar className="mr-2 h-4 w-4" /> Book Session
      </Button>

      <TutoringSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleSchedule}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        selectedTutorId={tutorId}
        selectedTutorName={tutorName}
      />
    </>
  );
};

export default BookSessionButton;
