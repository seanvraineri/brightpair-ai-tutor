
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ScheduleItemProps {
  date: string;
  title: string;
  subtitle: string;
  duration: string;
  onClick: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ date, title, subtitle, duration, onClick }) => {
  return (
    <div 
      className="rounded-lg border border-gray-200 p-3 hover:border-brightpair-300 hover:bg-brightpair-50 transition-colors cursor-pointer" 
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <Calendar size={16} className="text-brightpair mr-2" />
        <span className="text-sm font-medium">{date}</span>
      </div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
      <div className="flex items-center text-xs text-gray-500">
        <Clock size={14} className="mr-1" /> {duration}
      </div>
    </div>
  );
};

const UpcomingSchedule: React.FC = () => {
  const { toast } = useToast();
  
  const showNotification = (message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  };

  const scheduleItems = [
    {
      date: "Today, 4:00 PM",
      title: "Math Tutoring Session",
      subtitle: "Algebra Review",
      duration: "45 minutes",
      notification: "Math session details opened"
    },
    {
      date: "Tomorrow, 5:30 PM",
      title: "Biology Quiz",
      subtitle: "Cell Structure",
      duration: "30 minutes",
      notification: "Biology quiz details opened"
    }
  ];

  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>Upcoming Schedule</CardTitle>
        <CardDescription>Your next learning sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduleItems.map((item, idx) => (
            <ScheduleItem
              key={idx}
              date={item.date}
              title={item.title}
              subtitle={item.subtitle}
              duration={item.duration}
              onClick={() => showNotification(item.notification)}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          View Full Schedule
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingSchedule;
