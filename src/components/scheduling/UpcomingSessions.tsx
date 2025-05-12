
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface SessionItemProps {
  id: number;
  title: string;
  date: Date;
  time: string;
  duration: string;
  tutor: string;
  subject: string;
  mode: "remote" | "in-person";
  location?: string;
  onClick: () => void;
  onCancel: () => void;
}

const SessionItem: React.FC<SessionItemProps> = ({
  id,
  title,
  date,
  time,
  duration,
  tutor,
  subject,
  mode,
  location,
  onClick,
  onCancel,
}) => (
  <div
    className="border rounded-md p-4 hover:bg-gray-50 transition-colors"
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-medium">{title}</h3>
      <Badge variant={mode === "remote" ? "secondary" : "outline"}>
        {mode === "remote" ? "Online" : "In-Person"}
      </Badge>
    </div>
    
    <div className="flex items-center text-sm text-gray-500 mb-1">
      <CalendarIcon size={14} className="mr-1" />
      <span>{format(date, "PPP")}</span>
    </div>
    
    <div className="flex items-center text-sm text-gray-500 mb-1">
      <Clock size={14} className="mr-1" />
      <span>{time} ({duration})</span>
    </div>

    {mode === "in-person" && location && (
      <div className="flex items-center text-sm text-gray-500 mb-3">
        <MapPin size={14} className="mr-1" />
        <span>{location}</span>
      </div>
    )}
    
    <div className="text-sm mb-3">
      <div><span className="text-gray-600">Tutor:</span> {tutor}</div>
      <div><span className="text-gray-600">Subject:</span> {subject}</div>
    </div>

    <div className="flex justify-between mt-3">
      <Button variant="outline" size="sm" onClick={onClick}>
        View Details
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
      >
        <X className="mr-1 h-4 w-4" />
        Cancel Session
      </Button>
    </div>
  </div>
);

const UpcomingSessions: React.FC = () => {
  const { toast } = useToast();
  
  // Mock upcoming sessions data
  const upcomingSessions = [
    {
      id: 1,
      title: "Math Tutoring",
      date: new Date(2025, 5, 4),
      time: "4:00 PM",
      duration: "1 hour",
      tutor: "Dr. Smith",
      subject: "Mathematics",
      mode: "remote" as const,
    },
    {
      id: 2,
      title: "Physics Review",
      date: new Date(2025, 5, 6),
      time: "3:30 PM",
      duration: "45 minutes",
      tutor: "Prof. Johnson",
      subject: "Science",
      mode: "in-person" as const,
      location: "University Library, Room 204"
    },
    {
      id: 3,
      title: "English Essay Help",
      date: new Date(2025, 5, 10),
      time: "5:00 PM",
      duration: "1.5 hours",
      tutor: "Ms. Williams",
      subject: "English",
      mode: "remote" as const,
    },
  ];

  const handleSessionClick = (id: number) => {
    toast({
      title: "Session Details",
      description: `Viewing details for session #${id}`,
    });
    // In a real app, you would navigate to the session details page or show a modal
  };

  const handleSessionCancel = (id: number) => {
    toast({
      title: "Session Cancelled",
      description: `Session #${id} has been cancelled`,
    });
    // In a real app, you would update the database to cancel the session
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Sessions</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {upcomingSessions.map((session) => (
            <SessionItem
              key={session.id}
              id={session.id}
              title={session.title}
              date={session.date}
              time={session.time}
              duration={session.duration}
              tutor={session.tutor}
              subject={session.subject}
              mode={session.mode}
              location={session.location}
              onClick={() => handleSessionClick(session.id)}
              onCancel={() => handleSessionCancel(session.id)}
            />
          ))}
          
          {upcomingSessions.length === 0 && (
            <p className="text-center text-gray-500 py-6">
              No upcoming sessions scheduled
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessions;
