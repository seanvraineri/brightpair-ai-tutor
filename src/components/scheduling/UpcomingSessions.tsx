
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface SessionItemProps {
  title: string;
  date: Date;
  time: string;
  tutor: string;
  subject: string;
  onClick: () => void;
}

const SessionItem: React.FC<SessionItemProps> = ({
  title,
  date,
  time,
  tutor,
  subject,
  onClick,
}) => (
  <div
    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-medium">{title}</h3>
      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
        {subject}
      </span>
    </div>
    
    <div className="flex items-center text-sm text-gray-500 mb-1">
      <CalendarIcon size={14} className="mr-1" />
      <span>{format(date, "PPP")}</span>
    </div>
    
    <div className="flex items-center text-sm text-gray-500 mb-3">
      <Clock size={14} className="mr-1" />
      <span>{time}</span>
    </div>
    
    <div className="text-sm">
      <span className="text-gray-600">Tutor:</span> {tutor}
    </div>
  </div>
);

const UpcomingSessions: React.FC = () => {
  // Mock upcoming sessions data
  const upcomingSessions = [
    {
      id: 1,
      title: "Math Tutoring",
      date: new Date(2025, 5, 4),
      time: "4:00 PM",
      tutor: "Dr. Smith",
      subject: "Mathematics",
    },
    {
      id: 2,
      title: "Physics Review",
      date: new Date(2025, 5, 6),
      time: "3:30 PM",
      tutor: "Prof. Johnson",
      subject: "Science",
    },
    {
      id: 3,
      title: "English Essay Help",
      date: new Date(2025, 5, 10),
      time: "5:00 PM",
      tutor: "Ms. Williams",
      subject: "English",
    },
  ];

  const handleSessionClick = (id: number) => {
    console.log(`Session ${id} clicked`);
    // Add navigation to session details or actions
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
              title={session.title}
              date={session.date}
              time={session.time}
              tutor={session.tutor}
              subject={session.subject}
              onClick={() => handleSessionClick(session.id)}
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
